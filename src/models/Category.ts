import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

import Theme from "./Theme.js";

const Category = sequelize.define(
    "Category",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        tableName: "categories",
    }
);

const ThemeCategory = sequelize.define(
    "ThemeCategory",
    {},
    { timestamps: false, tableName: "theme_categories" }
);

Theme.belongsToMany(Category, {
    through: ThemeCategory,
    foreignKey: "theme_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});
Category.belongsToMany(Theme, {
    through: ThemeCategory,
    foreignKey: "category_id",
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
});

export { Category, ThemeCategory };
