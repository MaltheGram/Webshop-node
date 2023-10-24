import { Sequelize, DataTypes } from "sequelize";

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

// Models
const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const OrderStatus = sequelize.define('OrderStatus', {
    name: {
        type: DataTypes.ENUM('Order received', 'In Progress', 'Order delivered'),
        allowNull: true
    }
});

const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    imageurl: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const Inventory = sequelize.define('Inventory', {
    stock: {
        type: DataTypes.SMALLINT,
        allowNull: true
    }
});

const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING
});

const Address = sequelize.define('Address', {
    zip_code: DataTypes.STRING,
    street_name: DataTypes.STRING,
    street_number: DataTypes.STRING,
    city: DataTypes.STRING
});

const Payment = sequelize.define('Payment', {
    total_price: DataTypes.DECIMAL
});

const Order = sequelize.define('Order', {
    date: DataTypes.DATE
});

const OrderLineItem = sequelize.define('OrderLineItem', {});

const PaymentDetail = sequelize.define('PaymentDetail', {
    card_number: DataTypes.STRING,
    transaction_number: DataTypes.STRING
});

// Dummy Data
async function insertDummyData() {
    await sequelize.sync();

    const categories = await Category.bulkCreate([
        { name: 'Electronics' },
        { name: 'Clothing' },
        { name: 'Toys' }
    ]);

    const orderStatuses = await OrderStatus.bulkCreate([
        { name: 'Order received' },
        { name: 'In Progress' },
        { name: 'Order delivered' }
    ]);

    const users = await User.bulkCreate([
        { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 'john123', phone_number: '1234567890' },
        { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', password: 'jane123', phone_number: '0987654321' },
        { firstName: 'Bob', lastName: 'Smith', email: 'bob.smith@example.com', password: 'bob123', phone_number: '1122334455' }
    ]);

    const products = await Product.bulkCreate([
        { name: 'Laptop', description: 'Gaming laptop', price: 1500.50, categoryId: categories[0].id, imageurl: "https://miro.medium.com/v2/resize:fit:1024/1*OohqW5DGh9CQS4hLY5FXzA.png" },
        { name: 'Shirt', description: 'Cotton shirt', price: 20.99, categoryId: categories[1].id, imageurl: "https://miro.medium.com/v2/resize:fit:1024/1*OohqW5DGh9CQS4hLY5FXzA.png" },
        { name: 'Action Figure', description: 'Superhero action figure', price: 15.99, categoryId: categories[2].id, imageurl: "https://miro.medium.com/v2/resize:fit:1024/1*OohqW5DGh9CQS4hLY5FXzA.png" }
    ]);

    const inventories = await Inventory.bulkCreate([
        { stock: 10, productId: products[0].id },
        { stock: 50, productId: products[1].id },
        { stock: 30, productId: products[2].id }
    ]);

    const addresses = await Address.bulkCreate([
        { zip_code: '10001', street_name: '1st Street', street_number: '10A', city: 'New York', userId: users[0].id },
        { zip_code: '20002', street_name: '2nd Street', street_number: '20B', city: 'Los Angeles', userId: users[1].id },
        { zip_code: '30003', street_name: '3rd Street', street_number: '30C', city: 'Chicago', userId: users[2].id }
    ]);

    const payments = await Payment.bulkCreate([
        { total_price: 1520.49, userId: users[0].id },
        { total_price: 36.98, userId: users[1].id },
        { total_price: 45.99, userId: users[2].id }
    ]);

    const orders = await Order.bulkCreate([
        { date: new Date(), orderStatusId: orderStatuses[0].id, paymentId: payments[0].id, userId: users[0].id },
        { date: new Date(), orderStatusId: orderStatuses[1].id, paymentId: payments[1].id, userId: users[1].id },
        { date: new Date(), orderStatusId: orderStatuses[2].id, paymentId: payments[2].id, userId: users[2].id }
    ]);

    const orderLineItems = await OrderLineItem.bulkCreate([
        { orderId: orders[0].id, productId: products[0].id },
        { orderId: orders[1].id, productId: products[1].id },
        { orderId: orders[2].id, productId: products[2].id }
    ]);

    const paymentDetails = await PaymentDetail.bulkCreate([
        { card_number: '4111111111111111', transaction_number: 'TXN12345', paymentId: payments[0].id },
        { card_number: '4222222222222222', transaction_number: 'TXN67890', paymentId: payments[1].id },
        { card_number: '4333333333333333', transaction_number: 'TXN11223', paymentId: payments[2].id }
    ]);

    // Relationships
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




    console.log("Dummy data inserted!");
}

insertDummyData()
    .then(() => {
        console.log("Finished inserting dummy data");
        process.exit(0);
    })
    .catch(error => {
        console.error("Error inserting dummy data:", error);
        process.exit(1);
    });
