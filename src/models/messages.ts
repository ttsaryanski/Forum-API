import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

interface MessageAttributes {
    id?: number;
    content: string;
    createdAt?: Date;
    author_id: number;
    category_id: number;
    author?: {
        id: number;
        username: string;
        avatar_url: string;
    };
}

interface MessageInstance extends Model<MessageAttributes>, MessageAttributes {}

const Message = sequelize.define<MessageInstance>(
    "Message",
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
        tableName: "messages",
    }
);

export default Message;
