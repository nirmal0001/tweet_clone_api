const { body } = require('express-validator');
const prisma = require('./prisma');

exports.signupValidation = [
  body('username')
    .trim()
    .isAlphanumeric()
    .withMessage('username can not be numbers only')
    .isLength({ min: 4, max: 20 })
    .withMessage('username should be between 4-20 char')
    .custom(async (username) => {
      const user = await prisma.user.findFirst({ where: { username } });
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
      const emailExist = await prisma.user.findFirst({ where: { email } });
      if (emailExist) throw new Error('email already exists');
    })
    .withMessage('email already exists'),
];
