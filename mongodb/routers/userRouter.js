import { Router } from "express";
import { UserModel, validateUser } from "../models/models.js";

const router = Router();

const usersMongo = "/api/users/mongo";

router.get(`${usersMongo}`, async (req, res) => {
  try {
    res.status(200).json({ data: await UserModel.find() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(`${usersMongo}/:id`, async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.put(`${usersMongo}/:id`, async (req, res) => {
  try {
    await UserModel.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: `MongoDB user updated.` });
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

export default router;
