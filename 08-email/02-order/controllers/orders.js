const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const orderConfirmation = require('../mappers/orderConfirmation');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
  const {user} = ctx;
  const {body} = ctx.request;

  try {
    const order = await Order.create({...body, user});
    const product = await order.populate('product');

    await sendMail({template: 'order-confirmation',
      locals: orderConfirmation(order, product),
      to: user.email});

    ctx.body = {order: order.id};
  } catch (e) {
    throw e;
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const {user} = ctx;

  const orders = await Order.find({user}).populate('product');

  const modifiedOrders = orders.map(mapOrder);

  ctx.body = {
    orders: modifiedOrders,
  };
};
