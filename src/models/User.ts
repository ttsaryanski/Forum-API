import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import bcrypt from "bcrypt";

interface UserAttributes {
    id?: number;
    email: string;
    password: string;
    username: string;
    role: "user" | "moderator" | "admin";
    avatar_url?: string;
    last_login?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    isVerified?: boolean;
    verificationToken?: string | null;
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {}

const User = sequelize.define<UserInstance>(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(30),
            unique: true,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("user", "moderator", "admin"),
            defaultValue: "user",
        },
        avatar_url: {
            type: DataTypes.TEXT,
            defaultValue: null,
        },
        last_login: {
            type: DataTypes.DATE,
        },
        isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
        verificationToken: { type: DataTypes.STRING, defaultValue: null },
    },
    {
        tableName: "users",
        hooks: {
            beforeCreate: async (user: UserInstance) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
            beforeUpdate: async (user: UserInstance) => {
                if (user.changed("password")) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    }
);

export default User;
