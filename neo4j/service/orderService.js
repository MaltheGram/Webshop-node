import { driver as neo4jDriver } from "../database.js";
import { updateInventoryNodeByProductId } from "../nodes/inventoryNode.js";
import {
  addProductToOrder,
  createOrderNode,
  deleteOrderNode,
  linkOrderToUser,
} from "../nodes/orderNode.js";

const createOrder = async (user, products) => {
  const session = neo4jDriver.session();
  let txc;

  try {
    txc = session.beginTransaction();

    const order = await createOrderNode(txc);
    const orderId = order.properties.id;

    for (const product of products) {
      const addToOrder = await addProductToOrder(
        txc,
        orderId,
        product.id,
        product.quantity,
      );
      const updatedInventory = await updateInventoryNodeByProductId(
        txc,
        product.id,
        product.quantity,
      );
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

const getOrders = async () => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(`MATCH (o:Order) RETURN o`);
    return result.records.map((record) => record.get("o").properties);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  } finally {
    await session.close();
  }
};

const deleteOrder = async (orderId) => {
  const session = neo4jDriver.session();
  let txc;

  try {
    txc = session.beginTransaction();

    const deletedOrder = await deleteOrderNode(txc, orderId);

    await txc.commit();
    return { orderId, status: "Order deleted" };
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

export { createOrder, deleteOrder, getOrders };
