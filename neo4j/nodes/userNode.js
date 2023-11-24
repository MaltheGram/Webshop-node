import { driver as neo4jDriver } from "../database.js";

const createUserNode = async (user) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `CREATE (u:User {
            id: $id,
            firstName: $firstName, 
            lastName: $lastName, 
            email: $email,
            password: $password,
            phoneNumber: $phoneNumber
        }) RETURN u`,
      {
        // TODO: How do we generate a unique id?
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
      },
    );
    return result.records[0].get("u").properties;
  } finally {
    await session.close();
  }
};

export {
  createUserNode
};

