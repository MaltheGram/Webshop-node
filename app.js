import express from 'express';
import User from "./models.js";

const app = express();
const PORT = 3000;

app.use(express.json());

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.use('/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
