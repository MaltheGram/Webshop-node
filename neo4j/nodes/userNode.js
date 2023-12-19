import bcrypt from "bcrypt";
import crypto from "crypto";
import { driver as neo4jDriver } from "../database.js";

const createUserNode = async (user) => {
  const session = neo4jDriver.session();

  const hashedPassword = bcrypt.hashSync(user.password, 10);

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
        id: crypto.randomBytes(16).toString("hex"),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: hashedPassword,
        phoneNumber: user.phoneNumber,
      },
    );
    return result.records[0].get("u").properties;
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }
};

const updateUserNode = async (email, userUpdates) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {email: $email})
       SET u.firstName = CASE WHEN $firstName IS NOT NULL THEN $firstName ELSE  u.firstName END, u.lastName = CASE WHEN $lastName IS NOT NULL THEN     $lastName ELSE u.lastName END,
        u.email = CASE WHEN $newEmail IS NOT NULL THEN $newEmail ELSE u.email END,
           u.password = CASE WHEN $password IS NOT NULL THEN $password ELSE u.password END,
           u.phoneNumber = CASE WHEN $phoneNumber IS NOT NULL THEN $phoneNumber ELSE u.phoneNumber END
       RETURN u`,
      {
        email, // Existing email to match the user
        firstName: userUpdates.firstName || null,
        lastName: userUpdates.lastName || null,
        newEmail: userUpdates.email || null,
        password: userUpdates.password || null,
        phoneNumber: userUpdates.phoneNumber || null,
      },
    );

    delete result.records[0].get("u").properties.password;
    return result.records[0].get("u").properties;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await session.close();
  }
};

const deleteUserAndAddressNodes = async (email, addressId) => {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {email: $email}), (a:Address {id: $addressId})
       DETACH DELETE u, a`,
      {
        email,
        addressId,
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

const getAllUsers = async () => {
  const session = neo4jDriver.session();
  try {
    const users = await session.run(`
    Match (u:User)-[LIVES_AT]->(a:Address) RETURN u,a `);
    return users;
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};

const getUserByEmail = async (email) => {
  const session = neo4jDriver.session();
  try {
    const user = await session.run(`MATCH (u:User {email: $email})-[LIVES_AT]->(a:Address) RETURN u, a`, {
      email: email,
    });
    return user;
  } catch (error) {
    console.error(error);
  } finally {
    await session.close();
  }
};
export {
  createUserNode,
  deleteUserAndAddressNodes,
  getAllUsers,
  getUserByEmail,
  updateUserNode,
};
