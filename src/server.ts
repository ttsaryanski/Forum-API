import app from "./app.js";
import mongooseInit from "./config/mongooseInit.js";
import { postgresInit } from "./config/postgresInit.js";

const PORT = 3000;
const port = process.env.PORT || PORT;

async function startServer() {
    try {
        await Promise.all([mongooseInit(), postgresInit()]);

        app.listen(port, () =>
            console.log(`Server running on http://localhost:${port}`)
        );
    } catch (error) {
        console.log("Failed to initialize databases:", error);
        process.exit(1);
    }
}

startServer();

// mongooseInit().then(() => {
//     app.listen(port, () =>
//         console.log(`Server running on http://localhost:${port}`)
//     );
// });

// postgresInit().then(() => {
//     app.listen(port, () =>
//         console.log(`Server running on http://localhost:${port}`)
//     );
// });
