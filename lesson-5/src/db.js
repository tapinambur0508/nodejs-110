import mongoose from 'mongoose';

import { getEnvVar } from './utils/getEnvVar.js';

const DB_URI = getEnvVar('DB_URI');

export function initDatabaseConnection() {
  return mongoose.connect(DB_URI);
}
