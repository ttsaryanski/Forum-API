import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

import User from "./User.js";
import Category from "./Category.js";

interface ThemeAttributes {
    id?: number;
    title: string;
    content: string;
    is_pinned?: boolean;
    is_closed?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    author_id?: number;
    author?: {
        username: string;
    };
    category?: {
        name: string;
    };
    comments?: Array<{
        id: number;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        is_edited: boolean;
        author?: {
            username: string;
        };
    }>;
    likes?: Array<{
        id: number;
        user_id: number;
    }>;
}

interface ThemeInstance extends Model<ThemeAttributes>, ThemeAttributes {}

const Theme = sequelize.define<ThemeInstance>(
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

Theme.belongsTo(Category, {
    as: "category",
    foreignKey: "category_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
Category.hasMany(Theme, { foreignKey: "category_id" });

export default Theme;
