import crypto from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';

export function createSession(userId) {
  // console.log(`crypto.randomBytes test: ${crypto.randomBytes(30).toString('base64')}`);
  return Session.create({
    userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
}

export function setSessionCookies(res, session) {
  // console.log(`setSessionCookies Session: ${session}`);
  // console.log(session);
  const options = { httpOnly: true, secure: true, sameSite: 'none' };

  res.cookie('accessToken', session.accessToken, {
    ...options,
    maxAge: FIFTEEN_MINUTES,
  });
  res.cookie('refreshToken', session.refreshToken, {
    ...options,
    maxAge: ONE_DAY,
  });
  res.cookie('sessionId', session._id, {
    ...options,
    maxAge: ONE_DAY,
  });
}
