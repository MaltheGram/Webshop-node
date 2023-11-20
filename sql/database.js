import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("sql_store", "admin1", "Password123", {
  host: "sql-store-kea-sd23.mysql.database.azure.com",
  dialect: "mysql",
  port: 3306,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  },
  logging: false,
});

export default sequelize;
