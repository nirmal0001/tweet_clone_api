const { Router } = require('express');
const commentController = require('../controllers/commentController');
const commentRouter = Router({ mergeParams: true });
commentRouter.get('/', commentController.getComments);
commentRouter.post('/', commentController.createComment);
commentRouter.patch('/:commentId', commentController.updateComment);
commentRouter.delete('/:commentId', commentController.deleteComment);

module.exports = commentRouter;
