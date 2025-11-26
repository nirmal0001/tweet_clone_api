const { Router } = require('express');
const likeController = require('../controllers/likeController');
const likeRouter = Router({ mergeParams: true });
likeRouter.get('/', likeController.getLikes);
likeRouter.post('/', likeController.toggleLike);

module.exports = likeRouter;
