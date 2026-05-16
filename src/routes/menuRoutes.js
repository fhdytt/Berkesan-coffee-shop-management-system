const express = require('express');
const menuController = require('../controllers/menuController');
const { authenticate, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', menuController.getAll);
router.get('/:id', menuController.getById);

// Protected routes (Admin only)
router.post('/', authenticate, authorizeAdmin, menuController.create);
router.put('/:id', authenticate, authorizeAdmin, menuController.update);
router.delete('/:id', authenticate, authorizeAdmin, menuController.delete);

module.exports = router;