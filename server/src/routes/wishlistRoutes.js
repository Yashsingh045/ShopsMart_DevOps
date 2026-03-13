const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All wishlist routes require authentication
router.use(authMiddleware);

router.get('/', (req, res) => wishlistController.getWishlist(req, res));
router.post('/folders', (req, res) => wishlistController.createFolder(req, res));
router.delete('/folders/:id', (req, res) => wishlistController.deleteFolder(req, res));
router.post('/items', (req, res) => wishlistController.addItem(req, res));
router.delete('/items/:folderId/:productId', (req, res) => wishlistController.removeItem(req, res));
router.post('/move', (req, res) => wishlistController.moveItem(req, res));

module.exports = router;
