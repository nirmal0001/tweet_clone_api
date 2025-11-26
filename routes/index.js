const authRouter = require('./authRouter');
const commentRouter = require('./commentRouter');
const likeRouter = require('./likeRouter');
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
};
