const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const {token} = socket.handshake.query;

    if (!token) {
      next(new Error('anonymous sessions are not allowed'));
    }

    const session = await Session.findOne({token}).populate('user');

    if (!session) {
      next(new Error('wrong or expired session token'));
    }

    socket.user = session.user;

    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      const {id, displayName} = socket.user;

      await Message.create({
        date: Date.now(),
        text: msg,
        chat: id,
        user: displayName,
      });
    });
  });

  return io;
}

module.exports = socket;
