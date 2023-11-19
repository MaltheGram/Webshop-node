import { DataTypes, Model } from "sequelize";
import Category from "./category";
import sequelize from "./database";

class Product extends Model {}
Product.init(
  {
    name: DataTypes.STRING(50),
    description: DataTypes.STRING(200),
    price: DataTypes.DECIMAL,
    imageurl: DataTypes.STRING(255),
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "product" },
);

Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId" });

export default Product;
