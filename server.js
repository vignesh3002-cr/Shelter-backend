import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import loginRoute from "../backend/routes/login.js";
import projectRoute from "../backend/routes/project.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", loginRoute);

app.use("/api/projects", projectRoute);

app.listen(process.env.PORT, () => {

    console.log(
        `Server running on port ${process.env.PORT}`
    );

});