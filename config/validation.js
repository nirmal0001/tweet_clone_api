const { body, param, query } = require('express-validator');
const prisma = require('./prisma');

// login/signup validations
exports.signupValidation = [
  body('username')
    .trim()
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers')
    .isLength({ min: 4, max: 20 })
    .withMessage('Username must be between 4 and 20 characters')
    .custom(async (username) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (user) throw new Error('Username already taken');
    }),

  body('password')
    .isLength({ min: 4, max: 40 })
    .withMessage('Password must be between 4 and 40 characters')
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword)
        throw new Error('Passwords do not match');
      return true;
    }),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Enter a valid email address')
    .custom(async (email) => {
      const emailExist = await prisma.user.findUnique({ where: { email } });
      if (emailExist) throw new Error('Email already registered');
    }),
];

exports.validUsername = param('username')
  .isLength({ min: 4, max: 20 })
  .withMessage('Username must be between 4 and 20 characters');

// profile validations
exports.validProfileUpdate = [
  body('firstName')
    .trim()
    .isAlpha()
    .withMessage('First name can only contain letters')
    .isLength({ min: 2, max: 20 })
    .withMessage('First name must be at least 2 characters')
    .optional(),

  body('lastName')
    .trim()
    .isAlpha()
    .withMessage('Last name can only contain letters')
    .isLength({ min: 2, max: 20 })
    .withMessage('Last name must be at least 2 characters')
    .optional(),

  body('DOB').isDate().withMessage('Invalid date format').optional(),

  body('bio')
    .trim()
    .isString()
    .isLength({ min: 5, max: 120 })
    .withMessage('Bio must be 5–120 characters')
    .optional(),
];

// post validations
exports.validPostId = param('postId')
  .isInt()
  .withMessage('Post ID must be an integer')
  .custom(async (postId) => {
    await prisma.post.findUniqueOrThrow({ where: { id: Number(postId) } });
  })
  .withMessage('Post not found')
  .optional()
  .toInt();

exports.validPostRequest = [
  query('order')
    .isString()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
    .optional()
    .toLowerCase(),

  query('cursor')
    .isInt()
    .withMessage('Cursor must be a number')
    .optional()
    .toInt(),

  query('take').isInt().withMessage('Take must be a number').optional().toInt(),
];

exports.validPostCreate = body('text')
  .notEmpty()
  .withMessage('Post text is required');

exports.validUpdatePost = param('postId')
  .isInt()
  .withMessage('Post ID must be an integer')
  .custom(async (postId, { req }) => {
    await prisma.post.findUniqueOrThrow({
      where: { id: Number(postId), userId: req.user.id },
    });
  })
  .withMessage('Post not found or you are not the owner')
  .toInt();

exports.validDeletePost = param('postId')
  .isInt()
  .withMessage('Post ID must be an integer')
  .custom(async (postId, { req }) => {
    await prisma.post.findUniqueOrThrow({
      where: { id: Number(postId), userId: req.user.id },
    });
  })
  .withMessage('Post not found or you are not the owner')
  .toInt();

// comments validation
exports.validCommentId = param('commentId')
  .isInt()
  .withMessage('Comment ID must be an integer')
  .custom(async (value, { req }) => {
    await prisma.comment.findUniqueOrThrow({
      where: { id: Number(value), userId: req.user.id },
    });
  })
  .withMessage('Comment not found or you are not the owner')
  .toInt();

exports.validCommentCreate = body('text')
  .notEmpty()
  .withMessage('Comment text is required');

// chat validation
exports.validReceiverId = param('receiverId')
  .isInt()
  .withMessage('Receiver ID must be an integer')
  .custom(async (value, { req }) => {
    if (Number(value) === req.user.id)
      throw new Error('You cannot message yourself');

    await prisma.user.findUniqueOrThrow({
      where: { id: Number(value) },
    });
  })
  .withMessage('User not found')
  .toInt();

exports.validChatId = param('chatId')
  .isInt()
  .withMessage('Chat ID must be an integer')
  .custom(
    async (id) =>
      await prisma.chat.findUniqueOrThrow({ where: { id: Number(id) } })
  )
  .withMessage('Chat not found')
  .toInt();

// message validation
exports.validMessageText = body('text')
  .notEmpty()
  .withMessage('Message text is required');

exports.validMessageId = param('messageId')
  .isInt()
  .withMessage('Message ID must be an integer')
  .custom(async (value, { req }) => {
    await prisma.message.findUniqueOrThrow({
      where: { id: Number(value), senderId: req.user.id },
    });
  })
  .withMessage('Message not found or you are not the sender')
  .toInt();

// follower validation
exports.validFollowId = param('followId')
  .isInt()
  .withMessage('Follow ID must be an integer')
  .custom(async (value, { req }) => {
    const follow = await prisma.follow.findMany({
      where: {
        id: Number(value),
        OR: [{ followerId: req.user.id }, { followingId: req.user.id }],
      },
    });
    if (follow.length < 1) throw new Error('Follow not found');
  })
  .withMessage('Follow ID not found')
  .toInt();

exports.validFollowingId = param('followId')
  .isInt()
  .withMessage('Follow ID must be an integer')
  .custom(async (value, { req }) => {
    await prisma.follow.findUniqueOrThrow({
      where: {
        id: Number(value),
        followingId: req.user.id,
      },
    });
  })
  .withMessage('Follow entry not found')
  .toInt();

exports.validFollowerId = body('followingId')
  .isInt()
  .withMessage('Following ID must be an integer')
  .custom(async (value, { req }) => {
    if (Number(value) === req.user.id)
      throw new Error('You cannot follow yourself');

    await prisma.user.findUniqueOrThrow({
      where: { id: Number(value) },
    });
  })
  .withMessage('User not found')
  .toInt();

exports.validFollowerStatus = body('status')
  .equals('accepted')
  .withMessage("Status can only be 'accepted'");
