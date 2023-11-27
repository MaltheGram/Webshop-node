import { driver as neo4jDriver } from "../database.js";
import { updateInventoryQuantity } from "../nodes/inventoryNode.js";
import {
  addProductToOrder,
  createOrderNode,
  linkOrderToUser,
} from "../nodes/orderNode.js";

const createOrder = async (user, products) => {
  const session = neo4jDriver.session();
  let txc;

  try {
    txc = session.beginTransaction();

    const order = await createOrderNode(txc); // Ensure this function returns the order ID
    const orderId = order.properties.id;

    for (const product of products) {
      await addProductToOrder(txc, orderId, product.id, product.quantity);
      await updateInventoryQuantity(txc, product.id, product.quantity);
    }

    await linkOrderToUser(txc, user.id, orderId);

    await txc.commit();
    return { orderId, status: "Order created and inventory updated" };
  } catch (error) {
    console.error("Error:", error);
    if (txc) {
      await txc.rollback();
    }
    throw error;
  } finally {
    await session.close();
  }
};

export { createOrder };
