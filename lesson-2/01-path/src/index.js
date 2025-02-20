import { readMovies } from './movies/index.js';

readMovies().then(console.log).catch(console.error);
