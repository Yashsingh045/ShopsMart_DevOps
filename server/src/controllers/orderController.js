const orderService = require('../services/orderService');

class OrderController {
  async getOrders(req, res) {
    try {
      const orders = await orderService.getOrders(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderService.getOrderById(req.user.id, req.params.id);
      res.json(order);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const order = await orderService.createOrder(req.user.id);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
