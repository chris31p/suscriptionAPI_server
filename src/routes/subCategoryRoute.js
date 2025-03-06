import { Router } from "express";
import auth from "../middleware/auth.js";
import { addSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from "../controllers/subCategoryController.js";

const subCategoryRouter = Router()

subCategoryRouter.post('/create',auth,addSubCategoryController)
subCategoryRouter.post('/get',getSubCategoryController)
subCategoryRouter.put('/update',auth,updateSubCategoryController)
subCategoryRouter.delete('/delete',auth,deleteSubCategoryController)

export default subCategoryRouter