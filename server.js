import "dotenv/config";
import express from "express";
import cors from "cors";
import loginRoute from "./routes/login.js";
import projectReportRoute from "./routes/projectReport.js";
import uploadRoute from "./routes/uploadRoute.js";
import reviewTime from "./routes/TimeManagement.js";
import projects from "./routes/project.js";
import { setEnvironment } from "./config/configManager.js";
import { requireAdmin } from "./middleware/requireAdmin.js";


const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true
}));

app.post("/change-environment", requireAdmin, (req, res) => {

    const { environment } = req.body;
    if (
        environment !== "Development" &&
        environment !== "Production"
    ) {
        return res.status(400).json({
            message: "Invalid environment"
        });
    }

    setEnvironment(environment);

    res.json({
        success: true,
        environment
    });

});


app.use("/api/auth", loginRoute);

app.use("/api/projects", projects);
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