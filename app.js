import express from 'express';
import swaggerUi from 'swagger-ui-express';


const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send({message: "Please go to /api-docs"})
})

app.use(express.json());


import userRouter from "./routers/userRouter.js";
app.use(userRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(""));

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
