const authRouter = require('./authRouter');
const chatRouter = require('./chatRouter');
const commentRouter = require('./commentRouter');
const followRouter = require('./followRouter');
const likeRouter = require('./likeRouter');
const messageRouter = require('./messageRouter');
const postRouter = require('./postRouter.');
const profileRouter = require('./profileRouter');
const userRouter = require('./usersRouter');

module.exports = {
  authRouter,
  profileRouter,
  userRouter,
  postRouter,
  commentRouter,
  likeRouter,
  chatRouter,
  messageRouter,
  followRouter,
};
