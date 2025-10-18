import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

export async function registerUser(req, res, next) {
  const { email, password } = req.body;
  // console.log(email, password);
  // перевіряємо чи є такий email, якщо є повертаємо помилку
  if (await User.findOne({ email }))
    return next(createHttpError(400, 'Email in use'));

  // Хешуємо пароль
  const encPass = await bcrypt.hash(password, 10);

  // Створюємо користувача
  const newUser = await User.create({
    email,
    password: encPass,
  });
  // Створюємо нову сесію
  // const newUserSession = await createSession(newUser._id);
  // Встановлюємо куки, передаємо об'єкт відповіді та нову сесію
  setSessionCookies(res, await createSession(newUser._id));

  // Відправляємо дані користувача (без пароля) у відповіді
  res.status(201).json(newUser);
}

export async function loginUser(req, res, next) {
  const { email, password } = req.body;
  // якщо користувача немає в базі повертаємо помилку
  const user = await User.findOne({ email });

  if (!user) return next(createHttpError(401, 'User not found'));
  // перевіряємо чи співдадає введенй пароль із зашифрованим у базі
  if (!(await bcrypt.compare(password, user.password)))
    return next(createHttpError(401, 'Invalid credentials'));
  // console.log(user._id);

  // знаходимо і видаляємо попередню сесію якщо є
  await Session.findOneAndDelete({ userId: user._id }); //<== userId in Session is the same as _id in User^^
  // створюємо нову сесію і встановлюємо куки
  setSessionCookies(res, await createSession(user._id));

  res.status(200).json(user);
}

export async function refreshUserSession(req, res, next) {
  const { sessionId, refreshToken } = req.cookies;
  // console.log(req.cookies);
  // перевіряємо чи є сесія в базі
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (!session) return next(createHttpError(401, 'Session not found'));
  // if (new Date() > session.refreshTokenValidUntil)
  //   return (
  //     (await Session.findByIdAndDelete(session._id)) &&
  //     next(createHttpError(401, 'Session token expired'))
  //   );
  // видаляємо стару сесію
  await Session.findByIdAndDelete(session._id);
  // перевіряємо чи не вийшов строк дії токена
  if (new Date() > session.refreshTokenValidUntil)
    return next(createHttpError(401, 'Session token expired'));
  // створюємо нову сесію і встановлюємо куки
  setSessionCookies(res, await createSession(session.userId));

  res.status(200).json({ message: 'Session refreshed' });
}
