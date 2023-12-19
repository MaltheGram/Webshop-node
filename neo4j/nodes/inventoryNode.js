import crypto from "crypto";
import { driver as neo4jDriver } from "../database.js";

const createInventoryNode = async (inventory) => {
  const session = neo4jDriver.session();

  try {
    const result = await session.run(
      `
            CREATE (i:Inventory {
                id: $id, 
                quantityInStock: $quantityInStock
                 }) RETURN i`,
      {
        id: crypto.randomBytes(16).toString("hex"),
        quantityInStock: Number(inventory.quantityInStock),
      },
    );
    return result.records.map((record) => record.get("i").properties);
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
};

const updateInventoryNodeByProductId = async (
  txc,
  productId,
  quantityToDeduct,
) => {
  try {
    const result = await txc.run(
      `MATCH (p:Product {id: $productId})-[:STOCKED_IN]->(i:Inventory)
       SET i.quantityInStock = i.quantityInStock - $quantityToDeduct
       RETURN i`,
      {
        productId: productId,
        quantityToDeduct: quantityToDeduct,
      },
    );

    return result.records[0];
  } catch (error) {
    console.error("Error in updateInventoryNode:", error);
    throw error;
  }
};

const updateInventoryNode = async (txc, id, quantityInStock) => {
  try {
    const result = await txc.run(
      `MATCH (i:Inventory {id: $id})
       SET i.quantityInStock = CASE WHEN $quantityInStock IS NOT NULL THEN $quantityInStock ELSE i.quantityInStock END
       RETURN i`,
      {
        id: id,
        quantityInStock: quantityInStock || null,
      },
    );

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getInvetoryByProductId = async (productId) => {
  const session = neo4jDriver.session();

  try {
    const result = await session.run(
      `MATCH (p:Product {id: $productId})-[:STOCKED_IN]->(i:Inventory)
       RETURN i`,
      {
        productId: productId,
      },
    );

    return result.records[0].get("i").properties;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await session.close();
  }
};

const getInventoryByIdNode = async (id) => {
  const session = neo4jDriver.session();
  try {
    const inventory = await session.run(
      `MATCH (i:Inventory {id: $id}) RETURN i`,
      {
        id: id,
      },
    );
    return inventory;
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

export {
  createInventoryNode,
  getInventoryByIdNode,
  getInvetoryByProductId,
  updateInventoryNode,
  updateInventoryNodeByProductId,
};
