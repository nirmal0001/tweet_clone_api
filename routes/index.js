const authRouter = require('./authRouter');
const commentRouter = require('./commentRouter');
const postRouter = require('./postRouter.');
const profileRouter = require('./profileRouter');
const userRouter = require('./usersRouter');

module.exports = {
  authRouter,
  profileRouter,
  userRouter,
  postRouter,
  commentRouter,
};
