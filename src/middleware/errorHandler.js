// Middleware для обробки помилок
import { HttpError } from 'http-errors';
// app.use(
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  // Якщо помилка створена через http-errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message || err.name,
    });
  }
  const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
};
// });
