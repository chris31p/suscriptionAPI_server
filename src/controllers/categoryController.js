import CategoryModel from "../models/categoryModel.js";

export const addCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        msg: "Ingrese los campos requeridos",
        error: true,
        success: false,
      });
    }

    const addCategory = new CategoryModel({
      name,
      image,
    });

    const saveCategory = await addCategory.save();

    if (!saveCategory) {
      return res.status(500).json({
        msg: "No se pudo crear",
        error: true,
        success: false,
      });
    }

    return res.status(201).json({
      msg: "Categoría agregada con éxito",
      data: saveCategory,
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

export const getCategoryController = async (req, res) => {
  try {
    const data = await CategoryModel.find();

    return res.status(200).json({
      data: data,
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

export const updateCategoryController = async (req, res) => {
  try {
    const { _id, name, image } = req.body;

    const update = await CategoryModel.updateOne(
      {
        _id: _id,
      },
      {
        name,
        image,
      }
    );

    return res.json({
      msg: "Actualizado con éxito",
      data: update,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};
