const fs = require('node:fs/promises');

async function main() {
  // const data = await fs.readFile('mix.txt', { encoding: 'utf-8' });
  // const transformedData = data.toUpperCase();
  // await fs.writeFile('mix.txt', transformedData);
  const data = await fs.readFile('mix.txt', { encoding: 'utf-8' });
  const words = data.replace(',', '').split(' ');

  return words.length;
}

main().then(console.log).catch(console.error);
