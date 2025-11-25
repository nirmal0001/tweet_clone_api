const { Router } = require('express');
const userController = require('../controllers/userController');
const userRouter = Router();

userRouter.get('/me', userController.me);
userRouter.get('/:username', userController.getUsers);
userRouter.get('/', userController.getSomeUsers);
module.exports = userRouter;
