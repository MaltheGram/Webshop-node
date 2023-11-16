import models from "./models.js";
import {Sequelize} from "sequelize";  // Adjust this import to the path where your models are located

const sequelize = new Sequelize('sql_store', 'admin1', 'Password123', {
    host: 'sql-store-kea-sd23.mysql.database.azure.com',
    dialect: 'mysql',
    port: 3306,
    logging: console.log,  // Enable this line
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: true,
        }
    }
});


async function insertDummyData() {
    // Inserting Category
    const category1 = await models.Category.create({ name: 'Electronics' });
    const category2 = await models.Category.create({ name: 'Clothing' });
    const category3 = await models.Category.create({ name: 'Toys' });

    // Inserting Products
    const product1 = await models.Product.create({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1500,
        imageurl: 'https://example.com/laptop.png',
        categoryId: category1.id
    });

    const product2 = await models.Product.create({
        name: 'Shirt',
        description: 'Cotton shirt',
        price: 25,
        imageurl: 'https://example.com/shirt.png',
        categoryId: category2.id
    });

    const product3 = await models.Product.create({
        name: 'Action Figure',
        description: 'Superhero action figure',
        price: 15,
        imageurl: 'https://example.com/toy.png',
        categoryId: category3.id
    });

    // Inserting Inventory
    await models.Inventory.create({ stock: 10, productId: product1.id });
    await models.Inventory.create({ stock: 50, productId: product2.id });
    await models.Inventory.create({ stock: 30, productId: product3.id });

    // Inserting Users
    const user1 = await models.User.create({
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        email: 'johndoe@example.com',
        phone_number: '1234567890'
    });

    // Inserting Address for User
    await models.Address.create({
        zip_code: '12345',
        street_name: 'Main St',
        street_number: '10A',
        city: 'SampleCity',
        userId: user1.id
    });

    // Inserting Order Status
    const status1 = await models.OrderStatus.create({ name: 'Order received' });
    const status2 = await models.OrderStatus.create({ name: 'In Progress' });
    const status3 = await models.OrderStatus.create({ name: 'Order delivered' });

    // Inserting Payment
    const payment1 = await models.Payment.create({ total_price: 1525, userId: user1.id });

    // Inserting Order
    const order1 = await models.Order.create({
        date: new Date(),
        userId: user1.id,
        orderStatusId: status1.id,
        paymentId: payment1.id
    });

    // Inserting Order Line Items
    await models.OrderLineItem.create({ orderId: order1.id, productId: product1.id });
    await models.OrderLineItem.create({ orderId: order1.id, productId: product2.id });

    // Inserting Payment Details
    await models.PaymentDetail.create({
        card_number: '1234123412341234',
        transaction_number: 'tran_00001',
        paymentId: payment1.id
    });

    console.log('Dummy data inserted!');
}

async function main() {
    await sequelize.sync({ force: true });
    await insertDummyData();
    process.exit();  // This will ensure the script exits after all operations
}

main().catch(error => {
    console.error("Error occurred:", error);
    process.exit(1);  // Exit with an error code
});
