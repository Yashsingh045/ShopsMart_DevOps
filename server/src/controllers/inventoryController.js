const inventoryService = require('../services/inventoryService');

class InventoryController {
  async getLowStock(req, res) {
    try {
      const threshold = req.query.threshold ? parseInt(req.query.threshold) : 10;
      const products = await inventoryService.getLowStockProducts(threshold);
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStock(req, res) {
    try {
      const { productId, newStock } = req.body;
      const product = await inventoryService.updateStock(productId, newStock);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getStockLevel(req, res) {
    try {
      const product = await inventoryService.getStockLevel(req.params.productId);
      res.json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new InventoryController();
