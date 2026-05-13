import express from "express";
const router = express.Router();

import { verifyToken } from "../middleware/authMiddleware.js";
import { getProjects } from "../services/d365Services.js";

router.get(
    "/my-projects",
    async (req, res) => {

        try {

            const projects = await getProjects();
           /* const projects = [
                {
                    id: "PROJ001",
                    name: "Project Alpha",
                    assignedEmployeeId: "EMP001"
                }];  */
           // const employeeId =
                //req.user.employeeId;

            // Filter projects assigned
            // to logged-in user

           // const assignedProjects =
             /*   projects.filter(project =>
                    project.assignedEmployeeId ===
                    employeeId
                );*/
            console.log("successfully fetched projects from d365");
             res.json(projects);

        } catch (error) {

            console.log(error);

            res.status(500).json({
                message: "Server Error"
            });
        }
    }
);

export default router;