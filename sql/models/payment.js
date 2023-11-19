import { DataTypes, Model } from "sequelize";
import PaymentDetail from "./paymentDetail";
import Order from "./order";
import User from "./user";
import sequelize from "../database";

class Payment extends Model {}
Payment.init(
  {
    total_price: DataTypes.DECIMAL,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "payment" },
);

Payment.hasOne(Order, { foreignKey: "paymentId" });

Payment.hasMany(PaymentDetail, {
  foreignKey: "paymentId",
  as: "paymentDetails",
});
PaymentDetail.belongsTo(Payment, { foreignKey: "paymentId" });

export default Payment;
