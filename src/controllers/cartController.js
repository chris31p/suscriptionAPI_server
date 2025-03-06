import cartProductModel from "../models/cartProductModel.js";
import userModel from "../models/userModel.js";

export const addToCartItemController = async(req,res)=>{
    try {
        const  userId = req.userId
        const { productId } = req.body
        
        if(!productId){
            return res.status(402).json({
                msg : "Proporcionar el ID del producto",
                error : true,
                success : false
            })
        }

        const checkItemCart = await cartProductModel.findOne({
            userId : userId,
            productId : productId
        })

        if(checkItemCart){
            return res.status(400).json({
                msg : "Artículo ya en el carrito"
            })
        }

        const cartItem = new cartProductModel({
            quantity : 1,
            userId : userId,
            productId : productId
        })
        const save = await cartItem.save()

        const updateCartUser = await userModel.updateOne({ _id : userId},{
            $push : { 
                shopping_cart : productId
            }
        })

        return res.json({
            data : save,
            msg : "Artículo agregado exitosamente",
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

export const getCartItemController = async(req,res)=>{
    try {
        const userId = req.userId

        const cartItem =  await cartProductModel.find({
            userId : userId
        }).populate('productId')

        return res.json({
            data : cartItem,
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

export const updateCartItemQtyController = async(req,res)=>{
    try {
        const userId = req.userId 
        const { _id,qty } = req.body

        if(!_id ||  !qty){
            return res.status(400).json({
                msg : "Proporcionar el ID y la cantidad"
            })
        }

        const updateCartitem = await cartProductModel.updateOne({
            _id : _id,
            userId : userId
        },{
            quantity : qty
        })

        return res.json({
            msg : "Carrito actualizado",
            success : true,
            error : false, 
            data : updateCartitem
        })

    } catch (error) {
        return res.status(500).json({
            msg : error.message || error,
            error : true,
            success : false
        })
    }
}

export const deleteCartItemQtyController = async(req,res)=>{
    try {
      const userId = req.userId // middleware
      const { _id } = req.body 
      
      if(!_id){
        return res.status(400).json({
            msg : "Proporcionar el ID del producto",
            error : true,
            success : false
        })
      }

      const deleteCartItem  = await cartProductModel.deleteOne({_id : _id, userId : userId })

      return res.json({
        msg : "Artículo eliminado exitosamente",
        error : false,
        success : true,
        data : deleteCartItem
      })

    } catch (error) {
        return res.status(500).json({
            msg : error.message || error,
            error : true,
            success : false
        })
    }
}