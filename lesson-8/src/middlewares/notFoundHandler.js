/* eslint-disable no-unused-vars */

export function notFoundHandler(_req, res, _next) {
  res.status(404).json({ status: 404, message: 'Route not found' });
}
