import SubCategoryModel from "../models/subCategoryModel.js"

export const addSubCategoryController = async(req,res)=>{
    try {
        const { name, image, category } = req.body 

        if(!name && !image && !category[0] ){
            return res.status(400).json({
                msg : "Proveer nombre, imagen y categoria",
                error : true,
                success : false
            })
        }

        const payload = {
            name,
            image,
            category
        }

        const createSubCategory = new SubCategoryModel(payload)
        const save = await createSubCategory.save()

        return res.json({
            msg : "Subcategoría creada con éxito",
            data : save,
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            msg : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getSubCategoryController = async(req,res)=>{
    try {
        const data = await SubCategoryModel.find().sort({createdAt : -1}).populate('category')
        return res.json({
            msg : "Datos de Subcategorías",
            data : data,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            msg : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateSubCategoryController = async(req,res)=>{
    try {
        const { _id, name, image,category } = req.body 

        const checkSub = await SubCategoryModel.findById(_id)

        if(!checkSub){
            return res.status(400).json({
                msg : "Verifica el id",
                error : true,
                success : false
            })
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
            name,
            image,
            category
        })

        return res.json({
            msg : 'Subcategoría actualizada exitosamente',
            data : updateSubCategory,
            error : false,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            msg : error.message || error,
            error : true,
            success : false 
        })
    }
}

export const deleteSubCategoryController = async(req,res)=>{
    try {
        const { _id } = req.body 
        console.log("Id",_id)
        const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

        return res.json({
            msg : "Subcategoría eliminada con éxito",
            data : deleteSub,
            error : false,
            success : true
        })
    } catch (error) {
        return res.status(500).json({
            msg : error.message || error,
            error : true,
            success : false
        })
    }
}