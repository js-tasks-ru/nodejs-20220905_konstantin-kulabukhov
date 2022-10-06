const EventEmitter = require('node:events');

const NEW_MESSAGE_EVENT = 'newMessage';

const chatEventEmitter = new EventEmitter();

exports.chatEventEmitter = chatEventEmitter;
exports.NEW_MESSAGE_EVENT = NEW_MESSAGE_EVENT;
