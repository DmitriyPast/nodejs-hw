import createHttpError from 'http-errors';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { User } from '../models/user.js';

export async function updateUserAvatar(req, res, next) {
  if (!req.file) return next(createHttpError(400, 'No file'));

  const { secure_url } = await saveFileToCloudinary(req.file.buffer);

  await User.updateOne({ _id: req.user._id }, { avatar: secure_url });

  res.status(200).json({ url: secure_url });
}
