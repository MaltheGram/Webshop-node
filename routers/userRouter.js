import express, {Router} from "express"
import model from "../models.js";
import UserService from "../service/UserService.js"


const router = Router();

router.get('/users', async (req, res) => {
    try {
        const users = await model.User.findAll()
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/users", (req, res) => {
    try {
        const body = req.body

        UserService.create(body)

    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

export default router
