import {Router} from "express"
import UserService from "../service/UserService.js"


const router = Router();

router.get('/users', async (req, res) => {
    try {
        const users = await UserService.getAll()
        res.json(users);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

router.get("/users/:id", async (req, res) => {
    try {
        const user = await UserService.getById(req.params.id) || {message: `No user with id ${req.params.id}`}
        res.json(user)

    } catch (err) {
        res.status(500).json({error: err.m})
    }
})

router.post("/users", async (req, res) => {
    try {
        const body = req.body

        await UserService.create(body)

        res.status(200).json({message: "User created."})


    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

router.put('/users/:id', async (req, res) => {
    try {
        const data = req.body;

        const updatedUser = await UserService.update(req.params.id, data)
        res.json({message: `Update fields: ${Object.keys(data)}`})

    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.delete("/users/:id", async (req, res) => {

    try {
        const result = await UserService.delete(req.params.id) || {message: `No user with id ${req.params.id}`}

        res.json(result)

    } catch (err) {
        res.status(500).json({error: err.message})
    }
})

export default router
