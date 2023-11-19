import { Router } from "express";

import UserService from "../service/UserService.js";

const router = Router();

const usersSql = "/api/users/sql";

router.get(`${usersSql}`, async (req, res) => {
  try {
    const users = await UserService.getAll();
    res.json(users);
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

router.post(`${usersSql}`, async (req, res) => {
  try {
    await UserService.create(req.body);
    res.status(200).json({ message: "User created in MySQL." });
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

router.delete(`${usersSql}/:id`, async (req, res) => {
  try {
    await UserService.delete(req.params.id);
    res.json({ message: `MySQL user deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;