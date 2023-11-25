import { driver as neo4jDriver } from "../database.js";
import crypto from "crypto";

const createPaymentNode = async (payment) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `CREATE (p:Payment {
                id: $id,
                cardNumber: $cardNumber,
                transactionNumber: $transactionNumber
            }) RETURN p`,
      {
        id: crypto.randomBytes(16).toString("hex"),
        cardNumber: payment.cardNumber,
        transactionNumber: payment.transactionNumber,
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
