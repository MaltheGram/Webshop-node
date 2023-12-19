import { driver as neo4jDriver } from "../database.js";
import { createAddressNode } from "../nodes/addressNode.js";
import {
  createUserNode,
  deleteUserAndAddressNodes,
  getAllUsers,
  getUserByEmail,
  updateUserNode,
} from "../nodes/userNode.js";

const createUserAndAddressWithRelation = async (user, address) => {
  const session = neo4jDriver.session();
  let txc;
  try {
    // Begin transaction
    txc = session.beginTransaction();

    await createUserNode(user);
    await createAddressNode(address);

    // TODO: Use id instead of email
    const relation = await txc.run(
      `MATCH (u:User {email: $email}), (a:Address {streetName: $streetName})
         CREATE (u)-[r:LIVES_AT]->(a)
         RETURN r`,
      { email: user.email, streetName: address.streetName },
    );

    // Commit the transaction
    await txc.commit();

    return {
      relation: `Relation between ${user.firstName} ${user.lastName} and ${address.streetName} created`,
      user: user,
      address: address,
    };
  } catch (error) {
    await txc.rollback();
    console.error(error);
  } finally {
    await session.close();
  }
};

const getUsers = async () => {
  const allUsers = await getAllUsers();

  const formattedUsers = allUsers.records.map((record) => {
    const user = record.get("u").properties;
    const address = record.get("a").properties;
    return { ...user, address };
  });

  return formattedUsers;
};

const getSingleUserByEmail = async (email) => {
  const user = await getUserByEmail(email);

  const formattedUser = user.records.map((record) => {
    const user = record.get("u").properties;
    const address = record.get("a").properties;
    return { ...user, address };
  });

  return formattedUser;
};

const updateUser = async (email, userUpdates) => {
  const updateUser = await updateUserNode(email, userUpdates);

  return updateUser;
};

const deleteUserAndAddress = async (email, addressId) => {
  const deleteUser = await deleteUserAndAddressNodes(email, addressId);

  return deleteUser;
};

export {
  createUserAndAddressWithRelation,
  deleteUserAndAddress,
  getSingleUserByEmail,
  getUsers,
  updateUser,
};
