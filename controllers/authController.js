const { validationResult, matchedData } = require('express-validator');
const passport = require('passport');
const { signupValidation } = require('../config/validation');
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.msg || 'Invalid credentials' });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ status: 'ok' });
    });
  })(req, res, next);
};

exports.signup = [
  signupValidation,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const signupData = matchedData(req);
    const hashPass = await bcrypt.hash(signupData.password, 10);
    const user = await prisma.user.create({
      data: {
        username: signupData.username,
        email: signupData.email,
        hashPass,
        profile: { create: {} },
      },
    });

    req.login(user, (err) => {
      if (err) return next(err);
      return res.json({ status: 'ok' });
    });
  },
];

exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.json({ status: 'done' });
  });
};
