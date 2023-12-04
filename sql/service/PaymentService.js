import model from "../models/models.js";

class PaymentService {
  static getAllPayments = async () => {
    return await model.Payment.findAll();
  };

  static getPaymentById = async (id) => {
    return await model.Payment.findByPk(id);
  };

  static getPaymentsForUser = async (userId) => {
    return await model.Payment.findAll({ where: { userId: userId } });
  };

  static createPayment = async (params) => {
    return await model.Payment.create(params);
  };

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

  static spUserPayments = async (userId) => {
    return await model.sequelize.query("CALL user_payments(:userId)", {
      replacements: { userId: userId },
      type: model.sequelize.QueryTypes.SELECT,
    });
  };
}

export default PaymentService;
