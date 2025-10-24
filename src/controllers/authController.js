import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
  // 1. Знаходимо поточну сесію за id сесії та рефреш токеном
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  // 2. Якщо такої сесії нема, повертаємо помилку
  if (!session) return next(createHttpError(401, 'Session not found'));
  // if (new Date() > session.refreshTokenValidUntil)
  //   return (
  //     (await Session.findByIdAndDelete(session._id)) &&
  //     next(createHttpError(401, 'Session token expired'))
  //   );
  // Якщо термін дії рефреш токена вийшов, повертаємо помилку
  if (new Date() > session.refreshTokenValidUntil)
    return next(createHttpError(401, 'Session token expired'));
  // 4. Якщо всі перевірки пройшли добре, видаляємо поточну сесію
  await Session.findByIdAndDelete(session._id);
  // 5. Створюємо нову сесію та додаємо кукі
  setSessionCookies(res, await createSession(session.userId));

  res.status(200).json({ message: 'Session refreshed' });
}

export async function logoutUser(req, res) {
  // якщо є сесія видаляємо її з бази і кук
  if (req.cookies.sessionId) {
    await Session.findByIdAndDelete(req.cookies.sessionId);
    res.clearCookie('sessionId');
  } // видаляємо решту кук
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
}

export async function requestResetEmail(req, res, next) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return defRes(res);
  const token = jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  defRes(res);
}

function defRes(res) {
  res.status(200).json({ message: 'Password reset email sent successfully' });
}
