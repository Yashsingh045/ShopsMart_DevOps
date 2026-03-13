const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All cart routes require authentication
router.use(authMiddleware);

router.get('/', (req, res) => cartController.getCart(req, res));
router.post('/', (req, res) => cartController.addToCart(req, res));
router.put('/:id', (req, res) => cartController.updateQuantity(req, res));
router.delete('/:id', (req, res) => cartController.removeFromCart(req, res));

module.exports = router;
