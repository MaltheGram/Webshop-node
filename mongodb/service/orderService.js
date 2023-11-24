import { OrderModel } from "../models/models.js";

class OrderService {
  static async updateOrder(orderId, paymentBody, session) {
    return OrderModel.findByIdAndUpdate(
      orderId,
      { payment: paymentBody },
      { new: true, session },
    );
  }


}

export default OrderService;
