import express from "express";
const router = express.Router();

import { verifyToken } from "../middleware/authMiddleware.js";
import { getProjects } from "../services/d365Services.js";

router.get(
  "/my-projects/:userId",
    async (req, res) => {

        try {

            const { userId } =
  req.params;

const projects =
  await getProjects();

const filteredProjects =
  projects.filter(

    project =>

      project.CreatedBy ===
      userId

  );

res.json(filteredProjects);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

export default router;