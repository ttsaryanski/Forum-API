import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

import User from "./User.js";
import Theme from "./Theme.js";

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

Comment.belongsTo(User, { as: "author", foreignKey: "author_id" });
User.hasMany(Comment, { foreignKey: "author_id" });

Comment.belongsTo(Theme, { foreignKey: "theme_id" });
Theme.hasMany(Comment, { foreignKey: "theme_id" });

Comment.belongsTo(Comment, { as: "parent", foreignKey: "parent_comment_id" });
Comment.hasMany(Comment, { as: "replies", foreignKey: "parent_comment_id" });

export default Comment;
