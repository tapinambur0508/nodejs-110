/* eslint-disable no-unused-vars */
import createHttpError from 'http-errors';

export function errorHandler(error, _req, res, _next) {
  if (createHttpError.isHttpError(error) === true) {
    return res
      .status(error.status)
      .json({ status: error.status, message: error.message });
  }

  console.error(error);

  res.status(500).json({ status: 500, message: 'Internal server error' });
}
