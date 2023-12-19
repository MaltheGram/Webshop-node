import express from "express";
import connectDatabase from "./mongodb/database.js";
import { verifyConnectivity } from "./neo4j/database.js";

const app = express();
const PORT = 3000;
connectDatabase();
verifyConnectivity().catch((error) => {
  console.error("Neo4j connection error:", error);
});

app.get("/", (req, res) => {
  res.send({ message: "Please go to /api-docs" });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SQL Routers
import categoryRouter from "./sql/routers/categoryRouter.js";
import inventoryRouter from "./sql/routers/inventoryRouter.js";
import orderRouterSQL from "./sql/routers/orderRouter.js";
import paymentDetailsRouter from "./sql/routers/paymentDetailsRouter.js";
import paymentRouterSQL from "./sql/routers/paymentRouter.js";
import productRouterSQL from "./sql/routers/productRouter.js";
import userRouterSQL from "./sql/routers/userRouter.js";

app.use(userRouterSQL);
app.use(orderRouterSQL);
app.use(productRouterSQL);
app.use(categoryRouter);
app.use(inventoryRouter);
app.use(paymentDetailsRouter);
app.use(paymentRouterSQL);

// MongoDB Routers
import orderRouterMongo from "./mongodb/routers/orderRouter.js";
import paymentRouter from "./mongodb/routers/paymentRouter.js";
import productRouterMongo from "./mongodb/routers/productRouter.js";
import userRouterMongo from "./mongodb/routers/userRouter.js";

app.use(userRouterMongo);
app.use(orderRouterMongo);
app.use(productRouterMongo);
app.use(paymentRouter);

// Graph Routers
import categoryRouterGraph from "./neo4j/routers/categoryRouter.js";
import orderRouterGraph from "./neo4j/routers/orderRouter.js";
import porductRouterGraph from "./neo4j/routers/productRouter.js";
import userRouterGraph from "./neo4j/routers/userRotuer.js";
app.use(userRouterGraph);
app.use(orderRouterGraph);
app.use(porductRouterGraph);
app.use(categoryRouterGraph);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
