const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function to generate a unique order number
function generateOrderNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `KK-${timestamp}-${random}`;
}

// @route   POST /orders
// @desc    Create a new order
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      items, 
      shippingAddress, 
      phoneNumber, 
      totalAmount, 
      cardNumber 
    } = req.body;

    // Validate required fields
    if (!items || !shippingAddress || !phoneNumber || !totalAmount || !cardNumber) {
      return res.status(400).json({ detail: 'Missing required order information' });
    }

    // Get the last 4 digits of the card
    const lastFourDigits = cardNumber.slice(-4);

    // Create new order
    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId: req.user.id,
      items,
      shippingAddress,
      phoneNumber,
      totalAmount,
      lastFourDigits,
      status: 'Processing'
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber
    });
    
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ detail: 'Server error during order placement' });
  }
});

// @route   GET /orders
// @desc    Get all orders for a user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({ 
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ detail: 'Server error while fetching orders' });
  }
});

module.exports = router;
