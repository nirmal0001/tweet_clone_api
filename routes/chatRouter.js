const { Router } = require('express');
const chatController = require('../controllers/chatController');

const chatRouter = Router();

chatRouter.get('/', chatController.getChats);
chatRouter.get('/:receiverId', chatController.getChat);
chatRouter.delete('/:chatId', chatController.deleteChat);
module.exports = chatRouter;
