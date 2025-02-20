import * as fs from 'node:fs/promises';
import path from 'node:path';

async function readMovies() {
  const filePath = path.resolve('src/movies/movies.txt');
  const data = await fs.readFile(filePath, { encoding: 'utf-8' });

  return data;
}

export { readMovies };
