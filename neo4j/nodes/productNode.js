const createProductNode = async (product) => {
    const session = neo4jDriver.session();
    try {
      const result = await session.run(
        `CREATE (p:Product {
              id: $id,
              name: $name,
              description: $description,
              price: $price
          }) RETURN p`,
        {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
        },
      );
      return result.records;
    } catch (error) {
      console.log(error);
    } finally {
      await session.close();
    }
  };
  export { createProductNode };
