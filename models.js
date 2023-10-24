import {Sequelize, Model, DataTypes} from "sequelize";
import fs from "fs";

const sequelize = new Sequelize('sql_store', 'admin1', 'Password123', {
    host: 'sql-store-kea-sd23.mysql.database.azure.com',
    dialect: 'mysql',
    port: 3306,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: true,
        }
    }
});

class Category extends Model {}
Category.init({
    name: DataTypes.STRING(50)
}, { sequelize, modelName: 'category' });

class OrderStatus extends Model {}
OrderStatus.init({
    name: DataTypes.ENUM('Order received', 'In Progress', 'Order delivered')
}, { sequelize, modelName: 'order_status' });

class Product extends Model {}
Product.init({
    name: DataTypes.STRING(50),
    description: DataTypes.STRING(200),
    price: DataTypes.DECIMAL,
    imageurl: DataTypes.STRING(255)
}, { sequelize, modelName: 'product' });

class Inventory extends Model {}
Inventory.init({
    stock: DataTypes.SMALLINT
}, { sequelize, modelName: 'inventory' });

class User extends Model {}
User.init({
    firstName: DataTypes.STRING(40),
    lastName: DataTypes.STRING(40),
    password: DataTypes.STRING(40),
    email: DataTypes.STRING(40),
    phone_number: DataTypes.STRING(100)
}, { sequelize, modelName: 'user' });

class Address extends Model {}
Address.init({
    zip_code: DataTypes.STRING(40),
    street_name: DataTypes.STRING(40),
    street_number: DataTypes.STRING(40),
    city: DataTypes.STRING(40)
}, { sequelize, modelName: 'address' });

class Payment extends Model {}
Payment.init({
    total_price: DataTypes.DECIMAL
}, { sequelize, modelName: 'payment' });

class Order extends Model {}
Order.init({
    date: DataTypes.DATE
}, { sequelize, modelName: 'order' });

class OrderLineItem extends Model {}
OrderLineItem.init({}, { sequelize, modelName: 'order_line_item' });

class PaymentDetail extends Model {}
PaymentDetail.init({
    card_number: DataTypes.STRING(150),
    transaction_number: DataTypes.STRING(150)
}, { sequelize, modelName: 'payment_detail' });

// Category
Category.hasMany(Product, { foreignKey: 'categoryId' });

// Product
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.hasOne(Inventory, { foreignKey: 'productId' });
Product.hasMany(OrderLineItem, { foreignKey: 'productId' });

// Inventory
Inventory.belongsTo(Product, { foreignKey: 'productId' });

// User
User.hasOne(Address, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });
User.hasMany(Payment, { foreignKey: 'userId' });

// Address
Address.belongsTo(User, { foreignKey: 'userId' });

// Order
Order.belongsTo(User, { foreignKey: 'userId' });
Order.belongsTo(OrderStatus, { foreignKey: 'orderStatusId' });
Order.hasMany(OrderLineItem, { foreignKey: 'orderId' });
Order.hasMany(Payment, { foreignKey: 'orderId' });

// OrderLineItem
OrderLineItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderLineItem.belongsTo(Product, { foreignKey: 'productId' });

// Payment
Payment.belongsTo(User, { foreignKey: 'userId' });
Payment.belongsTo(Order, { foreignKey: 'orderId' });
Payment.hasOne(PaymentDetail, { foreignKey: 'paymentId' });

// PaymentDetail
PaymentDetail.belongsTo(Payment, { foreignKey: 'paymentId' });

// OrderStatus
OrderStatus.hasMany(Order, { foreignKey: 'orderStatusId' });


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
    PaymentDetail
}

