import path from 'node:path';

import express from 'express';
import cookieParser from 'cookie-parser';

import routes from './routes/index.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();

app.use('/uploads', express.static(path.resolve('src', 'uploads')));

app.use(cookieParser());
app.use(routes);

// Handle 404 Error
app.use(notFoundHandler);

// Handle Application Error
app.use(errorHandler);

export default app;
