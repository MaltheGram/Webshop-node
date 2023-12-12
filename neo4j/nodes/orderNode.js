import crypto from "crypto";

const createOrderNode = async (txc) => {
  try {
    const orderId = crypto.randomBytes(16).toString("hex");
    const orderNumber = parseInt(crypto.randomBytes(4).toString("hex"), 16);

    const result = await txc.run(
      `CREATE (o:Order {id: $id, orderNumber: $orderNumber, orderStatus: $orderStatus}) RETURN o`,
      {
        id: orderId,
        orderNumber: orderNumber,
        orderStatus: "Order received",
      },
    );

    return result.records[0].get("o");
  } catch (error) {
    console.error("Error in createOrderNode:", error);
    throw error;
  }
};

const addProductToOrder = async (txc, orderId, productId, quantity) => {
  const addToOrder = await txc.run(
    `MATCH (o:Order {id: $orderId}), (p:Product {id: $productId})
     CREATE (o)-[:CONTAINS {quantity: $quantity}]->(p) RETURN o`,
    { orderId, productId, quantity },
  );
  if (addToOrder) {
    return true;
  } else {
    return false;
  }
};

const linkOrderToUser = async (txc, userId, orderId) => {
  const linkedUser = await txc.run(
    `MATCH (u:User {id: $userId}), (o:Order {id: $orderId})
     CREATE (u)-[:HAS_ORDER]->(o) RETURN u`,
    { userId, orderId },
  );
  if (linkedUser) {
    return true;
  } else {
    return false;
  }
};

const deleteOrderNode = async (txc, orderId) => {
  const deletedOrder = await txc.run(
    `MATCH (o:Order {id: $orderId}) DETACH DELETE o RETURN o`,
    { orderId },
  );
  if (deletedOrder) {
    return true;
  } else {
    return false;
  }
};

export { addProductToOrder, createOrderNode, deleteOrderNode, linkOrderToUser };
