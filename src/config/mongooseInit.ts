import { connect } from "mongoose";

export default async function mongooseInit() {
    if (!process.env.CLOUD_DB_URL) {
        console.error("MongoDB connection URL is not configured");
        process.exit(1);
    }

    try {
        await connect(process.env.CLOUD_DB_URL, {
            dbName: "NewsDB",
        });

        console.log("Successfully connected to MongoDB database!");
    } catch (error) {
        console.log("Failed to connect to cloud DB!");

        if (error instanceof Error) {
            console.log("Error message", error.message);
            console.log("Stack trace", error.stack);
        } else {
            console.log("Unexpected error", error);
        }

        process.exit(1);
    }
}
