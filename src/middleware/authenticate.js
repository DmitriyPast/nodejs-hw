import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export function authenticate(req, res, next) {
  // 1. Перевіряємо наявність accessToken
  if (!req.cookies.accessToken)
    return next(createHttpError(401, 'Missing access token'));

  // 2. Якщо access токен існує, шукаємо сесію
  const session = Session.findOne({ accessToken: req.cookies.accessToken });

  // 3. Якщо такої сесії нема, повертаємо помилку
  if (!session) return next(createHttpError(401, 'Session not found'));

  // 4. Перевіряємо термін дії access токена
  if (new Date() > session.accessTokenValidUntil)
    return next(createHttpError(401, 'Access token expired'));

  // 5. Якщо з токеном все добре і сесія існує, шукаємо користувача
  const user = User.findById(session.userId);

  // 6. Якщо користувача не знайдено
  if (!user) return next(createHttpError(401));

  // 7. Якщо користувач існує, додаємо його до запиту;
  // 8. Передаємо управління далі
  req.user = user && next();
}
