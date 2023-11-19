import { DataTypes, Model } from "sequelize";
import Address from "./address";
import Payment from "./payment";
import Order from "./order";
import sequelize from "../database";

class User extends Model {}
User.init(
  {
    firstName: DataTypes.STRING(40),
    lastName: DataTypes.STRING(40),
    password: DataTypes.STRING(40),
    email: DataTypes.STRING(40),
    phone_number: DataTypes.STRING(100),
  },
  { sequelize, modelName: "user" },
);

User.hasOne(Address, {
  foreignKey: "userId",
  as: "addresses",
  onDelete: "CASCADE",
  hooks: true,
});
Address.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Payment, { foreignKey: "userId", as: "payments" });
Payment.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId" });

export default User;
