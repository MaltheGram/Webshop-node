import { driver as neo4jDriver } from "../database.js";
import { createOrderNode } from "../nodes/orderNode.js";

const createOrderWithRelationToUser = async (order, user) => {
  const session = neo4jDriver.session();

  try {
    const txc = session.beginTransaction();

    await createOrderNode(order);

    const relation = await txc.run(
      `MATCH (u:User {email: $email}), (o:Order {id: $id})
                CREATE (u)-[r:HAS]->(o)
                RETURN r`,
      { email: user.email, id: order.id },
    );
    await txc.commit();

    return relation;
  } catch (error) {
    await txc.rollback();
    console.error(error);
  } finally {
    await session.close();
  }
};

export { createOrderWithRelationToUser };
