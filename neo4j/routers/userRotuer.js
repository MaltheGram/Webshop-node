import { Router } from "express";
import {
  createUserAndAddressWithRelation,
  deleteUserAndAddress,
  getSingleUserByEmail,
  getUsers,
  updateUser,
} from "../../neo4j/service/userService.js";
const router = Router();

const usersgraph = "/api/users/graph";

router.get(`${usersgraph}`, async (req, res) => {
  try {
    const users = await getUsers();
    res
      .status(200)
      .json({ users: users.records.map((user) => user.get("u").properties) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get(`${usersgraph}/:email`, async (req, res) => {
  const email = req.params.email;

  try {
    const user = await getSingleUserByEmail(email);

    if (!user.records[0]) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user: user.records[0]?.get("u").properties });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.put(`${usersgraph}/:email`, async (req, res) => {
  const email = req.params.email;
  const user = req.body.user;

  try {
    const result = await updateUser(email, user);
    res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.post(`${usersgraph}`, async (req, res) => {
  const user = req.body.user;
  const address = req.body.address;

  try {
    const result = await createUserAndAddressWithRelation(user, address);
    res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.delete(`${usersgraph}/:email`, async (req, res) => {
  const email = req.params.email;
  const addressId = req.body.addressId; // TODO: Should this be in req.body or req.params?

  try {
    const result = await deleteUserAndAddress(email, addressId);
    res.status(200).json({
      result: `Deleted user with ${email} and relating address: ${addressId}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

export default router;
