const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', (req, res) => productController.getProducts(req, res));
router.get('/:id', (req, res) => productController.getProduct(req, res));

module.exports = router;
