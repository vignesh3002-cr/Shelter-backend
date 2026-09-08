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
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


router.post("/login", async (req, res) => {
    try {

        const { UserID, password } = req.body;

        // ADMIN LOGIN
        if (
            UserID === process.env.ADMIN_USERID &&
            password === process.env.ADMIN_PASSWORD
        ) {

            console.log("Admin login successful");

            return res.json({
                success: true,
                otpRequired: false,
                isAdmin: true,
                user: {
                    UserID: process.env.ADMIN_USERID,
                    Role: "Admin"
                }
            });
        }

        // NORMAL USER LOGIN
        const user = await getLoginUser(
            UserID,
            password
        );

        if (user["Login status"] !== "YES") {
            return res.json(user);
        }

        // GENERATE OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpHash = await bcrypt.hash(
            otp,
            10
        );

        // CREATE OTP JWT
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

        // CHECK SMTP
        try {

            console.log("Checking SMTP connection...");
            console.log("SMTP_HOST:", process.env.SMTP_HOST);
            console.log("SMTP_PORT:", process.env.SMTP_PORT);
            console.log("EMAIL_USER:", process.env.EMAIL_USER);
            console.log(
                "EMAIL_PASS exists:",
                !!process.env.EMAIL_PASS
            );

            await transporter.verify();

            console.log("SMTP Ready");

        } catch (smtpVerifyError) {

            console.error(
                "SMTP VERIFY ERROR:",
                smtpVerifyError
            );

            return res.status(502).json({
                success: false,
                otpRequired: false,
                message:
                    "OTP email could not be sent. Please check SMTP configuration."
            });
        }

        // SEND OTP
        try {

            await transporter.sendMail({

                from: `"Shelter Analytics" <${process.env.EMAIL_USER}>`,

                to: UserID,

                subject: "ERP Notification",

                html: `
                    <h2>Shelter Analytics</h2>

                    <p>Your OTP is:</p>

                    <h1>${otp}</h1>

                    <p>Expires in 5 minutes.</p>
                `
            });

            console.log(
                `OTP email sent successfully to ${UserID}`
            );

        } catch (smtpSendError) {

            console.error(
                "SMTP SEND ERROR:",
                smtpSendError
            );

            return res.status(502).json({
                success: false,
                otpRequired: false,
                message:
                    "OTP email could not be sent."
            });
        }

        console.log(`OTP generated for ${UserID}`);

        return res.json({
            success: true,
            otpRequired: true,
            otpToken
        });

    } catch (err) {

        console.error("LOGIN ERROR:", err);

        return res.status(
            err.status || 500
        ).json({
            success: false,
            otpRequired: false,
            message:
                err.message || "Server Error"
        });
    }
});

export default router;
