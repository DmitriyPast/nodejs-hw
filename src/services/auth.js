import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time';
import { Session } from '../models/session';

export function createSession(userId) {
  return Session.create({
    userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
}

export function setSessionCookies(res, session) {
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
