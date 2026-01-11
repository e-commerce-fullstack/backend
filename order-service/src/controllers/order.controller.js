import { placeOrder, listOrders, getOrderById, markOrderAsPaid } from "../services/order.service.js";


export const create = async (req, res) => {
  console.log('--- Incoming Order Request ---');
  try {
    const data = {
      userId: req.body.userId, // use userId from gateway
      products: req.body.products,
      total: req.body.total,
    };

    const result = await placeOrder(data);

    res.status(201).json(result);
    console.log('--- Incomed Order Request ---');
  } catch (err) {
    console.error("❌ CREATE ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId } = req.body;
    
    // This calls the service function we looked at earlier
    const updatedOrder = await markOrderAsPaid(id, transactionId);
    
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAll = async (req, res) => {
  try {
    const orders = await listOrders({ userId: req.user._id });
    res.json(orders);
  } catch (err) {
    console.error("❌ GET ALL ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // CRASH PROTECTION: Use optional chaining before .toString()
    const orderOwnerId = order.user?._id?.toString() || order.user?.toString();
    const currentUserId = req.user?._id?.toString();

    if (orderOwnerId !== currentUserId) {
      return res.status(403).json({ message: "Permission denied" });
    }

    res.json(order);
  } catch (err) {
    console.error("❌ GET BY ID ERROR:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};