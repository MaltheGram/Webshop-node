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
          id: category.id,
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
  export { createCategoryNode };
