import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

import User from "./User.js";

const Theme = sequelize.define(
    "Theme",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        is_pinned: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_closed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "themes",
    }
);

Theme.belongsTo(User, {
    as: "author",
    foreignKey: "author_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
User.hasMany(Theme, { foreignKey: "author_id" });

export default Theme;
