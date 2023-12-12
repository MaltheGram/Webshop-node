import model from "../models/models.js";

class PaymentService {
  static getAllPayments = async (limit) => {
    return await model.Payment.findAll({
      limit: Number(limit),
    });
  };

  static getPaymentById = async (id) => {
    return await model.Payment.findByPk(id);
  };

  static getPaymentsForUser = async (userId) => {
    return await model.Payment.findAll({ where: { userId: userId } });
  };

  // DANGER: This function should not be used, as a payment is created as part of an order update. Use for testing only.
  static createPayment = async (params) => {
    return await model.Payment.create(params);
  };

  // DANGER: This function should not be used, as a payment is created as part of an order update. Use for testing only.
  static updatePayment = async (id, updates) => {
    const payment = await model.Payment.findByPk(id);
    if (!payment) return null;
    return await payment.update(updates);
  };

  static deletePayment = async (id) => {
    const payment = await model.Payment.findByPk(id);
    if (!payment) return null;
    return await payment.destroy();
  };
}

export default PaymentService;
