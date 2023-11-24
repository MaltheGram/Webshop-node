import { driver as neo4jDriver } from "../database.js";

const createOrderNode = async (order) => {
  const session = neo4jDriver.session();

  try {
    const result = await session.run(
      `
        CREATE (o:Order {
                id: $id,
                orderStatus: $orderStatus
            }) RETURN o`,
      {
        id: order.id,
        orderStatus: order.orderStatus,
      },
    );
    return result.records;
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
};

export { createOrderNode };
