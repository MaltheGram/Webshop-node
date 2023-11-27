import crypto from "crypto";
import { driver as neo4jDriver } from "../database.js";

const createInventoryNode = async (inventory) => {
  const session = neo4jDriver.seession();

  try {
    const result = await session.run(
      `
            CREATE (i:Inventory {
                id: $id, 
                quaintityInStock: $quantityInStock
                 }) RETURN i`,
      {
        id: crypto.randomBytes(16).toString("hex"),
        quantityInStock: inventory.quantityInStock,
      },
    );
    return result.records;
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
};

const updateInventoryQuantity = async (txc, productId, quantity) => {
  await txc.run(
    `MATCH (p:Product {id: $productId})-[:STOCKED_IN]->(i:Inventory)
       SET i.quantityInStock = i.quantityInStock - $quantity`,
    { productId, quantity },
  );
};

export { createInventoryNode, updateInventoryQuantity };
