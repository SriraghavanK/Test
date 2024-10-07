const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const auth = require("../middleware/auth"); // Assuming you have an auth middleware
// Create a new order
router.post("/", async (req, res) => {
  const { userId, items, total, status } = req.body;

  // Check if required fields are provided
  if (!userId || !items || !total) {
    return res.status(400).json({ msg: "Please include all required fields" });
  }

  try {
    const newOrder = new Order({ userId, items, total, status });
    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get user's orders
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.menuItem')
      .sort({ createdAt: -1 });

    // If no orders found
    if (!orders.length) {
      return res.status(404).json({ msg: "No orders found for this user" });
    }

    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Update order status (admin only)
router.put("/:orderId", async (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ msg: "Please include a status" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
