import { Router} from 'express';
import { addCategoryController, getCategoryController } from '../controllers/categoryController.js';
import auth from '../middleware/auth.js';

const categoryRouter = Router()

categoryRouter.post('/add-category', auth, addCategoryController);
categoryRouter.get('/get', getCategoryController)



export default categoryRouter;