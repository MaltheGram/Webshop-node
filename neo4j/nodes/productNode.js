import crypto from "crypto";
import { driver as neo4jDriver } from "../database.js";

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
        id: crypto.randomBytes(16).toString("hex"),
        name: product.name,
        description: product.description,
        price: product.price,
      },
    );
    return result.records.map((record) => record.get("p").properties);
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
};

const updateProductNode = async (id, productUpdates) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `MATCH (p:Product {id: $id})
       SET p.name = CASE WHEN $name IS NOT NULL THEN $quantity ELSE  p.name END
       SET p.price = CASE WHEN $price IS NOT NULL THEN $quantity ELSE  p.price END
       SET p.description = CASE WHEN $description IS NOT NULL THEN $description ELSE  p.name END
       RETURN p`,
      {
        id,
        name: categoryUpdates.name || null,
        price: categoryUpdates.price || null,
        description: categoryUpdates.description || null,
      },
    );

    return result.records.map((record) => record.get("p").properties);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await session.close();
  }
};

const getProductByIdNode = async (id) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(`MATCH (p:Product {id: $id}) RETURN p`, {
      id: id,
    });
    return result.records.map((record) => record.get("p").properties);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

const getProductDetailsById = async (id) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `MATCH (p:Product {id: $id})-[:STOCKED_IN]->(i:Inventory)
       MATCH (p)-[:BELONGS_TO]->(c:Category)
       RETURN p, i, c.name AS categoryName`,
      { id },
    );

    const category = result.records[0].get("categoryName");
    const product = result.records.map((record) => record.get("p").properties);
    const inventory = result.records.map(
      (record) => record.get("i").properties,
    );
    return { product, inventory, category };
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

const deleteProductAndInventoryNode = async (id, inventoryId) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `MATCH (p:Product {id: $id}), (i:Inventory {id: $inventoryId})
       DETACH DELETE p, i`,
      {
        id,
        inventoryId,
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

const getProductsByCategoryIdNode = async (categoryId) => {
  const session = neo4jDriver.session();

  try {
    const result = await session.run(
      `MATCH (p:Product)-[:BELONGS_TO]->(c:Category)
      WHERE c.id = $categoryId
      RETURN p`,
      { categoryId: categoryId },
    );

    return result.records.map((record) => record.get("p").properties);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await session.close();
  }
};

const getAllProductsNode = async () => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(`MATCH (p:Product) RETURN p`);
    return result.records.map((record) => record.get("p").properties);
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

const updateProductAndInventoryNode = async (
  id,
  productUpdates,
  inventoryUpdates,
) => {
  const session = neo4jDriver.session();
  try {
    let productResult, inventoryResult;

    if (productUpdates) {
      productResult = await session.run(
        `MATCH (p:Product {id: $id})
        SET p.name = CASE WHEN $name IS NOT NULL THEN $name ELSE  p.name END
        SET p.price = CASE WHEN $price IS NOT NULL THEN $price ELSE  p.price END
        SET p.description = CASE WHEN $description IS NOT NULL THEN $description ELSE  p.description END
        RETURN p`,
        {
          id,
          name: productUpdates.name || null,
          price: productUpdates.price || null,
          description: productUpdates.description || null,
        },
      );
    }
    if (inventoryUpdates) {
      inventoryResult = await session.run(
        `MATCH (p:Product {id: $productId})-[:STOCKED_IN]->(i:Inventory)
         SET i.quantityInStock = CASE WHEN $quantityInStock IS NULL THEN i.quantityInStock ELSE $quantityInStock END
         RETURN i`,
        {
          productId: id,
          // Explicitly check for undefined or null
          quantityInStock:
            inventoryUpdates.quantityInStock !== undefined
              ? inventoryUpdates.quantityInStock
              : null,
        },
      );
    }

    return {
      product: productResult?.records[0]?.get("p").properties,
      inventory: inventoryResult?.records[0]?.get("i").properties,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await session.close();
  }
};

const changeProductCategoryNode = async (productId, newCategoryId) => {
  const session = neo4jDriver.session();

  try {
    const txc = session.beginTransaction();

    await txc.run(
      `MATCH (p:Product {id: $productId})-[r:BELONGS_TO]->(:Category)
       DELETE r`,
      { productId },
    );

    const result = await txc.run(
      `MATCH (p:Product {id: $productId}), (c:Category {id: $newCategoryId})
       CREATE (p)-[:BELONGS_TO]->(c)
       RETURN p, c`,
      {
        productId,
        newCategoryId,
      },
    );

    await txc.commit();

    return result.records.map((record) => ({
      product: record.get("p").properties,
      category: record.get("c").properties,
    }));
  } catch (error) {
    console.error(error);
    if (txc) {
      await txc.rollback();
    }
    throw error;
  } finally {
    await session.close();
  }
};

export {
  changeProductCategoryNode,
  createProductNode,
  deleteProductAndInventoryNode,
  getAllProductsNode,
  getProductByIdNode,
  getProductDetailsById,
  getProductsByCategoryIdNode,
  updateProductAndInventoryNode,
  updateProductNode,
};
