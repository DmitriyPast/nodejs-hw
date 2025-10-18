import { celebrate } from 'celebrate';
import { Router } from 'express';
import { authSchema } from '../validations/authValidation.js';
import {
  loginUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';

const router = Router();

router.post('/auth/register', celebrate(authSchema), registerUser);
router.post('/auth/login', celebrate(authSchema), loginUser);
router.post('/auth/refresh', refreshUserSession);

export default router;
// (req, res) => {
//   return res.status(200).json('ligma balls').send();
// }
