const {isValidObjectId} = require('mongoose');

module.exports.validateObjectId = (value, ctx) => {
  if (isValidObjectId(value)) {
    return true;
  }

  ctx.status = 400;
  return false;
};
