import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { getLoginUser } from "../services/d365Services.js";
import { ResetPassword } from "../services/d365Services.js";
const router = express.Router();



const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
router.post("/login", async (req, res) => {

    try {

        const { UserID, password } = req.body;

        if (UserID === process.env.ADMIN_USERID && password === process.env.ADMIN_PASSWORD) {

            return res.json({
                success: true,
                otpRequired: false,
                isAdmin: true,
                user: {
                    UserID: process.env.ADMIN_USERID,
                    Role: "Admin"
                }
            });
            console.log("Admin login successful");

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
            await transporter.verify();
            console.log("SMTP Ready");
        } catch (smtpVerifyError) {
            console.error("SMTP verify failed:", smtpVerifyError);
            return res.status(502).json({
                success: false,
                otpRequired: false,
                message: "OTP email could not be sent. Please verify the SMTP credentials or Gmail app password."
            });
        }

        try {
            await transporter.sendMail({

                to: `${UserID}`,

                subject: "ERP Notification",

                html: `

         <h2>Shelter Analytics</h2>

         <p>Your OTP is</p>

         <h1>${otp}</h1>

         <p>Expires in 5 minutes.</p>

         `

            });
        } catch (smtpSendError) {
            console.error("SMTP send failed:", smtpSendError);
            return res.status(502).json({
                success: false,
                otpRequired: false,
                message: "OTP email could not be sent. Please verify the SMTP credentials or Gmail app password."
            });
        }

        console.log(`OTP sent to ${UserID}:`, otp);


        console.log({

            otpRequired: true,

            otpToken

        });
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
        console.log("BODY:", req.body);
        const { UserId, newPassword } = req.body;
        console.log("UserId:", UserId);
        console.log("newPassword:", newPassword);
        const result = await ResetPassword(UserId, newPassword);
        console.log("Password reset result from d365:", result);
        res.json(result);
    } catch (error) {
        console.log("Error occurred while resetting password:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


export default router;
