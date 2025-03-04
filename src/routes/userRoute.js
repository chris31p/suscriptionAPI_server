import {Router} from 'express';
import { forgotPassword, loginUser, logoutUser, refreshToken, registerUser, resetPassword, updateUserDetails, uploadAvatar, userDetails, verifiedEmail, verifyForgotPassword } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/multer.js';

const userRouter = Router();

userRouter.post('/register', registerUser)
userRouter.post('/verify-email', verifiedEmail)
userRouter.post('/login', loginUser)
userRouter.get('/logout', auth , logoutUser)
userRouter.put('/upload-avatar', auth, upload.single('avatar'), uploadAvatar)
userRouter.put('/update-user', auth, updateUserDetails)
userRouter.put('/forgot-password', forgotPassword)
userRouter.put('/verify-forgot-pwd-otp', verifyForgotPassword)
userRouter.put('/reset-password', resetPassword)
userRouter.post('/refresh-token', refreshToken)
userRouter.get('/user-details', auth, userDetails)

export default userRouter;