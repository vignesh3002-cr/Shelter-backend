import express from "express";
import axios from "axios";
import { getLoginUser } from "../services/d365Services.js";
const router = express.Router();


router.post("/login", async (req, res) => {

    
    try {
        const {UserID, password } = req.body;
        const user = await getLoginUser(UserID, password);
        console.log("Login user from d365:", user);
        res.json(user)
    }
        catch (error) {
        console.log("Error occurred while logging in:", error);
        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                message: "D365 service unavailable",
                details: error.response.data
            });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;