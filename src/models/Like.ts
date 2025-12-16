import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Like = sequelize.define(
    "Like",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        type: {
            type: DataTypes.STRING,
            defaultValue: "like",
        },
    },
    {
        tableName: "likes",
        indexes: [
            {
                unique: true,
                fields: ["user_id", "theme_id", "comment_id"],
            },
        ],
    }
);

export default Like;
