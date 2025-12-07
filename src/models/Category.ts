import { DataTypes, Model } from "sequelize";
import sequelize from "../config/sequelize.js";

interface CategoryAttributes {
    id?: number;
    name: string;
}

interface CategoryInstance
    extends Model<CategoryAttributes>,
        CategoryAttributes {}

const Category = sequelize.define<CategoryInstance>(
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

export default Category;
