const { Router } = require('express');
const followController = require('../controllers/followController');
const followRouter = Router();
followRouter.get('/', followController.getFollowers);
followRouter.post('/', followController.createFollower);
followRouter.patch('/:followId', followController.updateFollower);
followRouter.delete('/:followId', followController.deleteFollower);
module.exports = followRouter;
