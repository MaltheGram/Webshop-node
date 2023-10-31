import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from "./docs/swagger.json" assert {type: "json"}
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js"


const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send({message: "Please go to /api-docs"})
})

app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.use(userRouter);
app.use(orderRouter)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
