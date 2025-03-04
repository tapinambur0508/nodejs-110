/* eslint-disable no-unused-vars */

export function errorHandler(error, _req, res, _next) {
  console.error(error);
  res.status(500).json({ status: 500, message: 'Internal server error' });
}
