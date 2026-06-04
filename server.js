import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import loginRoute from "./routes/login.js";
import projectRoute from "./routes/project.js";
import projectReportRoute
from "./routes/projectReport.js";
import uploadRoute from "./routes/uploadRoute.js";
import reviewTime from "./routes/TimeManagement.js";



dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));
app.use("/api/auth", loginRoute);

app.use("/api/projects", projectRoute);
app.use(
  "/api/project-report",
  projectReportRoute
);
app.use(
  "/api/upload",
  uploadRoute
);
app.use("/api/time-management", reviewTime);
app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});