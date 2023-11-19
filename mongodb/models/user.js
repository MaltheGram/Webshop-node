import Joi from "joi";
import mongoose from "mongoose";
const { Schema } = mongoose;

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
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

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

const UserModel = mongoose.model("User", userSchema);

export { UserModel, validateUser };

