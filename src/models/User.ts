import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";
import bcrypt from "bcrypt";

interface UserAttributes {
    id?: number;
    email: string;
    password: string;
    username?: string;
    role: "user" | "moderator" | "admin";
    avatar_url?: string;
    last_login?: Date;
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
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(30),
            unique: true,
        },
        role: {
            type: DataTypes.ENUM("user", "moderator", "admin"),
            defaultValue: "user",
        },
        avatar_url: {
            type: DataTypes.TEXT,
        },
        last_login: {
            type: DataTypes.DATE,
        },
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
