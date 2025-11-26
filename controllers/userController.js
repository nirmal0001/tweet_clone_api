const prisma = require('../config/prisma');
const { validUsername } = require('../config/validation');
const { validationResult, matchedData } = require('express-validator');

// user/me
exports.me = [
  async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        comments: true,
        follower: true,
        following: true,
        posts: true,
        profile: true,
      },
      omit: {
        hashPass: true,
      },
    });
    return res.json(user);
  },
];

// user/:username
exports.getUsers = [
  validUsername,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const username = matchedData(req).username;
    const user = await prisma.user.findMany({
      where: { username: { contains: username } },
      include: {
        comments: true,
        follower: true,
        following: true,
        posts: true,
        profile: true,
      },
      omit: {
        hashPass: true,
      },
    });
    return res.json(user);
  },
];

// user
exports.getSomeUsers = [
  async (req, res) => {
    const user = await prisma.user.findMany({
      take: 20,
      omit: { hashPass: true },
    });
    return res.json(user);
  },
];
