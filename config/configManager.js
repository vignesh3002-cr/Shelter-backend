import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import environments from "./environments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configFile = path.resolve(__dirname, "..", "environment.json");

// Read the active environment when the server starts
const data = JSON.parse(fs.readFileSync(configFile, "utf8"));
let currentEnvironment = data.environment;

function getConfig() {
    return environments[currentEnvironment];
}

function getCurrentEnvironment() {
    return currentEnvironment;
}

function setEnvironment(env) {

    currentEnvironment = env;
    fs.writeFileSync(
        configFile,
        JSON.stringify({ environment: env }, null, 2)
    );
}

export {
    getConfig,
    getCurrentEnvironment,
    setEnvironment,
};