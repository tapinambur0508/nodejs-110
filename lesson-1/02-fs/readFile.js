// const fs = require("node:fs");

// fs.readFile("read.txt", { encoding: "UTF-8" },  (err, data) => {
//   if (err) {
//     throw err;
//   }

//   console.log(data);
// });

const fs = require('node:fs/promises');

fs.readFile('read.txt', { encoding: 'UTF-8' })
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
