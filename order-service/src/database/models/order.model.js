import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // or mongoose.Schema.Types.ObjectId as string
      required: true,
    },

    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed", "cancelled"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending_verification", "paid", "refunded"],
      default: "unpaid",
    },

    transactionId: String,
  },
  { timestamps: true }
);

export default mongoose.model("order", orderSchema);
