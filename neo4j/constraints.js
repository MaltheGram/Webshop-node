import { driver as neo4jDriver } from "../database.js";

neo4jDriver
  .session()
  .run(
    `CREATE CONSTRAINT unique_user_email ON (u:User) ASSERT u.email IS UNIQUE`,
    `CREATE CONSTRAINT unique_order_id ON (o:order) ASSERT o.id IS UNIQUE`,
  );
