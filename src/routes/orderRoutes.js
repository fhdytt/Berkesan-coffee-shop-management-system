const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Create order (public)
router.post('/', orderController.create);

// Get all orders (protected)
router.get('/', authenticate, orderController.getAll);

// Get order by ID (protected)
router.get('/:id', authenticate, orderController.getById);

// Update order status (protected - admin only)
router.patch('/:id/status', authenticate, orderController.updateStatus);

module.exports = router;