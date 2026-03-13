const cartService = require('../services/cartService');

class CartController {
  async getCart(req, res) {
    try {
      const cart = await cartService.getCart(req.user.id);
      res.json(cart);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const cartItem = await cartService.addToCart(req.user.id, productId, quantity);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateQuantity(req, res) {
    try {
      const { quantity } = req.body;
      const cartItem = await cartService.updateQuantity(req.user.id, req.params.id, quantity);
      res.json(cartItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeFromCart(req, res) {
    try {
      await cartService.removeFromCart(req.user.id, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new CartController();
