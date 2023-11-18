import { Router } from "express";
import { graphqlHTTP } from "express-graphql";
import { graphqlScheamUser } from "../graphql/models/models.js";
import { UserModel, validateUser } from "../mongodb/models/models.js";
import UserService from "../sql/service/UserService.js";

const router = Router();

const usersMongo = "/api/users/mongo";
const usersSql = "/api/users/sql";
const graphql = "/api/users/graphql";

// Get All Users
router.get(`${usersMongo}`, async (req, res) => {
  try {
    res.status(200).json({ data: await UserModel.find() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(`${usersSql}`, async (req, res) => {
  try {
    const users = await UserService.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.use(
  `${graphql}`,
  graphqlHTTP((req) => ({
    schema: graphqlScheamUser,
    graphiql: true, // Set to false if you don't want to use GraphiQL in production
  })),
);

// Get User by ID
router.get(`${usersMongo}/:id`, async (req, res) => {
  try {
    const allUsers = await UserModel.find();

    const user = await UserModel.findOne({ _id: req.params.id });
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(`${usersSql}/:id`, async (req, res) => {
  try {
    const user = (await UserService.getById(req.params.id)) || {
      message: `No user with id ${req.params.id}`,
    };
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create User
router.post(`${usersMongo}`, async (req, res) => {
  const { error } = validateUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const user = new UserModel(req.body);

  try {
    await user.save();
    res.status(200).send({ message: "User created in MongoDB" });
  } catch (error) {
    res.status(500).send({ data: error.message });
  }
});

router.post(`${usersSql}`, async (req, res) => {
  try {
    await UserService.create(req.body);
    res.status(200).json({ message: "User created in MySQL." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User
router.put(`${usersMongo}/:id`, async (req, res) => {
  try {
    await UserModel.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: `MongoDB user updated.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put(`${usersSql}/:id`, async (req, res) => {
  try {
    await UserService.update(req.params.id, req.body);
    res.json({ message: `MySQL user updated.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User
router.delete(`${usersMongo}/:id`, async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.json({ message: `MongoDB user deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete(`${usersSql}/:id`, async (req, res) => {
  try {
    await UserService.delete(req.params.id);
    res.json({ message: `MySQL user deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
