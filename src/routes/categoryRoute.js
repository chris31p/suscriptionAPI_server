import { Router} from 'express';
import { addCategoryController, getCategoryController, updateCategoryController } from '../controllers/categoryController.js';
import auth from '../middleware/auth.js';

const categoryRouter = Router()

categoryRouter.post('/add-category', auth, addCategoryController);
categoryRouter.get('/get', getCategoryController)
categoryRouter.put('/update', auth, updateCategoryController)


export default categoryRouter;