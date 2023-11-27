import { Router } from "express";
import { createOrder } from "../service/orderService.js";
import { createPaymentWithRelationToOrderAndUser } from "../service/paymentService.js";
const router = Router();

const ordersgraph = "/api/orders/graph";

router.get(`${ordersgraph}`, async (req, res) => {});

router.put(`${ordersgraph}/:id`, async (req, res) => {
  const order = {
    id: req.params.id,
  };
  const payment = req.body.payment;
  const user = req.body.user;

  try {
    const result = await createPaymentWithRelationToOrderAndUser(
      payment,
      order,
      user,
    );

    res.status(200).json({ result: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.post(`${ordersgraph}`, async (req, res) => {
  try {
    const order = await createOrder(req.body.user, req.body.products);

    res.status(201).json({ order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
