import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

import User from "./User.js";
import Theme from "./Theme.js";
import Comment from "./Comment.js";

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

Like.belongsTo(User, {
    foreignKey: "user_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
User.hasMany(Like, { foreignKey: "user_id" });

Like.belongsTo(Theme, {
    foreignKey: "theme_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
Theme.hasMany(Like, { foreignKey: "theme_id" });

Like.belongsTo(Comment, {
    foreignKey: "comment_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
Comment.hasMany(Like, { foreignKey: "comment_id" });

export default Like;
