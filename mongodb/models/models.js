import Joi from "joi";
import mongoose from "mongoose";
const { Schema } = mongoose;


const productSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
    },
    quantityInStock: {
      type: Number,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const validateProduct = (product) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().precision(2).required(),
    imageUrl: Joi.string().uri().optional(),
    category: Joi.string().required(),
    quantityInStock: Joi.number().integer().min(0).required(),
  });

  return schema.validate(product);
};

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

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    address: {
      zip: {
        type: String,
      },
      streetName: {
        type: String,
      },
      streetNumber: {
        type: String,
      },
      city: {
        type: String,
      },
    },
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    orders: [orderSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const validateUser = (user) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/; // Pattern for validating MongoDB ObjectId
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.object({
      zip: Joi.string().required(),
      streetName: Joi.string().required(),
      streetNumber: Joi.string().required(),
      city: Joi.string().required(),
    }),
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    orders: Joi.array().items(mongoose.Schema.Types.ObjectId),
  });

  return schema.validate(user);
};

const paymentSchema = new Schema(
  {
    transactionNumber: {
      type: String,
      unique: true,
    },
    cardNumber: {
      type: String,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
const validatePayment = (payment) => {
  const schema = Joi.object({
    transactionNumber: Joi.string().required(),
    cardNumber: Joi.string().creditCard().required(),
  });

  return schema.validate(payment);
};

const UserModel = mongoose.model("User", userSchema);
const ProductModel = mongoose.model("Product", productSchema);
const OrderModel = mongoose.model("Order", orderSchema);
const PaymentModel = mongoose.model("Payment", paymentSchema);

export {
    OrderModel,
    PaymentModel,
    ProductModel,
    UserModel,
    validateOrder,
    validatePayment,
    validateProduct,
    validateUser
};
