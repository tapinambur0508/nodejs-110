const fs = require('node:fs/promises');

fs.writeFile('write.txt', 'I like Node.JS')
  .then(() => console.log('Done'))
  .catch((error) => console.error(error));
