const {chatEventEmitter, NEW_MESSAGE_EVENT} = require('./chatEventEmitter');

const longPollingChatPromise = () => {
  return new Promise((resolve) => {
    chatEventEmitter.once(NEW_MESSAGE_EVENT, (message) => {
      resolve(message);
    });
  });
};

exports.longPollingChatPromise = longPollingChatPromise;
