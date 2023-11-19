import { DataTypes, Model } from "sequelize";
import OrderStatus from "./orderStatus";
import Payment from "./payment";
import OrderLineItem from "./orderLineItem";
import User from "./user";
import sequelize from ".,/database";

class Order extends Model {}
Order.init(
  {
    date: DataTypes.DATE,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    orderStatusId: {
      type: DataTypes.INTEGER,
      references: {
        model: OrderStatus,
        key: "id",
      },
    },
    paymentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Payment,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "order" },
);

Order.belongsTo(OrderStatus, {
  foreignKey: "orderStatusId",
  as: "statusDetails",
});
OrderStatus.hasMany(Order, { foreignKey: "orderStatusId" });

Order.hasMany(OrderLineItem, { foreignKey: "orderId", as: "lineItems" });
OrderLineItem.belongsTo(Order, { foreignKey: "orderId" });

export default Order;
