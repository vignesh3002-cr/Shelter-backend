import express from "express";
import axios from "axios";
import { getLoginUser } from "../services/d365Services.js";
import { ResetPassword } from "../services/d365Services.js";
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
        res.status(500).json({ message: "Internal server error" });
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
