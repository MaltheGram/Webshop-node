import { driver as neo4jDriver } from "../database.js";
import { createCategoryNode } from "../nodes/categoryNode.js";
import { createInventoryNode } from "../nodes/createInventoryNode.js";
import { createProductNode } from "../nodes/productNode.js";

const createProductCategoryInventoryRelation = async (product, category, inventory) => {
    const session = neo4jDriver.session();
    try {
      const txc = session.beginTransaction();
  
      await createProductNode(product);
      await createCategoryNode(category);
      await createInventoryNode(inventory);
  
      await txc.run(
        `MATCH (p:Product {id: $productId}), (c:Category {id: $categoryId}), (i:Inventory {id: $inventoryId})
           CREATE (p)-[:BELONGS_TO]->(c),
                  (p)-[:HAS_INVENTORY]->(i)`,
        {
          productId: product.id,
          categoryId: category.id,
          inventoryId: inventory.id,
        },
      );
  
      await txc.commit();
    } catch (error) {
      await txc.rollback();
      console.error(error);
    } finally {
      await session.close();
    }
  };
  
  const product = {
    id: 1,
    name: "Laptop",
    description: "Powerful laptop for all your needs",
    price: 1200,
  };
  
  const category = {
    id: 1,
    name: "Electronics",
  };
  
  const inventory = {
    id: 1,
    stock: 50,
  };
  
  createProductCategoryInventoryRelation(product, category, inventory).then(async (res) => {
    console.log(res);
  });
  
