const { Router } = require('express');
const messageController = require('../controllers/messageController');
const messageRouter = Router({ mergeParams: true });

messageRouter.get('/', messageController.getMessages);
messageRouter.post('/', messageController.createMessage);
messageRouter.patch('/:messageId', messageController.updateMessage);
messageRouter.delete('/:messageId', messageController.deleteMessage);
module.exports = messageRouter;
