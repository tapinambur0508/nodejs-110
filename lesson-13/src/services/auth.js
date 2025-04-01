import * as fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src/templates/reset-password.hbs'),
  { encoding: 'UTF-8' },
);

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
    accessTokenValidUntil: new Date(Date.now() + 150 * 60 * 1000),
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
    accessTokenValidUntil: new Date(Date.now() + 150 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}

export async function requestResetPassword(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw createHttpError.NotFound('User not found');
  }

  const resetToken = jwt.sign(
    { sub: user._id, name: user.name },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const template = handlebars.compile(RESET_PASSWORD_TEMPLATE);

  await sendEmail(email, 'Reset your password', template({ resetToken }));
}

export async function resetPassword(token, newPassword) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));

    const user = await User.findById(decoded.sub);

    if (user === null) {
      throw createHttpError.NotFound('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createHttpError.Unauthorized('Token is unauthorized');
    }

    if (error.name === 'TokenExpiredError') {
      throw createHttpError.Unauthorized('Token is expired');
    }

    throw error;
  }
}

export async function loginOrRegister(email, name) {
  let user = await User.findOne({ email });

  if (user === null) {
    const password = await bcrypt.hash(
      crypto.randomBytes(30).toString('base64'),
      10,
    );

    user = await User.create({
      email,
      name,
      password,
    });
  }

  await Session.deleteOne({ userId: user._id });

  return Session.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 150 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
}
