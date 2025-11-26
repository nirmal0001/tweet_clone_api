const { Router } = require('express');
const postController = require('../controllers/postController');
const postRouter = Router();

postRouter.get('/:postId', postController.getPost);
postRouter.get('/', postController.getPosts);
postRouter.post('/', postController.createPost);
postRouter.patch('/:postId', postController.updatePost);
postRouter.delete('/:postId', postController.deletePost);

module.exports = postRouter;
