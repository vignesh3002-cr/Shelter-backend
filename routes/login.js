import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getLoginUser } from "../services/d365Services.js";
import { ResetPassword } from "../services/d365Services.js";
const router = express.Router();




router.post("/login", async (req, res) => {

    try {

        const { UserID, password } = req.body;

        if (UserID === process.env.ADMIN_USERID) {

            const validAdminPassword = await bcrypt.compare(
                password || "",
                process.env.ADMIN_PASSWORD_HASH || ""
            );

            if (!validAdminPassword) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials"
                });
            }

            const adminToken = jwt.sign(
                { UserID: process.env.ADMIN_USERID, isAdmin: true },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.json({
                success: true,
                otpRequired: false,
                isAdmin: true,
                adminToken,
                user: {
                    UserID: process.env.ADMIN_USERID,
                    Role: "Admin"
                }
            });

        }

        const user =
            await getLoginUser(
                UserID,
                password
            );


        if (
            user["Login status"] !== "YES"
        ) {

            return res.json(user);

        }

        const otp =
            Math.floor(
                100000 +
                Math.random() * 900000
            ).toString();

        const otpHash =
            await bcrypt.hash(
                otp,
                10
            );

        const otpToken = jwt.sign(
            {
                UserID,
                otpHash,
                user
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "5m"
            }
        );




        try {

    const response = await axios.post(
        "https://api.smtp2go.com/v3/email/send",

        {
            sender: "erp.notification@shelter.co",

            to: [
                UserID
            ],

            subject: "ERP Notification",

            html_body: `
                <h2>Shelter Analytics</h2>

                <p>Your OTP is</p>

                <h1>${otp}</h1>

                <p>Expires in 5 minutes.</p>
            `
        },

        {
            headers: {
                "X-Smtp2go-Api-Key":
                    process.env.SMTP2GO_API_KEY,

                "Content-Type":
                    "application/json"
            },

            timeout: 10000
        }
    );


    console.log(
        "OTP email sent successfully through SMTP2GO:",
        response.data
    );

} catch (emailError) {

    console.error(
        "SMTP2GO email sending failed:",
        emailError.response?.data || emailError.message
    );

    return res.status(502).json({

        success: false,

        otpRequired: false,

        message:
            "OTP email could not be sent. Please try again later."

    });

}
        res.json({

            otpRequired: true,
            otpToken

        });


    }

    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            otpRequired: false,
            message: "Server Error"

        });

    }

});

router.post("/verify-otp", async (req, res) => {

    const { otp, otpToken } = req.body;

    try {
        const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

        const valid = await bcrypt.compare(otp, decoded.otpHash);

        if (!valid) {
            return res.json({
                success: false
            });

        }
        res.json({
            success: true,
            user:
                decoded.user
        });
    }

    catch {
        res.json({
            success: false,
            message:
                "OTP expired"
        });
    }
});


router.post("/ResetPassword", async (req, res) => {
    try {
        const { UserId, newPassword } = req.body;
        const result = await ResetPassword(UserId, newPassword);
        res.json(result);
    } catch (error) {
        console.log("Error occurred while resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default router;
