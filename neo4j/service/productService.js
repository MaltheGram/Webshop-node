import { driver as neo4jDriver } from "../database.js";
import {
  createInventoryNode,
  getInvetoryByProductId,
} from "../nodes/inventoryNode.js";
import {
  changeProductCategoryNode,
  createProductNode,
  deleteProductAndInventoryNode,
  getAllProductsNode,
  getProductByIdNode,
  getProductDetailsById,
  getProductsByCategoryIdNode,
  updateProductAndInventoryNode,
} from "../nodes/productNode.js";

const createProductWithRelationToInventoryAndCategory = async (
  productData,
  inventoryData,
  category,
) => {
  const session = neo4jDriver.session();
  let txc;

  try {
    txc = session.beginTransaction();

    const inventory = await createInventoryNode(inventoryData);
    const product = await createProductNode(productData);

    const categoryRelation = await txc.run(
      `MATCH (p:Product {id: $productId}), (c:Category {id: $categoryId})
        CREATE (p)-[:BELONGS_TO]->(c)`,
      {
        productId: product[0].id,
        categoryId: category.id,
      },
    );

    const InventoryRelation = await txc.run(
      `MATCH (p:Product {id: $productId}), (i:Inventory {id: $inventoryId})
        CREATE 
        (p)-[:STOCKED_IN]->(i)`,
      {
        productId: product[0].id,
        inventoryId: inventory[0].id,
      },
    );

    await txc.commit();

    return { message: "Product and relation has been created" };
  } catch (error) {
    console.error(error);
    if (txc) {
      await txc.rollback();
    }
  } finally {
    await session.close();
  }
};

const getAllProducts = async () => {
  const allProducts = await getAllProductsNode();

  return allProducts;
};

const getProductById = async (id) => {
  const product = await getProductByIdNode(id);

  return product;
};

const updateProduct = async (id, productUpdates) => {
  const updateProduct = await updateUserNode(id, productUpdates);

  return updateProduct;
};

const deleteProductAndInventory = async (id, inventoryId) => {
  const inventoryStatus = await getInvetoryByProductId(id);
  let deleteProduct;

  if (inventoryStatus.quantityInStock > 0) {
    throw new Error("Cannot delete product with inventory in stock");
  } else {
    deleteProduct = await deleteProductAndInventoryNode(id, inventoryStatus.id);
  }

  return deleteProduct;
};

const productDetails = async (id) => {
  const product = await getProductDetailsById(id);

  return product;
};

const getProductsByCategoryId = async (categoryId) => {
  const allProducts = await getProductsByCategoryIdNode(categoryId);

  return allProducts;
};

const updateProductAndInventory = async (
  id,
  productUpdates,
  inventoryUpdates,
) => {
  const updateProduct = await updateProductAndInventoryNode(
    id,
    productUpdates,
    inventoryUpdates,
  );

  return updateProduct;
};

const changeProductCategory = async (id, newCategoryId) => {
  const changeProductCategory = await changeProductCategoryNode(
    id,
    newCategoryId,
  );

  return changeProductCategory;
};

export {
  changeProductCategory,
  createProductWithRelationToInventoryAndCategory,
  deleteProductAndInventory,
  getAllProducts,
  getProductById,
  getProductsByCategoryId,
  productDetails,
  updateProduct,
  updateProductAndInventory,
};
