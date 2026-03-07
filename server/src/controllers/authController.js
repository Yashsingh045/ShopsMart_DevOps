const authService = require('../services/authService');

class AuthController {
  async signup(req, res) {
    try {
      const { email, password, name } = req.body;
      const { token, user } = await authService.signup(email, password, name);
      res.status(201).json({ token, user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  async getToken(req, res) {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
