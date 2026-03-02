import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

interface CommentAttributes {
    id?: number;
    content: string;
    is_edited?: boolean;
    is_deleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    author_id: number;
    theme_id: number;
    author?: {
        username: string;
    };
}

interface CommentInstance extends Model<CommentAttributes>, CommentAttributes {}

const Comment = sequelize.define<CommentInstance>(
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
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "author_id",
        },
        theme_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "theme_id",
        },
    },
    {
        tableName: "comments",
    }
);

export default Comment;
