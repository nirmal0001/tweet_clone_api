const { Router } = require('express');
const authController = require('../controllers/authController');
const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/signup', authController.signup);
authRouter.delete('/logout', authController.logout);

module.exports = authRouter;
