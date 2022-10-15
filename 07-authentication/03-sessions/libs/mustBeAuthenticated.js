module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    // eslint-disable-next-line no-throw-literal
    throw ({status: 401, message: 'Пользователь не залогинен'});
  }

  return next();
};
