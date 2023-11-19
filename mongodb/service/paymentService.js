import { PaymentModel, UserModel } from "../models/models.js";

class PaymentService {
  static async checkExistingPayment(orderId, session) {
    return PaymentModel.findOne({ order: orderId }).session(session);
  }

  static async checkExistingPayment(orderId, session) {
    return PaymentModel.findOne({ order: orderId }).session(session);
  }

  static async createPayment(transactionNumber, cardNumber, orderId, session) {
    return PaymentModel.create(
      [{ transactionNumber, cardNumber, order: orderId }],
      { session },
    );
  }
  static async updateUserWithPayment(userId, paymentId, session) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $push: { payments: paymentId } },
      { new: true, session },
    );
  }
}

export default PaymentService;
