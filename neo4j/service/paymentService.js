import { driver as neo4jDriver } from "../database.js";
import { createPaymentNode } from "../nodes/paymentNode.js";

const createPaymentWithRelationToOrderAndUser = async (
  payment,
  order,
  user,
) => {
  const session = neo4jDriver.session();

  try {
    const txc = session.beginTransaction();

    await createPaymentNode(payment);

    const userRelation = await txc.run(
      `
      MATCH (u:User {email: $email}), (p:Payment {id: $id})
                    CREATE (u)-[r:HAS]->(p)
                    RETURN r`,
      { email: user.email, id: payment.id },
    );

    const orderRelation = await txc.run(
      `MATCH (o:Order {id: $orderId}), (p:Payment {id: $paymentId})
         CREATE (o)-[r:HAS]->(p)
         RETURN r`,
      { orderId: order.id, paymentId: payment.id },
    );

    await txc.commit();

    return {
      userRelation: userRelation,
      orderRelation: orderRelation,
    };
  } catch (error) {
    console.error(error);
    await txc.rollback();
  } finally {
    await session.close();
  }
};

export { createPaymentWithRelationToOrderAndUser };
