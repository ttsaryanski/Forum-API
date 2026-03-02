import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

interface ThemeAttributes {
    id?: number;
    title: string;
    content: string;
    is_pinned?: boolean;
    is_closed?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    author_id: number;
    category_id: number;
    author?: {
        username: string;
    };
    category?: {
        id: string;
        name: string;
    };
    comments?: Array<{
        id: number;
        content: string;
        createdAt: Date;
        updatedAt: Date;
        is_edited: boolean;
        likesCount?: number;
        author?: {
            username: string;
            avatar_url: string;
        };
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
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "author_id",
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "category_id",
        },
    },
    {
        tableName: "themes",
    }
);

export default Theme;
