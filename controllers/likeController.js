const { validationResult, matchedData } = require('express-validator');
const { validPostId } = require('../config/validation');
const prisma = require('../config/prisma');
exports.getLikes = [
  validPostId,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const postId = matchedData(req).postId;
    const comments = await prisma.like.findMany({
      where: {
        postId: postId,
      },
    });
    return res.json(comments);
  },
];
exports.toggleLike = [
  validPostId,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    data.userId = req.user.id;
    const alreadyLiked = await prisma.like.findUnique({
      where: {
        postId_userId: { postId: data.postId, userId: data.userId },
      },
    });
    if (alreadyLiked) {
      const comment = await prisma.like.delete({
        where: {
          postId_userId: { postId: data.postId, userId: data.userId },
        },
      });
      return res.json(comment);
    }
    const comment = await prisma.like.create({ data });
    return res.json(comment);
  },
];

exports.deleteLike = () => {};
