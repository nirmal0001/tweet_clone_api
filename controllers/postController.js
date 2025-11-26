const { validationResult, matchedData } = require('express-validator');
const {
  validPostId,
  validPostRequest,
  validPostCreate,
  validUpdatePost,
  validDeletePost,
} = require('../config/validation');
const prisma = require('../config/prisma');

exports.getPost = [
  validPostId,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const post = await prisma.post.findUnique({ where: { id: data.postId } });
    return res.json(post);
  },
];

exports.getPosts = [
  validPostRequest,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }

    const data = matchedData(req);
    const search = { take: 20 };
    if (data?.take) {
      search.take = data.take;
      search.skip = 1;
    }
    if (data?.cursor) {
      search.cursor = { id: data.cursor };
      search.skip = 1;
    }

    const posts = await prisma.post.findMany(search);
    // sorting after result as sorting before give wrong data cause it sort before take!!
    if (data?.order) {
      const sorter = data?.order === 'asc' ? 1 : -1;
      posts.sort(
        (a, b) => sorter * (new Date(a.updatedAt) - new Date(b.updatedAt))
      );
    }
    return res.json(posts);
  },
];

// in future just need to add multer to get image for a image post
exports.createPost = [
  validPostCreate,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }

    const data = matchedData(req);
    data.userId = req.user.id;
    const post = await prisma.post.create({ data: data });
    return res.json(post);
  },
];

// in future just need to add multer to update image post
// text becomes optional if photo is present
exports.updatePost = [
  validUpdatePost,
  validPostCreate,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const post = await prisma.post.update({
      where: { id: data.postId },
      data: {
        text: data.text,
      },
    });
    return res.json(post);
  },
];
exports.deletePost = [
  validDeletePost,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }

    const data = matchedData(req);
    const post = await prisma.post.findUnique({ where: { id: data.postId } });

    await prisma.post.delete({ where: { id: data.postId } });
    return res.json(post);
  },
];
