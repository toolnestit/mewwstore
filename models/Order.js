import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    pricePaid: {
      type: Number,
      required: true,
    },
    plan: [
      {
        slug: String,
        expireAt: Date,
      },
    ],
    access: [
      {
        slug: String,
        expireAt: Date,
      },
    ],
    expireAt: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "PENDING",
    },
    metadata: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
