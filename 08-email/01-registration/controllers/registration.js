const {v4: uuid} = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;

  const verificationToken = uuid();

  try {
    const newUser = new User({email, displayName, verificationToken});

    await newUser.setPassword(password);
    await newUser.save();

    await sendMail({
      template: 'confirmation',
      locals: {token: verificationToken},
      to: email,
      subject: 'Подтвердите почту',
    });

    ctx.body = {status: 'ok'};
  } catch (e) {
    throw e;
  }
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;

  try {
    const user = await User.findOneAndUpdate(
        {verificationToken},
        {$unset: {verificationToken: 1}},
        {runValidators: true, new: true},
    );

    if (!user) {
      ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
      return;
    }

    const token = await ctx.login(user);

    ctx.body = {token};
  } catch (e) {
    throw e;
  }
};
