import crypto from "crypto";
import { driver as neo4jDriver } from "../database.js";

const createPaymentNode = async (payment) => {
  const paymentId = crypto.randomBytes(16).toString("hex");

  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `CREATE (p:Payment {
                id: $id,
                cardNumber: $cardNumber,
                transactionNumber: $transactionNumber
            }) RETURN p`,
      {
        id: paymentId,
        cardNumber: payment.cardNumber,
        transactionNumber: Math.floor(Math.random() * 10000000000000000),
      },
    );
    return result.records[0].get("p").properties;
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
};

export { createPaymentNode };
