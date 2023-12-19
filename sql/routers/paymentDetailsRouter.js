import express from "express";
import PaymentDetailsService from "../service/PaymentDetailsService.js";

const router = express.Router();

const paymnentDetails = "/api/pd/sql";

// get all paymentdetails
router.get(`${paymnentDetails}`), console.log("get all payment details");
async (req, res) => {
  try {
    const paymentDetails = await PaymentDetailsService.getAllPaymentDetails();
    res.json(paymentDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// get payment detail by id
router.get("/payment-details/:id", async (req, res) => {
  try {
    const paymentDetail = await PaymentDetailsService.getPaymentDetailById(
      req.params.id,
    );
    if (!paymentDetail)
      return res.status(404).json({ error: "Payment detail not found" });
    res.json(paymentDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//get payment detail by paymentid
router.get("/payment-details/payment/:paymentId", async (req, res) => {
  try {
    const paymentDetails =
      await PaymentDetailsService.getPaymentDetailsForPayment(
        req.params.paymentId,
      );
    res.json(paymentDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create payment detail
router.post("/payment-details", async (req, res) => {
  try {
    const paymentDetail = await PaymentDetailsService.createPaymentDetail(
      req.body,
    );
    res.status(201).json(paymentDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update payment detail
router.put("/payment-details/:id", async (req, res) => {
  try {
    const updatedPaymentDetail =
      await PaymentDetailsService.updatePaymentDetail(req.params.id, req.body);
    if (!updatedPaymentDetail)
      return res.status(404).json({ error: "Payment detail not found" });
    res.json(updatedPaymentDetail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Delete payment detail
router.delete("/payment-details/:id", async (req, res) => {
  try {
    const result = await PaymentDetailsService.deletePaymentDetail(
      req.params.id,
    );
    if (!result)
      return res.status(404).json({ error: "Payment detail not found" });
    res.json({ message: "Payment detail deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
