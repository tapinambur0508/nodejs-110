import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
  requestResetPassword,
  resetPassword,
  loginOrRegister,
} from '../services/auth.js';

import { getOAuthURL, validateCode } from '../utils/googleOAuth.js';

export async function registerController(req, res) {
  const user = await registerUser(req.body);

  res
    .status(200)
    .json({ status: 200, message: 'User successfully registered', data: user });
}

export async function loginController(req, res) {
  const session = await loginUser(req.body.email, req.body.password);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'User successfully logged',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function logoutController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  if (typeof sessionId === 'string' && typeof refreshToken === 'string') {
    await logoutUser(sessionId, refreshToken);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).end();
}

export async function refreshController(req, res) {
  const { sessionId, refreshToken } = req.cookies;

  const session = await refreshSession(sessionId, refreshToken);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'User successfully logged',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export async function requestPasswordResetController(req, res) {
  const { email } = req.body;

  await requestResetPassword(email);

  res.json({ status: 200, message: 'Reset password email sent successfully' });
}

export async function resetPasswordController(req, res) {
  const { token, password } = req.body;

  await resetPassword(token, password);

  res.send('Reset password');
}

export async function getOAuthUrlController(req, res) {
  const url = getOAuthURL();

  res.json({
    status: 200,
    message: 'Successfully get OAuth url',
    data: {
      oauth_url: url,
    },
  });
}

export async function confirmOAuthController(req, res) {
  const ticket = await validateCode(req.body.code);
  const session = await loginOrRegister(
    ticket.payload.email,
    ticket.payload.name,
  );

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expire: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'User successfully logged',
    data: {
      accessToken: session.accessToken,
    },
  });
}
