const { Router } = require('express');
const profileController = require('../controllers/profileController');
const profileRouter = Router();

profileRouter.get('/me', profileController.me);
profileRouter.get('/:username', profileController.getUser);
profileRouter.patch('/:username/edit', profileController.editProfile);
module.exports = profileRouter;
