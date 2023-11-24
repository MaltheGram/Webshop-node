import { driver as neo4jDriver } from "../database.js";

const createAddressNode = async (address) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `
      CREATE (a:Address {
              id: $id, 
              streetName: $streetName, 
              streetNumber: $streetNumber,
              city: $city,
              zip: $zip
          }) RETURN a`,
      {
        id: address.id,
        streetName: address.streetName,
        streetNumber: address.streetNumber,
        city: address.city,
        zip: address.zip,
      },
    );
    return result.records[0].get("a").properties;
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
};

export { createAddressNode };
