import mongoose from 'mongoose';

const DB_URI = process.env.DB_URI;

export function initDatabaseConnection() {
  return mongoose.connect(DB_URI);
}
