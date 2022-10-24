const Message = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const {id} = ctx.user;

  try {
    const messages = await Message.find({chat: id}).limit(20);

    ctx.body = {
      messages: messages.map(mapMessage),
    };
  } catch (e) {
    throw e;
  }
};
