import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Comment = sequelize.define(
    "Comment",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        is_edited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "comments",
    }
);

export default Comment;
