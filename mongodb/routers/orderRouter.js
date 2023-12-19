import { Router } from "express";
import mongoose from "mongoose";

import {
  OrderModel,
  validateOrder,
  validatePayment,
} from "../models/models.js";
import OrderService from "../service/orderService.js";
import PaymentService from "../service/paymentService.js";
import ProductService from "../service/productService.js";
import UserService from "../service/userService.js";

const router = Router();

const ordersMongo = "/api/orders/mongo";

router.get(`${ordersMongo}`, async (req, res) => {
  try {
    res.status(200).json({ data: await OrderModel.find() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get(`${ordersMongo}/:orderId`, async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.orderId);
    if (!order) return res.status(404).send("Order not found");

    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(`${ordersMongo}/:userId`, async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error)
    return res.status(400).send({ validationError: error.details[0].message });

  const orderItemRequests = req.body.orderItems;
  const orderItems = [];

  try {
    for (const item of orderItemRequests) {
      await ProductService.updateProductStock(item.id, item.quantity);
      const product = await ProductService.findProductById(item.id);

      const { description, price, imageUrl, category } = product.toObject();
      orderItems.push({
        _id: item.id,
        description,
        price,
        imageUrl,
        category,
        quantity: item.quantity,
      });
    }

    const order = new OrderModel({ orderItems });
    await order.save();

    //await UserService.addUserOrder(req.params.userId, order._id);
    const updatedUser = await UserService.addUserOrder(
      req.params.userId,
      order,
    );

    res.status(200).send({ order: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put(`${ordersMongo}/:orderId/:userId`, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { error } = validatePayment(req.body);
    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send(error.details[0].message);
    }

    const existingPayment = await PaymentService.checkExistingPayment(
      req.params.orderId,
      session,
    );

    if (existingPayment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ message: "Payment already exists." });
    }

    const updatedOrder = await OrderService.updateOrder(
      req.params.orderId,
      req.body, // Assuming req.body contains necessary payment details
      session,
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    const newPayment = await PaymentService.createPayment(
      req.body.transactionNumber,
      req.body.cardNumber,
      updatedOrder._id,
      session,
    );

    const updatedUser = await PaymentService.updateUserWithPayment(
      req.params.userId,
      newPayment[0]._id, // Assuming newPayment is an array
      session,
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    await session.commitTransaction();
    session.endSession();
    res.json({
      message: `MongoDB order and user updated.`,
      user: updatedUser,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

export default router;
