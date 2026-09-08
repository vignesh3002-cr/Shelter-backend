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
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or use a different port.`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});