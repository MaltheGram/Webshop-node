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
  await txc.run(
    `MATCH (o:Order {id: $orderId}), (p:Product {id: $productId})
     CREATE (o)-[:CONTAINS {quantity: $quantity}]->(p)`,
    { orderId, productId, quantity },
  );
};

const linkOrderToUser = async (txc, userId, orderId) => {
  await txc.run(
    `MATCH (u:User {id: $userId}), (o:Order {id: $orderId})
     CREATE (u)-[:HAS_ORDER]->(o)`,
    { userId, orderId },
  );
};

export { addProductToOrder, createOrderNode, linkOrderToUser };
