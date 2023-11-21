import { DataTypes, Model } from "sequelize";
import Product from "./product";
import Order from "./order";
import sequelize from "../database";

class OrderLineItem extends Model {}
OrderLineItem.init(
  {
    orderId: {
      type: DataTypes.INTEGER,
      references: {
        model: Order,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
    },
    quantity: DataTypes.INTEGER,
  },
  { sequelize, modelName: "order_line_item" },
);

Product.hasMany(OrderLineItem, { foreignKey: "productId", as: "lineItems" });
OrderLineItem.belongsTo(Product, { foreignKey: "productId" });

Order.hasMany(OrderLineItem, { foreignKey: "orderId", as: "lineItems" });
OrderLineItem.belongsTo(Order, { foreignKey: "orderId" });

export default OrderLineItem;
