import axios from "axios";
import {
  createOrder,
  getOrderRepoById,
  updateOrderPaymentRepo,
  listOrders as listOrdersRepo,
} from "../database/repositories/order.repository.js";

// Python Service Port configuration
const PAYMENT_SERVICE_URL = "http://localhost:4004";
/**
 * Place an order & Get Bakong QR from Python Microservice
 * @param {Object} data - { userId, products: [{ productId, quantity }], total }
 * @returns {Object} - { order, paymentData }
 */
export const placeOrder = async (data) => {
  // 1. Validation
  if (!data.products || !Array.isArray(data.products)) {
    throw new Error("Products array is required");
  }

  if (!data.userId) {
    throw new Error("User ID is required to place an order");
  }

  // 2. Prepare Order Structure
  const calculatedTotal = data.total || 0;
  const orderData = {
    userId: data.userId,
    products: data.products.map((p) => ({
      productId: p.productId,
      quantity: p.quantity,
    })),
    total: Number(calculatedTotal.toFixed(2)),
    status: "pending",
    paymentStatus: "unpaid",
  };

  // 3. Save Order to Database (MongoDB)
  const savedOrder = await createOrder(orderData);

  // 4. Request KHQR Generation from Python Payment Service
  // 4. Request KHQR Generation from Python Payment Service
  try {
    // Ensure the URL includes the full path /api/v1/payments/generate
    const targetUrl = `${PAYMENT_SERVICE_URL}/api/v1/payments/generate`;

    const paymentResponse = await axios.post(targetUrl, {
      order_id: savedOrder._id.toString(), // ⚠️ USE order_id (snake_case) to match your Python fix
      amount: savedOrder.total,
    });

    return {
      success: true,
      order: savedOrder,
      paymentData: paymentResponse.data.data,
    };
  } catch (error) {
    console.error(
      "❌ Communication with Python Payment Service failed:",
      error.message
    );

    // We return the order anyway so the user doesn't lose their cart,
    // but we flag that the QR code generation failed.
    return {
      success: true,
      order: savedOrder,
      paymentData: null,
      warning:
        "Order saved but payment QR could not be generated. Please try again from order history.",
    };
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (id) => {
  const order = await getOrderRepoById(id);
  if (!order) throw new Error("Order not found");
  return order;
};

/**
 * List all orders with optional filters
 */
export const listOrders = async (filter = {}) => {
  return await listOrdersRepo(filter);
};

/**
 * Update order status to paid (usually called by Payment Callback)
 * @param {String} orderId
 * @param {String} transactionId - External reference from Bakong
 */
export const markOrderAsPaid = async (orderId, transactionId) => {
  const updatedOrder = await updateOrderPaymentRepo(orderId, {
    paymentStatus: "paid",
    status: "processing",
    transactionId: transactionId,
  });

  if (!updatedOrder) throw new Error("Failed to update order payment status");
  return updatedOrder;
};
