import Joi from "joi";
import mongoose from "mongoose";
const { Schema } = mongoose;


const userSchema = new Schema({
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
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
});
const validateUser = (user) => {
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
  });

  return schema.validate(user);
};

const productSchema = new Schema({
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
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  quantityInStock: {
    type: Number,
  },
});
const validateProduct = (product) => {
  const schema = Joi.object({
    description: Joi.string().required(),
    price: Joi.number().precision(2).required(),
    imageUrl: Joi.string().uri().optional(),
    category: Joi.string().required(),
    quantityInStock: Joi.number().integer().min(0).required(),
  });

  return schema.validate(product);
};

const orderSchema = new Schema({
  orderStatus: {
    type: String,
    enum: ["Order received", "In progress", "Order delivered", "Cancelled"],
  },
  orderItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  payment: {
    type: Schema.Types.ObjectId,
    ref: "Payment",
  },
});
const validateOrder = (order) => {
  const schema = Joi.object({
    orderStatus: Joi.string()
      .valid("Order received", "In progress", "Order delivered", "Cancelled")
      .required(),
    orderItems: Joi.array().items(Joi.string().required()).required(),
    payment: Joi.string().optional(),
  });

  return schema.validate(order);
};

const categorySchema = new Schema({
  name: {
    type: String,
  },
});
const validateCategory = (category) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  return schema.validate(category);
};

const paymentSchema = new Schema({
  transactionNumber: {
    type: String,
  },
  cardNumber: {
    type: String,
  },
});
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
const CategoryModel = mongoose.model("Category", categorySchema);
const PaymentModel = mongoose.model("Payment", paymentSchema);

export {
  CategoryModel,
  OrderModel,
  PaymentModel,
  ProductModel,
  UserModel,
  validateCategory,
  validateOrder,
  validatePayment,
  validateProduct,
  validateUser,
};
