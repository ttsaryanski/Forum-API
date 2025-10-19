import { Sequelize } from "sequelize";

const dbName = process.env.POSTGRES_DB || "";
const dbUser = process.env.POSTGRES_USER || "";
const dbPassword = process.env.POSTGRES_PASSWORD || "";

if (!dbName || !dbUser || !dbPassword) {
    console.error("Missing required database environment variables");
    process.exit(1);
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: process.env.PG_HOST || "localhost",
    port: Number(process.env.PG_PORT || 5432),
    dialect: "postgres",
    logging: false,
});

export default async function postgresInit() {
    try {
        await sequelize.authenticate();
        console.log("Successfully connected to PostgreSQL database!");
    } catch (error) {
        console.log("Failed to connect to PostgreSQL database!", error);
        process.exit(1);
    }
}
