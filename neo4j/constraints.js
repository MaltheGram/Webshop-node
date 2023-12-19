import { driver as neo4jDriver } from "../database.js";

neo4jDriver
  .session()
  .run(
    `CREATE CONSTRAINT unique_user_email ON (u:User) ASSERT u.email IS UNIQUE`,
    `CREATE CONSTRAINT unique_order_id ON (o:order) ASSERT o.id IS UNIQUE`,
    `CREATE CONSTRAINT unique_product_id ON (p:Product) ASSERT p.id IS UNIQUE`,
    `CREATE CONSTRAINT unique_inventory_id ON (i:Inventory) ASSERT i.id IS UNIQUE`,
    `CREATE CONSTRAINT unique_category_id ON (c:Category) ASSERT c.id IS UNIQUE`,
    `CREATE CONSTRAINT unique_payment_id ON (p:Payment) ASSERT p.id IS UNIQUE`,
    `CREATE CONSTRAINT unique_category_name ON (c:Category) ASSERT c.name IS UNIQUE`,
  );
