import axios from "axios";
import {
  createOrder,
  getOrderRepoById,
  updateOrderPaymentRepo,
  listOrders as listOrdersRepo,
} from "../database/repositories/order.repository.js";

// Python Service Port configuration
const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || "http://localhost:4004";

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

  // 2. Save Order
  const savedOrder = await createOrder(orderData);

  try {
    // 3. Clean the URL construction to prevent double slashes
    // This removes any trailing slash from the base URL before adding the path
    const cleanBaseUrl = PAYMENT_SERVICE_URL.replace(/\/+$/, "");
    const targetUrl = `${cleanBaseUrl}/api/v1/payments/generate`;

    // Log the URL so you can see it in Render Logs for debugging
    console.log(`🔗 Attempting to reach Payment Service at: ${targetUrl}`);

    const paymentResponse = await axios.post(targetUrl, {
      order_id: savedOrder._id.toString(),
      amount: savedOrder.total,
    });

    return {
      success: true,
      order: savedOrder,
      paymentData: paymentResponse.data.data,
    };
  } catch (error) {
    // 4. Enhanced logging for production
    console.error("❌ Payment Service Error:", {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
    });

    return {
      success: true,
      order: savedOrder,
      paymentData: null,
      warning: "Order saved but QR generation failed. Check Render logs.",
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
