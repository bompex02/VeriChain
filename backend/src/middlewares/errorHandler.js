import { ApiError } from '../errors/ApiError.js';

// wrapper for Express error handling middleware to catch all errors and return consistent JSON responses
export const errorHandler = (error, req, res, next) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error?.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error('Unhandled backend error:', error);
  }

  res.status(statusCode).json({ error: message });
};
