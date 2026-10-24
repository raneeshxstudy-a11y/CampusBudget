export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function notFound(req, res, next) {
  next(new HttpError(404, 'Route not found'));
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.code === 11000) return res.status(409).json({ error: { message: 'This record already exists' } });
  if (error.name === 'CastError') return res.status(400).json({ error: { message: 'Invalid ID' } });
  if (error.name === 'ValidationError') return res.status(400).json({ error: { message: 'Invalid data' } });
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  return res.status(status).json({ error: { message: status >= 500 ? 'Something went wrong. Please try again.' : error.message } });
}
