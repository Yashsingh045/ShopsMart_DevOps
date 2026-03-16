const userService = require('../services/userService');

class UserController {
  async getProfile(req, res) {
    try {
      const profile = await userService.getUserProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserController();
