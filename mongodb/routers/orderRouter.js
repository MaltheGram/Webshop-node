import { Router } from "express";
import mongoose from "mongoose";
import { OrderModel, validateOrder, validatePayment } from "../models/models.js";

const router = Router();

const ordersMongo = "/api/orders/mongo";

router.get(`${ordersMongo}`, async (req, res) => {
  try {
    res.status(200).json({ data: await OrderModel.find() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post(`${ordersMongo}`, async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error)
    return res.status(400).send({ validationError: error.details[0].message });

  const orderItemRequests = req.body.orderItems;
  const orderItems = [];

  try {
    for (const item of orderItemRequests) {
      const product = await ProductModel.findOne({ _id: item.id });
      if (!product) {
        return res.status(400).send(`Product with ID ${item.id} not found`);
      }

      if (product.quantityInStock < item.quantity) {
        return res
          .status(400)
          .send(`Not enough stock for product ID ${item.id}`);
      }

      product.quantityInStock -= item.quantity;
      await product.save();

      const { description, price, imageUrl, category } = product.toObject();

      const orderDetail = {
        description,
        price,
        imageUrl,
        category,
        quantity: item.quantity,
      };

      orderItems.push(orderDetail);
      console.log(item);
    }

    const order = new OrderModel({ orderItems });
    console.log(order);
    await order.save();
    res.status(200).send({ order: order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Only used to update payment, since we don't want to update the order iteself.
router.put(`${ordersMongo}/:id`, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction(); 

  try {
    const { error } = validatePayment(req.body);
    if (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send(error.details[0].message);
    }

    // Check if a payment with the same details already exists
    const existingPayment = await PaymentModel.findOne({
      transactionNumber: req.body.transactionNumber,
      cardNumber: req.body.cardNumber,
    }).session(session);

    if (existingPayment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).send({ message: "Payment already exists." });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { payment: req.body.paymentId },
      { new: true, session },
    );

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    const newPayment = await PaymentModel.create(
      [
        {
          transactionNumber: req.body.transactionNumber,
          cardNumber: req.body.cardNumber,
          order: updatedOrder._id,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    res.json({
      message: `MongoDB order updated.`,
      order: updatedOrder,
      payment: newPayment,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

export default router;
