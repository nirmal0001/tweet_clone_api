const { body, param, query } = require('express-validator');
const prisma = require('./prisma');

exports.signupValidation = [
  body('username')
    .trim()
    .isAlphanumeric()
    .withMessage('username can not be numbers only')
    .isLength({ min: 4, max: 20 })
    .withMessage('username should be between 4-20 char')
    .custom(async (username) => {
      const user = await prisma.user.findUnique({ where: { username } });
      if (user) throw new Error('username already exists');
    })
    .withMessage('username already exists'),
  body('password')
    .isLength({ min: 4, max: 40 })
    .withMessage('password need to be in 4-30 char')
    .custom((password, { req }) => {
      if (password == req.body.confirmPassword) return true;
      throw new Error('password does not match');
    })
    .withMessage('password does not match'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('email should be a valid email')
    .custom(async (email) => {
      const emailExist = await prisma.user.findUnique({ where: { email } });
      if (emailExist) throw new Error('email already exists');
    })
    .withMessage('email already exists'),
];

exports.validUsername = param('username')
  .isLength({ min: 4, max: 20 })
  .withMessage('username should be between 4-20 char');

exports.validProfileUpdate = [
  body('firstName')
    .trim()
    .isAlpha()
    .withMessage('number not allowed')
    .isLength({ min: 2, max: 20 })
    .withMessage('your name is smaller then 2 char ???? hum???')
    .optional(),
  body('lastName')
    .trim()
    .isAlpha()
    .withMessage('number not allowed')
    .isLength({ min: 2, max: 20 })
    .withMessage('your name is smaller then 2 char ???? hum???')
    .optional(),
  body('DOB').isDate().withMessage('only takes date object').optional(),
  body('bio').trim().isString().isLength({ min: 5, max: 120 }).optional(),
];

exports.validPostId = param('postId')
  .isInt()
  .custom(async (postId) => {
    await prisma.post.findUniqueOrThrow({ where: { id: Number(postId) } });
  })
  .withMessage('post not found')
  .optional()
  .toInt();

exports.validPostRequest = [
  query('order')
    .isString()
    .isIn(['asc', 'desc'])
    .withMessage('sort only takes asc/desc')
    .optional()
    .toLowerCase(),
  query('cursor').isInt().withMessage('cursor takes an Int').optional().toInt(),
  query('take')
    .isInt()
    .withMessage('takes the amount of post requested')
    .optional()
    .toInt(),
];

exports.validPostCreate = body('text')
  .notEmpty()
  .withMessage('text is required');

exports.validUpdatePost = param('postId')
  .isInt()
  .withMessage('id Should be int')
  .custom(async (postId, { req }) => {
    await prisma.post.findUniqueOrThrow({
      where: { id: Number(postId), userId: req.user.id },
    });
  })
  .withMessage('post not found')
  .toInt();

exports.validDeletePost = param('postId')
  .isInt()
  .withMessage('id Should be int')
  .custom(async (postId, { req }) => {
    await prisma.post.findUniqueOrThrow({
      where: { id: Number(postId), userId: req.user.id },
    });
  })
  .withMessage('post not found')
  .toInt();
