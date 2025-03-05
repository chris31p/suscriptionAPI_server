import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";

const uploadImgController = async(req, res)=>{
    try {
        const file = req.file
        const uploadImage = await uploadImageCloudinary(file)

        return res.json({
            msg: "Imagen cargada",
            data: uploadImage,
            error: false,
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            msg: error.message || error,
            error: true,
            success: false,
          });
    }

}

export default uploadImgController;