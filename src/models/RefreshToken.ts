import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

import User from "./User.js";

interface RefreshTokenAttributes {
    id?: number;
    token: string;
    expiresAt: Date;
    user_id: number;
    createdAt?: Date;
}

interface RefreshTokenInstance
    extends Model<RefreshTokenAttributes>,
        RefreshTokenAttributes {}

const RefreshToken = sequelize.define<RefreshTokenInstance>(
    "RefreshToken",
    {
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
    },
    {
        updatedAt: false,
        tableName: "refresh_tokens",
    }
);

RefreshToken.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
User.hasMany(RefreshToken, { foreignKey: "user_id" });

export default RefreshToken;
