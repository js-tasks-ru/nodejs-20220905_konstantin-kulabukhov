const http = require('http');
const path = require('path');
const {createWriteStream} = require('fs');
const {access, unlink} = require('fs/promises');

const LimitSizeStream = require('./LimitSizeStream');
const LimitExceededError = require('./LimitExceededError');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      const pathSize = pathname.split('/').filter(Boolean).length;

      if (pathSize > 1) {
        res.statusCode = 400;
        res.end();
        return;
      }

      try {
        await access(filepath);

        res.statusCode = 409;
        res.end();
        return;
      } catch (e) {}

      const writeStream = createWriteStream(filepath);
      const limitSizeStream = new LimitSizeStream({limit: 1000000});

      const handleGeneralError = () => {
        res.statusCode = 500;
        res.end();
      };

      const removeFile = async () => {
        try {
          await unlink(filepath);
        } catch (e) {}
      };

      req.pipe(limitSizeStream).pipe(writeStream);

      req.on('close', () => {
        if (req.readableAborted) {
          removeFile();
          req.unpipe();
          res.end();
        }
      });

      req.on('error', (error) => {
        handleGeneralError();
      });

      writeStream.on('error', (error) => {
        handleGeneralError();
        return;
      });

      limitSizeStream.on('error', (error) => {
        if (error instanceof LimitExceededError) {
          removeFile();
          res.statusCode = 413;
          res.end();
          return;
        }

        handleGeneralError();
      });

      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('File created');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
