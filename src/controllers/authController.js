import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';

export async function registerUser(req, res, next) {
  const { email, password } = req.body;
  console.log(email, password);
  if (await User.findOne({ email }))
    return next(createHttpError(400, 'Email in use'));
  // console.log(req.body);

  // Хешуємо пароль
  const encPass = await bcrypt.hash(password, 10);

  // Створюємо користувача
  const newUser = await User.create({
    email,
    password: encPass,
  });

  // Створюємо нову сесію
  const newUserSession = createSession(newUser._id);
  // Встановлюємо куки, передаємо об'єкт відповіді та сесію
  setSessionCookies(res, newUserSession);

  // Відправляємо дані користувача (без пароля) у відповіді
  res.status(201).json(newUser);
}
