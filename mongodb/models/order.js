import Joi from "joi";
import mongoose from "mongoose";
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new Schema(
  {
    orderStatus: {
      type: String,
      enum: ["Order received", "In progress", "Order delivered", "Cancelled"],
    },
    orderItems: [orderItemSchema],
    payment: {
      transactionNumber: String,
      cardNumber: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const validateOrder = (order) => {
  order.orderStatus = order.orderStatus || "Order received";

  const objectIdPattern = /^[0-9a-fA-F]{24}$/; // Pattern for validating MongoDB ObjectId

  const schema = Joi.object({
    orderStatus: Joi.string()
      .valid("Order received", "In progress", "Order delivered", "Cancelled")
      .required(),
    orderItems: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().pattern(objectIdPattern).required(),
          quantity: Joi.number().integer().min(1).required(),
        }),
      )
      .required(),
    payment: {
      transactionNumber: Joi.string().optional(),
      cardNumber: Joi.string().creditCard().optional(),
    },
  });

  return schema.validate(order);
};

const OrderModel = mongoose.model("Order", orderSchema);

export { OrderModel, validateOrder };
