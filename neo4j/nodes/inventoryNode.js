import { neo4j as neo4jDriver } from "../database.js";

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
        id: inventory.id,
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
export { createInventoryNode };
