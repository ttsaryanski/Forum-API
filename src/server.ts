import app from "./app.js";
import mongooseInit from "./config/mongooseInit.js";
import { postgresInit } from "./config/postgresInit.js";

const PORT = 3000;
const port = process.env.PORT || PORT;

async function startServer() {
    app.listen(port, () =>
        console.log(`Server running on http://localhost:${port}`)
    );

    try {
        console.log("Connecting to databases...");

        await Promise.all([mongooseInit(), postgresInit()]);

        console.log("Databases initialized.");
    } catch (error) {
        console.log("Failed to initialize databases:", error);
        process.exit(1);
    }
}

startServer();
