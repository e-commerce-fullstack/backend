import Order from '../models/order.model.js'
export const createOrder = (data) => {
  return Order.create(data);
};

export const getOrderRepoById = (id) => {
  return Order.findById(id);
};

export const listOrders = (filter = {}) => {
  return Order.find(filter).sort({ createdAt: -1 });
};

export const updateOrderPaymentRepo = (orderId, bankHash) => {
  return Order.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: "paid",
      status: "processing",
      transactionId: bankHash,
    },
    { new: true }
  );
};
