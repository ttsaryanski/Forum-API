import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const isDev = process.env.NODE_ENV === "development";

const dbName = process.env.POSTGRES_DB || "";
const dbUser = isDev ? "admin" : process.env.POSTGRES_USER;
const dbPassword = isDev ? "password" : process.env.POSTGRES_PASSWORD;
const dbHost = isDev ? "localhost" : process.env.PG_HOST;
const dbPort = isDev ? 5432 : process.env.PG_PORT;

if (!dbName || !dbUser || !dbPassword) {
    console.error("Missing required database environment variables");
    process.exit(1);
}

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost || "localhost",
    port: Number(dbPort || 5432),
    dialect: "postgres",
    logging: false,
});

export default sequelize;
