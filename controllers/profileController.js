const { validationResult, matchedData } = require('express-validator');
const { validUsername, validProfileUpdate } = require('../config/validation');
const prisma = require('../config/prisma');
const { upload } = require('../config/multer');

// profile/me
exports.me = [
  async (req, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        // comments: true,
        // follower: true,
        // following: true,
        // posts: true,
        profile: true,
      },
      omit: {
        hashPass: true,
      },
    });
    return res.json(user);
  },
];

// profile/:username
exports.getUser = [
  validUsername,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const username = matchedData(req).username;
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        // comments: true,
        // follower: true,
        // following: true,
        // posts: true,
        profile: true,
      },
      omit: {
        hashPass: true,
      },
    });
    return res.json(user);
  },
];

// use multer
// profile/:username/edit
exports.editProfile = [
  upload.single('avatar'),
  validProfileUpdate,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const editData = matchedData(req);
    const filepath = req.file ? req.file.path : false;
    if (editData?.DOB) {
      editData.DOB = new Date(editData.DOB);
    }
    filepath && (editData.avatar = filepath);
    if (Object.keys(editData).length !== 0) {
      await prisma.profile.update({
        where: { userId: req.user.id },
        data: editData,
      });
      return res.json({ status: 'ok' });
    }
    return res.json({ error: 'no data' });
  },
];
