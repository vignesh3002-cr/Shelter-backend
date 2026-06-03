import express from "express";
const router = express.Router();

import { verifyToken } from "../middleware/authMiddleware.js";
import { getProjects } from "../services/d365Services.js";

router.get(
  "/my-projects/:userRecId",
  async (req, res) => {

    console.log("Route Hit");

    const { userRecId } = req.params;

    console.log("User RecId:", userRecId);

    const projects =
      await getProjects(userRecId);

    res.json(projects);
  }
);

export default router;
