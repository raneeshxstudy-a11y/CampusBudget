import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { HttpError } from './errorHandler.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.campusbudget_session;
  if (!token) return next(new HttpError(401, 'Please sign in to continue'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    if (!mongoose.isValidObjectId(payload.sub)) throw new Error('Invalid subject');
    req.userId = payload.sub;
    next();
  } catch {
    next(new HttpError(401, 'Your session has expired. Please sign in again.'));
  }
}
