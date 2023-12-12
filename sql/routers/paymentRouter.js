import express from "express";
import PaymentService from "../service/PaymentService.js";

const router = express.Router();

const payments = "/api/payments/sql";
// Get all payments

router.get(`${payments}`, async (req, res) => {
  const { limit } = req.query;
  let defaultLimit = 0;

  limit ? defaultLimit = limit : defaultLimit = 0

  try {
    const payments = await PaymentService.getAllPayments(limit);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get a payment by id

router.get(`${payments}/:id`, async (req, res) => {
  try {
    const payment = await PaymentService.getPaymentById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all payments of a user
router.get(`${payments}user/:userId`, async (req, res) => {
  try {
    const payments = await PaymentService.getPaymentsForUser(req.params.userId);
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create a payment
router.post(`${payments}`, async (req, res) => {
  try {
    const payment = await PaymentService.createPayment(req.body);
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update a payment
router.put(`${payments}:id`, async (req, res) => {
  try {
    const updatedPayment = await PaymentService.updatePayment(
      req.params.id,
      req.body,
    );
    if (!updatedPayment)
      return res.status(404).json({ error: "Payment not found" });
    res.json(updatedPayment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete a payment
router.delete(`${payments}:/id`, async (req, res) => {
  try {
    const result = await PaymentService.deletePayment(req.params.id);
    if (!result) return res.status(404).json({ error: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
