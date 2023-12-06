import { faker } from "@faker-js/faker";
import cliProgress from "cli-progress";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import {
  OrderModel,
  PaymentModel,
  ProductModel,
  UserModel,
} from "./models/models.js";

const progressBar = new cliProgress.SingleBar(
  {},
  cliProgress.Presets.shades_classic,
);
const TOTAL_USERS = 25;
const TOTAL_PRODUCTS = 100;
const TOTAL_ORDERS = 10;
const TOTAL_PAYMENTS = 3;
const TOTAL_OPERATIONS =
  TOTAL_USERS + TOTAL_PRODUCTS + TOTAL_ORDERS + TOTAL_PAYMENTS;

async function insertDummyData() {
  await mongoose.connect(
    "mongodb+srv://malthegram22:1b0E9yVRAxadkMeJ@cluster0.onnrmnv.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );
  console.log("Inserting dummy data...");

  let currentProgress = 0;
  progressBar.start(TOTAL_OPERATIONS, 0);
  //const session = await mongoose.startSession();
  //session.startTransaction();

  try {
    const products = [];
    for (let j = 0; j < TOTAL_PRODUCTS; j++) {
      const product = {
        _id: new ObjectId(),
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        imageUrl: faker.image.urlPlaceholder({ text: "Product image" }),
        description: faker.commerce.productName(),
        category: faker.commerce.department(),
        quantityInStock: faker.finance.amount({ min: 5, max: 100, dec: 0 }),
      };
      products.push(product);
      await ProductModel.create([product]);
      progressBar.update(++currentProgress);
    }

    const orders = [];
    for (let k = 0; k < TOTAL_ORDERS; k++) {
      const orderItems = faker.helpers
        .arrayElements(products, { min: 1, max: 5 })
        .map((item) => ({
          ...item,
          quantity: faker.finance.amount({ min: 1, max: 10, dec: 0 }),
        }));

      const order = {
        _id: new ObjectId(),
        orderItems,
      };
      orders.push(order);
      await OrderModel.insertMany([order]);
      progressBar.update(++currentProgress);
    }

    const payments = [];
    for (let l = 0; l < TOTAL_PAYMENTS; l++) {
      const randomOrderIndex = Math.floor(Math.random() * orders.length);
      const orderObjectId = orders[randomOrderIndex]._id;
      const payment = {
        _id: new ObjectId(),
        transactionNumber: crypto.randomBytes(16).toString("hex"),
        cardNumber: faker.finance.creditCardNumber(),
        order: orderObjectId,
      };
      payments.push(payment);
      await PaymentModel.create([payment]);
      progressBar.update(++currentProgress);
    }

    const users = [];
    for (let i = 0; i < TOTAL_USERS; i++) {
      const user = await UserModel.create([
        {
          _id: new ObjectId(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          phoneNumber: faker.phone.number(),
          address: {
            zip: faker.location.zipCode(),
            streetName: faker.location.streetAddress(),
            streetNumber: faker.location.buildingNumber(),
            city: faker.location.city(),
          },
          orders,
          payments: payments.map((payment) => payment.order),
        },
      ]);

      users.push(user);
      progressBar.update(++currentProgress);
    }

    progressBar.stop();
    //await session.commitTransaction();
    //session.endSession();
    console.log("Done!");
  } catch (error) {
    console.log(error);
    progressBar.stop();
    //await session.abortTransaction();
    //session.endSession();
  }
}

insertDummyData().catch(console.error);
