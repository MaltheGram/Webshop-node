import { driver as neo4jDriver } from "../database.js";
import { createAddressNode } from "../nodes/addressNode.js";
import { createUserNode } from "../nodes/userNode.js";

const createUserAndAddressWithRelation = async (user, address) => {
  const session = neo4jDriver.session();
  try {
    // Begin transaction
    const txc = session.beginTransaction();

    await createUserNode(user);
    await createAddressNode(address);

    const relation = await txc.run(
      `MATCH (u:User {email: $email}), (a:Address {streetName: $streetName})
         CREATE (u)-[r:LIVES_AT]->(a)
         RETURN r`,
      { email: user.email, streetName: address.streetName },
    );

    // Commit the transaction
    await txc.commit();

    return relation;
  } catch (error) {
    await txc.rollback();
    console.error(error);
  } finally {
    await session.close();
  }
};

const user = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.hello@example.com",
  password: "password123",
  phoneNumber: "1234567890",
};

const address = {
  id: "1",
  streetName: "Wow Street",
  streetNumber: "123",
  city: "New York",
  zip: "10001",
};

createUserAndAddressWithRelation(user, address).then(async (res) => {
  console.log(res);
});
