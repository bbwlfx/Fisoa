const fs = require('fs');
const path = require('path');

module.exports = function() {
  const version = JSON.parse(fs.readFileSync(path.join(__dirname, '../../versionFile.json')));
  return version;
};
