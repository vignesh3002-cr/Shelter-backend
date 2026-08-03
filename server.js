import "dotenv/config";
import express from "express";
import cors from "cors";
import loginRoute from "./routes/login.js";
import projectReportRoute from "./routes/projectReport.js";
import uploadRoute from "./routes/uploadRoute.js";
import reviewTime from "./routes/TimeManagement.js";
import { setEnvironment } from "./config/configManager.js";

 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

app.post("/change-environment", (req, res) => {

    const { environment } = req.body;
    console.log("Requested Environment Change:", environment);
    if (
        environment !== "Development" &&
        environment !== "Production"
    ) {
        return res.status(400).json({
            message: "Invalid environment"
        });
    }

    setEnvironment(environment);
    console.log("Environment server.js changed to:", environment);

    res.json({
        success: true,
        environment
    });

});


app.use("/api/auth", loginRoute);

app.use("/api/projects", projectReportRoute);
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