const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All order routes require authentication
router.use(authMiddleware);

router.get('/', (req, res) => orderController.getOrders(req, res));
router.get('/:id', (req, res) => orderController.getOrderById(req, res));
router.post('/', (req, res) => orderController.createOrder(req, res));

module.exports = router;
