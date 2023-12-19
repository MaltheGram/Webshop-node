import crypto from "crypto";
import { driver as neo4jDriver } from "../database.js";

const createCategoryNode = async (category) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `CREATE (c:Category {
              id: $id,
              name: $name
          }) RETURN c`,
      {
        id: crypto.randomBytes(16).toString("hex"),
        name: category.name,
      },
    );
    return result.records;
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
};

const updateCategoryNode = async (id, categoryUpdates) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `MATCH (c:Category {id: $id})
         SET c.name = CASE WHEN $name IS NOT NULL THEN $quantity ELSE  c.name END
         RETURN c`,
      {
        id,
        name: categoryUpdates.name || null,
      },
    );

    return result.records[0].get("c").properties;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await session.close();
  }
};

const getCategoryByIdNode = async (id) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(`MATCH (c:Category {id: $id}) RETURN c`, {
      id: id,
    });
    return result.records[0].get("c").properties;
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

const deleteCategoryNode = async (id) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `MATCH (c:Category {id: $id})
         DETACH DELETE c`,
      {
        id,
      },
    );

    return result.summary.query.parameters;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await session.close();
  }
};

const getAllCategoriesNode = async () => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(`MATCH (c:Category) RETURN c`);
    return result.records.map((record) => record.get("c").properties);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

export {
  createCategoryNode,
  deleteCategoryNode,
  getAllCategoriesNode,
  getCategoryByIdNode,
  updateCategoryNode,
};
