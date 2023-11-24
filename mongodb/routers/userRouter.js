import bcrypt from "bcrypt";
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

  const existingUser = await UserModel.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).send("Email already exists.");
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new UserModel({
    ...req.body,
    password: hashedPassword,
  });

  try {
    await user.save();
    res.status(200).send({ message: "User created in MongoDB" });
  } catch (error) {
    res.status(500).send({ data: error.message });
  }
});

router.post(`${usersMongo}/signin`, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    res.status(200).json({ message: "Sign in successful" });

  } catch (error) {
    res.status(500).json({ error: error.message });
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
