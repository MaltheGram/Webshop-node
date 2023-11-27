import { driver as neo4jDriver } from "../database.js";
import { createPaymentNode } from "../nodes/paymentNode.js";

const createPaymentWithRelationToOrderAndUser = async (
  paymentDetails,
  order,
  user,
) => {
  const session = neo4jDriver.session();
  let txc;

  try {
    txc = session.beginTransaction();

    // Assuming createPaymentNode returns an object with an id property
    const payment = await createPaymentNode(paymentDetails);

    const userRelation = await txc.run(
      `MATCH (u:User {id: $userId}), (p:Payment {id: $paymentId})
       CREATE (u)-[r:HAS]->(p)
       RETURN r`,
      {
        userId: user.id,
        paymentId: payment.id,
      },
    );
    console.log(userRelation);

    const orderRelation = await txc.run(
      `MATCH (o:Order {id: $orderId}), (p:Payment {id: $paymentId})
       CREATE (o)-[r:HAS]->(p)
       RETURN r`,
      {
        orderId: order.id,
        paymentId: payment.id,
      },
    );

    await txc.commit();

    return {
      userRelation: userRelation.records[0].get("r"),
      orderRelation: orderRelation.records[0].get("r"),
    };
  } catch (error) {
    console.error(error);
    if (txc) {
      await txc.rollback();
    }
  } finally {
    await session.close();
  }
};

export { createPaymentWithRelationToOrderAndUser };
