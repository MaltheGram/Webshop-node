import { DataTypes, Model } from "sequelize";
import User from "./user";
import sequelize from "../database";

class Address extends Model {}
Address.init(
  {
    zip_code: DataTypes.STRING(40),
    street_name: DataTypes.STRING(40),
    street_number: DataTypes.STRING(40),
    city: DataTypes.STRING(40),
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  { sequelize, modelName: "address" },
);

User.hasOne(Address, {
  foreignKey: "userId",
  as: "addresses",
  onDelete: "CASCADE",
  hooks: true,
});
Address.belongsTo(User, { foreignKey: "userId" });

export default Address;
