import createHttpError from 'http-errors';

export async function updateUserAvatar(req, res, next) {
  if (!req.file) return next(createHttpError(400, 'No file'));

  res.status(200).json({ url: 'gay' });
}
