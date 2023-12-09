import crypto from "crypto";
import { driver as neo4jDriver } from "../database.js";

const createInventoryNode = async (inventory) => {
  const session = neo4jDriver.session();

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
    return result.records.map(record => record.get('i').properties);
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
};

const updateInventoryNode = async (id, quantityInStock) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `MATCH (i:Inventory {id: $id})
       SET i.quantityInStock = CASE WHEN $quantityInStock IS NOT NULL THEN $quantityInStock ELSE  i.quantity END
       RETURN i`,
      {
        id,
        quantityInStock: quantityInStock || null,
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
    const inventory = await session.run(`MATCH (i:Inventory {id: $id}) RETURN i`, {
      id: id,
    });
    return inventory;
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

export { createInventoryNode, getInventoryByIdNode, updateInventoryNode };

