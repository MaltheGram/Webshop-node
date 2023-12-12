import { Router } from "express";
import { PaymentModel } from "../models/models.js";

const router = Router();

const paymentsMongo = "/api/payments/mongo";

router.get(`${paymentsMongo}/:id`, async (req, res) => {
  const { id } = req.params;
  const payment = await PaymentModel.findById(id);
  res.json(payment);
});

router.get(`${paymentsMongo}/`, async (req, res) => {
  const { limit } = req.query;
  let defaultLimit = 0;

  limit ? (defaultLimit = parseInt(limit)) : (defaultLimit = 0);

  const payments = await PaymentModel.find().limit(defaultLimit);
  res.json(payments);
});

export default router;
