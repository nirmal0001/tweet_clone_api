const { validationResult, matchedData } = require('express-validator');
const {
  validPostId,
  validCommentCreate,
  validMessageId,
} = require('../config/validation');
const prisma = require('../config/prisma');

exports.getComments = [
  validPostId,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const postId = matchedData(req).postId;
    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
    });
    return res.json(comments);
  },
];
exports.createComment = [
  validPostId,
  validCommentCreate,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    data.userId = req.user.id;
    const comment = await prisma.comment.create({ data });
    return res.json(comment);
  },
];
exports.updateComment = [
  validMessageId,
  validCommentCreate,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const comments = await prisma.comment.update({
      where: {
        id: data.commentId,
      },
      data: {
        text: data.text,
      },
    });
    return res.json(comments);
  },
];
exports.deleteComment = [
  validMessageId,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const comment = await prisma.comment.delete({
      where: {
        id: data.commentId,
      },
    });
    return res.json(comment);
  },
];
