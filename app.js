import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./docs/swagger.json" assert { type: "json" };
import connectDatabase from "./mongodb/database.js";
import { verifyConnectivity } from "./neo4j/database.js";

const app = express();
const PORT = 3000;
connectDatabase();
verifyConnectivity()

app.get("/", (req, res) => {
  res.send({ message: "Please go to /api-docs" });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SQL Routers
import orderRouterSQL from "./sql/routers/orderRouter.js";
import productRouterSQL from "./sql/routers/productRouter.js";
import userRouterSQL from "./sql/routers/userRouter.js";

app.use(userRouterSQL);
app.use(orderRouterSQL);
app.use(productRouterSQL);

// MongoDB Routers
import orderRouterMongo from "./mongodb/routers/orderRouter.js";
import productRouterMongo from "./mongodb/routers/productRouter.js";
import userRouterMongo from "./mongodb/routers/userRouter.js";

app.use(userRouterMongo);
app.use(orderRouterMongo);
app.use(productRouterMongo);

// Graph Routers
import userRouter from "./neo4j/routers/userRotuer.js";
app.use(userRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
