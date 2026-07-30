import fs from "fs";
import environments from "./environments.js";

const configFile = "./environment.json";

// Read the active environment when the server starts
const data = JSON.parse(fs.readFileSync(configFile, "utf8"));
console.log("Active Environment on server start:", data.environment);
let currentEnvironment = data.environment;

function getConfig() {
    console.log("Current Environment:", currentEnvironment);
    return environments[currentEnvironment];
}

function getCurrentEnvironment() {
    return currentEnvironment;
}

function setEnvironment(env) {

    currentEnvironment = env;
    console.log("Environment changed to:", currentEnvironment);
    fs.writeFileSync(
        configFile,
        JSON.stringify({ environment: env }, null, 2)
    );
    console.log("Environment saved to file:", configFile);
    console.log("New Environment Config:", getConfig());
}

export {
    getConfig,
    getCurrentEnvironment,
    setEnvironment,
};