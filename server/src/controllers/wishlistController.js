const wishlistService = require('../services/wishlistService');

class WishlistController {
  async getWishlist(req, res) {
    try {
      const wishlist = await wishlistService.getWishlist(req.user.id);
      res.json(wishlist);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async createFolder(req, res) {
    try {
      const { name } = req.body;
      const folder = await wishlistService.createFolder(req.user.id, name);
      res.status(201).json(folder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteFolder(req, res) {
    try {
      await wishlistService.deleteFolder(req.user.id, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addItem(req, res) {
    try {
      const { folderId, productId } = req.body;
      const item = await wishlistService.addItemToFolder(req.user.id, folderId, productId);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeItem(req, res) {
    try {
      const { folderId, productId } = req.params;
      await wishlistService.removeItemFromFolder(req.user.id, folderId, productId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async moveItem(req, res) {
    try {
      const { fromFolderId, toFolderId, productId } = req.body;
      const result = await wishlistService.moveItem(req.user.id, fromFolderId, toFolderId, productId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new WishlistController();
