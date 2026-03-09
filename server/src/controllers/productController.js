const productService = require('../services/productService');

class ProductController {
  async getProducts(req, res) {
    try {
      const { category, minPrice, maxPrice, rating, search, page, limit } = req.query;
      const data = await productService.getProducts({ 
        category, minPrice, maxPrice, rating, search, page, limit 
      });
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProduct(req, res) {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ProductController();
