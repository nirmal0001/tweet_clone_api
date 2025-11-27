const { validationResult, matchedData } = require('express-validator');
const {
  validChatId,
  validMessageText,
  validMessageId,
} = require('../config/validation');
const prisma = require('../config/prisma');

exports.getMessages = [
  validChatId,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const chatId = matchedData(req).chatId;
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });
    const user = req.user.id;
    if (chat.userAId == user || chat.userBId == user) {
      const messages = await prisma.message.findMany({
        where: { chatId: chatId },
      });
      return res.json(messages);
    }
    return res.status(401).json({ error: { msg: 'chat does not exists' } });
  },
];
exports.createMessage = [
  validChatId,
  validMessageText,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const senderId = req.user.id;
    const message = await prisma.message.create({
      data: {
        ...data,
        senderId,
        status: 'sent',
      },
    });
    return res.json(message);
  },
];
exports.updateMessage = [
  validMessageId,
  validMessageText,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const message = await prisma.message.update({
      where: {
        id: data.messageId,
      },
      data: {
        text: data.text,
      },
    });
    return res.json(message);
  },
];
exports.deleteMessage = [
  validMessageId,
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(401).json({ errors: result.array() });
    }
    const data = matchedData(req);
    const message = await prisma.message.delete({
      where: {
        id: data.messageId,
      },
    });
    return res.json(message);
  },
];
