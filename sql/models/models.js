import { DataTypes, Model, Sequelize } from "sequelize";

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

// Category
class Category extends Model {}
Category.init(
  {
    name: DataTypes.STRING(50),
  },
  { sequelize, modelName: "category" },
);

// OrderStatus
class OrderStatus extends Model {}
OrderStatus.init(
  {
    name: DataTypes.ENUM("Order received", "In Progress", "Order delivered"),
  },
  { sequelize, modelName: "order_status" },
);

// Product
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

// Inventory
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

// User
class User extends Model {}
User.init(
  {
    firstName: DataTypes.STRING(40),
    lastName: DataTypes.STRING(40),
    password: DataTypes.STRING(150),
    email: DataTypes.STRING(40),
    phone_number: DataTypes.STRING(100),
  },
  { sequelize, modelName: "user" },
);

// Address
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

// Payment
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

// Order
class Order extends Model {}
Order.init(
  {
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

// OrderLineItem
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

// PaymentDetail
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

// Category and Product
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId" });

// Product and Inventory
Product.hasOne(Inventory, { foreignKey: "productId", as: "inventoryDetails" });
Inventory.belongsTo(Product, { foreignKey: "productId" });

// User and Address
User.hasOne(Address, {
  foreignKey: "userId",
  as: "addresses",
  onDelete: "CASCADE",
  hooks: true,
});
Address.belongsTo(User, { foreignKey: "userId" });

// User and Payment
User.hasMany(Payment, { foreignKey: "userId", as: "payments" });
Payment.belongsTo(User, { foreignKey: "userId" });

// User and Order
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId" });

// OrderStatus and Order
Order.belongsTo(OrderStatus, {
  foreignKey: "orderStatusId",
  as: "statusDetails",
});
OrderStatus.hasMany(Order, { foreignKey: "orderStatusId" });

// Payment and Order
//Order.belongsTo(Payment, { foreignKey: 'paymentId', as: 'paymentDetails' });
Payment.hasOne(Order, { foreignKey: "paymentId" });

// Product and OrderLineItem
Product.hasMany(OrderLineItem, { foreignKey: "productId", as: "lineItems" });
OrderLineItem.belongsTo(Product, { foreignKey: "productId" });

// Order and OrderLineItem
Order.hasMany(OrderLineItem, { foreignKey: "orderId", as: "lineItems" });
OrderLineItem.belongsTo(Order, { foreignKey: "orderId" });

// Payment and PaymentDetail
Payment.hasMany(PaymentDetail, {
  foreignKey: "paymentId",
  as: "paymentDetails",
});
PaymentDetail.belongsTo(Payment, { foreignKey: "paymentId" });

// Synchronize the models with the database
sequelize.sync();

export default {
  Category,
  OrderStatus,
  Product,
  Inventory,
  User,
  Address,
  Payment,
  Order,
  OrderLineItem,
  PaymentDetail,
  sequelize,
};
