const { Router } = require('express');
const authController = require('../controllers/authController');
const authRouter = Router();

authRouter.get('login', authController.login);
authRouter.post('signup', authController.signup);
authRouter.post('logout', authController.logout);

module.exports = authRouter;
