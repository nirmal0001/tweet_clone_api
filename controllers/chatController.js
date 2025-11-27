const { validationResult, matchedData } = require('express-validator');
const { validReceiverId, validChatId } = require('../config/validation');
const prisma = require('../config/prisma');

exports.getChats = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({ errors: result.array() });
  }
  const receiverId = matchedData(req).receiverId;

  const chat = await prisma.chat.findMany({
    where: {
      OR: [
        { userAId: req.user.id, userBId: receiverId },
        { userBId: req.user.id, userAId: receiverId },
      ],
    },
    include: {
      messages: true,
    },
  });

  return res.json(chat);
};
exports.getChat = [
  validReceiverId,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const receiverId = matchedData(req).receiverId;
    // this save searching twice by sorting user ids
    const [userAId, userBId] =
      req.user.id > receiverId
        ? [req.user.id, receiverId]
        : [receiverId, req.user.id];

    const chat = await prisma.chat.findUnique({
      where: { userAId_userBId: { userAId, userBId } },
      include: { messages: true },
    });

    if (!chat) {
      const newChat = await prisma.chat.create({
        data: { userAId: req.user.id, userBId: receiverId },
        include: { messages: true },
      });
      return res.json(newChat);
    }
    return res.json(chat);
  },
];
exports.deleteChat = [
  validChatId,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const chatId = matchedData(req).chatId;
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { userAId: req.user.id, id: chatId },
          { userBId: req.user.id, id: chatId },
        ],
      },
    });
    if (chats.length < 1) {
      return res.status(401).json({ error: { msg: 'chat does not exists' } });
    }
    const chat = await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });
    return res.json(chat);
  },
];
