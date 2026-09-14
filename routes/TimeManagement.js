import express from "express";
import {getViewTime} from "../services/d365Services.js";
import {updateTaskEndDate} from "../services/d365Services.js";
const router =
  express.Router();
  router.post("/ViewTime", async (req, res) => {
    try {

      const { projectId } =req.body;
      const timeData = await getViewTime(projectId);
        console.log(
          "VIEW TIME DATA:",
          timeData
        );
        res.json(timeData);
    } catch (error) {
      console.error("Error fetching view time data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  router.post("/update-date", async (req, res) => {

    try {
      const { projectId, wbsId, taskEndDate } = req.body;
      await updateTaskEndDate(projectId, wbsId, taskEndDate);
      res.json({ message: "Task end date updated successfully" });
    } catch (error) {
      console.error("Error updating task end date:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


export default router;
