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

const ProductModel = mongoose.model("Product", productSchema);

export { ProductModel, validateProduct };
