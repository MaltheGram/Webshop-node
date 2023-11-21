import { DataTypes, Model } from "sequelize";
import Payment from "./payment";
import sequelize from "../database";

class PaymentDetail extends Model {}
PaymentDetail.init(
  {
    card_number: DataTypes.STRING(150),
    transaction_number: DataTypes.STRING(150),
    paymentId: {
      type: DataTypes.INTEGER,
      references: {
        model: Payment,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "payment_detail" },
);

Payment.hasMany(PaymentDetail, {
  foreignKey: "paymentId",
  as: "paymentDetails",
});
PaymentDetail.belongsTo(Payment, { foreignKey: "paymentId" });

export default PaymentDetail;
