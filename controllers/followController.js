const { validationResult, matchedData } = require('express-validator');
const {
  validFollowId,
  validFollowerStatus,
  validFollowingId,
  validFollowerId,
} = require('../config/validation');
const prisma = require('../config/prisma');

exports.getFollowers = async (req, res) => {
  const following = await prisma.follow.findMany({
    where: { followerId: req.user.id },
    include: {
      following: {
        include: {
          profile: true,
        },
        omit: {
          hashPass: true,
        },
      },
    },
  });
  const follower = await prisma.follow.findMany({
    where: { followingId: req.user.id },
    include: {
      following: {
        include: {
          profile: true,
        },
        omit: {
          hashPass: true,
        },
      },
    },
  });
  res.json({ following, follower });
};
exports.createFollower = [
  validFollowerId,

  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const follow = await prisma.follow.create({
      data: {
        followerId: req.user.id,
        followingId: data.followingId,
      },
    });
    res.json(follow);
  },
];
exports.updateFollower = [
  validFollowingId,
  validFollowerStatus,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const follow = await prisma.follow.update({
      where: {
        id: data.followId,
      },
      data: {
        status: 'accepted',
      },
    });
    res.json(follow);
  },
];

exports.deleteFollower = [
  validFollowId,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const follow = await prisma.follow.delete({
      where: {
        id: data.followId,
      },
    });
    await res.json(follow);
  },
];
