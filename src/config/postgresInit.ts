import sequelize from "./sequelize.js";

import "../models/User.js";
import "../models/Theme.js";
import "../models/Comment.js";
import "../models/Like.js";
import "../models/Category.js";

export async function postgresInit() {
    try {
        await sequelize.authenticate();
        console.log("Successfully connected to PostgreSQL database!");

        await sequelize.sync({ alter: true });
        console.log("Models synchronized with the database");
    } catch (error) {
        console.log("Failed to connect to PostgreSQL database!", error);
        process.exit(1);
    }
}
