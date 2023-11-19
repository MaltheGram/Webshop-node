import { DataTypes, Model } from "sequelize";
import sequelize from "../database";

class Category extends Model {}
Category.init(
  {
    name: DataTypes.STRING(50),
  },
  { sequelize, modelName: "category" },
);

export default Category;
