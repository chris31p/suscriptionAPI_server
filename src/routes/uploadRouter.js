import {Router} from 'express';
import auth from '../middleware/auth.js';
import uploadImgController from '../controllers/uploadImgController.js';
import upload from '../middleware/multer.js'

const uploadRouter = Router()

uploadRouter.post('/upload', auth, upload.single('image') ,uploadImgController)

export default uploadRouter;