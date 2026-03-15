const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Inventory routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

router.get('/low-stock', (req, res) => inventoryController.getLowStock(req, res));
router.get('/:productId', (req, res) => inventoryController.getStockLevel(req, res));
router.put('/update', (req, res) => inventoryController.updateStock(req, res));

module.exports = router;
