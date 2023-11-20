import Joi from "joi";
import mongoose from "mongoose";
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    transactionNumber: {
      type: String,
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

const PaymentModel = mongoose.model("Payment", paymentSchema);

export { PaymentModel, validatePayment };
