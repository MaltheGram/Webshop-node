import { faker } from "@faker-js/faker";

import { createCategory, getAllCategories } from "./service/categoryService.js";
import { createOrder } from "./service/orderService.js";
import {
  createProductWithRelationToInventoryAndCategory,
  getAllProducts,
} from "./service/productService.js";
import {
  createUserAndAddressWithRelation,
  getUsers,
} from "./service/userService.js";

const TOTAL_USERS = 300;
const TOTAL_PRODUCTS = 500;
const TOTAL_CATEGORIES = 10;
const TOTAL_ORDERS = 300;

const insertDummyUsers = async () => {
  console.log("Creating dummy users...");
  for (let i = 0; i < TOTAL_USERS; i++) {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      phoneNumber: faker.phone.number(),
    };

    const address = {
      streetName: faker.location.streetAddress(),
      streetNumber: faker.location.buildingNumber(),
      city: faker.location.city(),
      zip: faker.location.zipCode(),
    };

    await createUserAndAddressWithRelation(user, address);
  }
};

const insertDummyCategories = async () => {
  console.log("Creating dummy categories...");
  for (let i = 0; i < TOTAL_CATEGORIES; i++) {
    const category = {
      name: faker.commerce.department(),
    };

    await createCategory(category);
  }
};

const insertDummyProducts = async () => {
  const categories = await getAllCategories();
  console.log("Creating dummy products...");
  for (let i = 0; i < TOTAL_PRODUCTS; i++) {
    const product = {
      name: faker.commerce.productName(),
      price: faker.commerce.price({ min: 300, max: 1500 }),
      description: faker.commerce.productDescription(),
    };

    const category = categories[Math.floor(Math.random() * categories.length)];

    await createProductWithRelationToInventoryAndCategory(
      product,
      {
        quantityInStock: faker.finance.amount({ min: 5, max: 100, dec: 0 }),
      },
      category,
    );
  }
};

const insertDummyOrders = async () => {
  const users = await getUsers();
  const products = await getAllProducts();

  console.log("Creating dummy orders...");

  for (let i = 0; i < TOTAL_ORDERS; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const productsInOrder = [];

    for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 2) + 1;

      productsInOrder.push({ id: product.id, quantity });
    }

    await createOrder(user, productsInOrder);
  }
};
