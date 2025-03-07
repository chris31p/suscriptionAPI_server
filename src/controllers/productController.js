import productModel from "../models/productoModel.js";
import mongoose from "mongoose";
const { isValidObjectId } = mongoose;

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    if (
      !name ||
      !image[0] ||
      !category[0] ||
      !subCategory[0] ||
      !unit ||
      !price ||
      !description
    ) {
      return res.status(400).json({
        msg: "Todos los campos son requeridos",
        error: true,
        success: false,
      });
    }

    const product = new productModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });
    const saveProduct = await product.save();

    return res.json({
      msg: "Producto creado exitosamente ",
      data: saveProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    let { page, limit, search } = req.body;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 5;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      productModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      productModel.countDocuments(query),
    ]);

    return res.json({
      msg: "Datos del producto",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        msg: "Proporcionar el id de la categoría",
        error: true,
        success: false,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID inválido", error: true });
    }

    const product = await productModel.find({ category: id }).limit(15);

    return res.status(200).json({
      msg: "Lista de productos por categoría",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    let { categoryId, subCategoryId } = req.body;

    // Validamos los ObjectId
    if (!isValidObjectId(categoryId)) {
      return res
        .status(400)
        .json({ msg: "categoryId inválido", error: true, success: false });
    }
    if (!isValidObjectId(subCategoryId)) {
      return res
        .status(400)
        .json({ msg: "subCategoryId inválido", error: true, success: false });
    }

    // Convertimos los IDs en ObjectId
    categoryId = new mongoose.Types.ObjectId(categoryId);
    subCategoryId = new mongoose.Types.ObjectId(subCategoryId);

    const productos = await productModel.find({
      category: categoryId,
      subCategory: subCategoryId,
    });
    res.json({ success: true, productos });
  } catch (error) {
    res.status(500).json({ msg: error.message, error: true, success: false });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;

    // Verificamos si el ID es válido
    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        msg: "ID de producto inválido",
        data: null,
        error: true,
        success: false,
      });
    }

    const product = await productModel.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({
        msg: "Producto no encontrado",
        data: null,
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      msg: "Detalles del producto",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateProductDetails = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        msg: "Proporcionar el ID del producto",
        error: true,
        success: false,
      });
    }

    const updateProduct = await productModel.updateOne(
      { _id: _id },
      {
        ...req.body,
      }
    );

    return res.status(200).json({
      msg: "Producto actualizado exitosamente",
      data: updateProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteProductDetails = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({
        msg: "Proporcionar el ID del producto",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await productModel.deleteOne({ _id: _id });

    return res.status(200).json({
      msg: "Producto eliminado exitosamente",
      error: false,
      success: true,
      data: deleteProduct,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const searchProduct = async (req, res) => {
  try {
    let { search, page, limit } = req.body;

    if (!page) {
      page = 1;
    }
    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      productModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      productModel.countDocuments(query),
    ]);

    return res.status(200).json({
      msg: "Datos del producto",
      error: false,
      success: true,
      data: data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page: page,
      limit: limit,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};
