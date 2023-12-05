import { faker } from "@faker-js/faker";
import cliProgress from "cli-progress";
import { Sequelize } from "sequelize";
import models from "./models/models.js";

const sequelize = new Sequelize("sql_store", "admin1", "Password123", {
  host: "sql-store-kea-sd23.mysql.database.azure.com",
  dialect: "mysql",
  port: 3306,
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: true,
    },
  },
});

async function insertDummyData() {
  const transaction = await sequelize.transaction();

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic,
  );

  try {
    console.log("Inserting dummy data...");
    // Constants for loop limits
    const NUM_CATEGORIES = 15;
    const NUM_USERS = 2500;
    const NUM_PRODUCTS_PER_CATEGORY = 333;
    const NUM_ORDERS = 5000;
    const TOTAL_OPERATIONS =
      NUM_CATEGORIES +
      NUM_USERS +
      NUM_CATEGORIES * NUM_PRODUCTS_PER_CATEGORY +
      NUM_ORDERS;

    progressBar.start(TOTAL_OPERATIONS, 0);
    let currentProgress = 0;

    // Inserting Categories
    let categoryIds = [];
    for (let i = 1; i <= NUM_CATEGORIES; i++) {
      const category = await models.Category.create(
        { name: faker.commerce.department() },
        { transaction },
      );
      categoryIds.push(category.id);
      progressBar.update(++currentProgress);
    }

    // Inserting Users and Addresses
    let userIds = [];
    for (let i = 1; i <= NUM_USERS; i++) {
      const user = await models.User.create(
        {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          password: faker.internet.password(),
          email: faker.internet.email({ minLength: 10, maxLength: 20 }),
          phone_number: faker.phone.number(),
        },
        { transaction },
      );

      userIds.push(user.id);
      progressBar.update(++currentProgress);

      await models.Address.create(
        {
          zip_code: faker.location.zipCode(),
          street_name: faker.location.streetAddress(),
          street_number: faker.location.buildingNumber(),
          city: faker.location.city(),
          userId: user.id,
        },
        { transaction },
      );
    }

    // Inserting Products and Inventories
    for (let i = 1; i <= NUM_CATEGORIES; i++) {
      for (let j = 1; j <= NUM_PRODUCTS_PER_CATEGORY; j++) {
        const productName = faker.commerce.productName();
        const product = await models.Product.create(
          {
            name: productName,
            description: productName,
            price: faker.commerce.price(),
            imageurl: faker.image.urlPlaceholder({
              text: productName,
            }),
            categoryId: categoryIds[i],
          },
          { transaction },
        );
        progressBar.update(++currentProgress);
      }
    }

    // Inserting Orders, some with Payments
    for (let i = 1; i <= NUM_ORDERS; i++) {
      const isPaid = faker.datatype.boolean(); // Randomize paid status
      let paymentId = null;

      if (isPaid) {
        const payment = await models.Payment.create(
          {
            total_price: faker.commerce.price(),
            userId: userIds[Math.floor(Math.random() * userIds.length)],
          },
          { transaction },
        );
        progressBar.update(++currentProgress);
        paymentId = payment.id;
      }

      await models.Order.create(
        {
          userId: userIds[Math.floor(Math.random() * userIds.length)],
          orderStatusId: Math.floor(Math.random() * 3) + 1,
          paymentId: paymentId,
        },
        { transaction },
      );
      progressBar.update(++currentProgress);
    }

    await transaction.commit();
    progressBar.stop();
    console.log("Dummy data inserted successfully!");
  } catch (error) {
    await transaction.rollback();
    console.error("Error occurred during data insertion:", error);
  }
}

async function insertOrderLineItems() {
  const MIN_ORDER_ID = 63;
  const MAX_ORDER_ID = 5062;
  const MIN_PRODUCT_ID = 517;
  const MAX_PRODUCT_ID = 4995;

  for (let orderId = MIN_ORDER_ID; orderId <= MAX_ORDER_ID; orderId++) {
    const productId =
      Math.floor(Math.random() * (MAX_PRODUCT_ID - MIN_PRODUCT_ID + 1)) +
      MIN_PRODUCT_ID;
    const quantity = Math.ceil(Math.random() * 10); // Random quantity between 1 and 10

    await models.OrderLineItem.create({
      orderId: orderId,
      productId: productId,
      quantity: quantity,
    });
  }
}
const insertPaymentDetails = async () => {
  const MIN_ID = 33;
  const MAX_ID = 2527;

  const createPromises = [];

  for (let id = MIN_ID; id <= MAX_ID; id++) {
    const paymentId =
      Math.floor(Math.random() * (MAX_ID - MIN_ID + 1)) + MIN_ID;
    createPromises.push(
      models.PaymentDetail.create({
        paymentId: paymentId,
        card_number: faker.finance.creditCardNumber(),
        transaction_number: Math.floor(Math.random() * 1000000),
      }),
    );
  }

  // Execute all create operations concurrently
  await Promise.all(createPromises);
};

async function main() {
  try {
    await insertPaymentDetails();
    console.log("Payment details inserted successfully");
  } catch (error) {
    console.error("Main function error:", error);
    process.exit(1);
  }
}

main();
