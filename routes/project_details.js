import express from "express";
const router = express.Router();

import {getProjectDetails} from "../services/d365Services.js";

router.get(
    "/:projectId",
    async (req, res) => {
        try {
            const { projectId } = req.params;
            const projectDetails = await getProjectDetails(projectId);
            console.log("successfully fetched project details from d365");
            res.json(projectDetails);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to fetch project details" });
        }
    }
);

export default router;