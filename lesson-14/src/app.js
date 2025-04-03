import * as fs from 'node:fs';
import path from 'node:path';

import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUIExpress from 'swagger-ui-express';

import routes from './routes/index.js';

import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.resolve('docs', 'swagger.json'), 'utf-8'),
);

const app = express();

app.use(cors());

app.use(
  '/api-docs',
  swaggerUIExpress.serve,
  swaggerUIExpress.setup(swaggerDocument),
);

app.use('/uploads', express.static(path.resolve('src', 'uploads')));

app.use(cookieParser());
app.use(routes);

// Handle 404 Error
app.use(notFoundHandler);

// Handle Application Error
app.use(errorHandler);

export default app;
