const http = require('http');
const path = require('path');
const {unlink} = require('fs/promises');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':

      const pathSize = pathname.split('/').filter(Boolean).length;

      if (pathSize > 1) {
        res.statusCode = 400;
        res.end();
        return;
      }

      try {
        await unlink(filepath);
        res.end();
      } catch (error) {
        if (error.code === 'ENOENT') {
          res.statusCode = 404;
        } else {
          res.statusCode = 500;
        }

        res.end();
        return;
      }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
