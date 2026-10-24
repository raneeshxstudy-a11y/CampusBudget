import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { HttpError } from '../middleware/errorHandler.js';

const COOKIE_NAME = 'campusbudget_session';
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function publicUser(user) {
  return { id: String(user._id), name: user.name, email: user.email };
}

function setSession(res, user) {
  const token = jwt.sign({ sub: String(user._id) }, process.env.JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' });
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: WEEK_MS,
    path: '/',
  });
}

export async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 80) throw new HttpError(400, 'Name must be 2–80 characters');
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.length > 254) throw new HttpError(400, 'Enter a valid email');
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) throw new HttpError(400, 'Password must be 8–128 characters');
  const normalEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalEmail })) throw new HttpError(409, 'An account with this email already exists');
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalEmail, passwordHash });
  setSession(res, user);
  res.status(201).json({ user: publicUser(user) });
}

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') throw new HttpError(400, 'Email and password are required');
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new HttpError(401, 'Invalid email or password');
  setSession(res, user);
  res.json({ user: publicUser(user) });
}

export async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) throw new HttpError(401, 'Please sign in again');
  res.json({ user: publicUser(user) });
}

export function logout(req, res) {
  res.clearCookie(COOKIE_NAME, { path: '/', sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.status(204).end();
}
