import { DataTypes, Model } from "sequelize";
import Product from "./product";
import sequelize from "../database";

class Inventory extends Model {}
Inventory.init(
  {
    stock: DataTypes.SMALLINT,
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "inventory" },
);

Product.hasOne(Inventory, { foreignKey: "productId", as: "inventoryDetails" });
Inventory.belongsTo(Product, { foreignKey: "productId" });

export default Inventory;
