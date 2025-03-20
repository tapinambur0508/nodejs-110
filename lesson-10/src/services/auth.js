import crypto from 'node:crypto';

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export async function registerUser(payload) {
  const user = await User.findOne({ email: payload.email });

  if (user !== null) {
    throw createHttpError.Conflict('Email is already exists');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch !== true) {
    throw createHttpError.Unauthorized('Email or password is incorrect');
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId, refreshToken) {
  await Session.deleteOne({ _id: sessionId, refreshToken });

  return undefined;
}

export async function refreshSession(sessionId, refreshToken) {
  const currentSession = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (currentSession === null) {
    throw createHttpError.Unauthorized('Session not found');
  }

  if (currentSession.refreshTokenValidUntil < new Date()) {
    throw createHttpError.Unauthorized('Refresh token is expired');
  }

  await Session.deleteOne({
    _id: currentSession._id,
    refreshToken: currentSession.refreshToken,
  });

  return Session.create({
    userId: currentSession.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}
