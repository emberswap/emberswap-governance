const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { version } = require("../package.json");

function readProposals() {
  const proposals = {};
  const dir = "./proposals";

  fs.readdirSync(dir).forEach((filename) => {
    const filepath = path.resolve(dir, filename);
    const stat = fs.statSync(filepath);
    const isFile = stat.isFile();

    if (isFile) {
      const fdata = fs.readFileSync(filepath, 'utf8');
      const h = crypto.createHash('sha256').update(fdata).digest('hex');
      proposals[h] = JSON.parse(fdata);
    }
  });

  return proposals;
}

module.exports = function buildList() {
  const parsed = version.split(".");
  return {
    timestamp: new Date().toISOString(),
    version: {
      major: +parsed[0],
      minor: +parsed[1],
      patch: +parsed[2],
    },
    proposals: readProposals(),
  };
};
