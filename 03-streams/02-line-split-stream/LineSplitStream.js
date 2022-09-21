const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.lines = [];
  }

  _transform(chunk, encoding, callback) {
    const newLines = chunk.toString().split(os.EOL);

    if (!newLines.length) {
      callback();
      return;
    }

    const firstNewLine = newLines.shift();
    const oldLine = this.lines[0] || '';

    this.lines[0] = oldLine + firstNewLine;

    if (!newLines.length) {
      callback();
      return;
    }

    const lastNewLine = newLines.pop();

    this.lines = [...this.lines, ...newLines];

    this.lines.forEach((line) => {
      this.push(line);
    });

    this.lines = [lastNewLine];

    callback();
  }

  _flush(callback) {
    this.lines.forEach((line) => {
      this.push(line);
    });

    callback();
  }
}

module.exports = LineSplitStream;
