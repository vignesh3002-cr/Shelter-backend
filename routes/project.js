import express from "express";
const router = express.Router();

import { verifyToken } from "../middleware/authMiddleware.js";
import { getProjects } from "../services/d365Services.js";

router.get(
  "/my-projects",
  async (req, res) => {

    const projects = await getProjects();

    res.json(projects);
  }
);

export default router;
