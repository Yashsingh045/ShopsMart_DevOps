const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// User profile routes require authentication
router.use(authMiddleware);

router.get('/profile', (req, res) => userController.getProfile(req, res));
router.put('/profile', (req, res) => userController.updateProfile(req, res));

module.exports = router;
