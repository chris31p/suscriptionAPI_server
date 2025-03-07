import addressModel from "../models/addressModel.js";
import userModel from "../models/userModel.js";

export const addAddressController = async (req, res) => {
  try {
    const userId = req.userId; // middleware
    const { address_line, city, state, country, phone } = req.body;

    const createAddress = new addressModel({
      address_line,
      city,
      state,
      country,
      phone,
      userId: userId,
    });
    const saveAddress = await createAddress.save();

    const addUserAddressId = await userModel.findByIdAndUpdate(userId, {
      $push: {
        address_details: saveAddress._id,
      },
    });

    return res.json({
      msg: "Dirección creada exitosamente",
      error: false,
      success: true,
      data: saveAddress,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getAddressController = async (req, res) => {
  try {
    const userId = req.userId; // middleware auth

    const data = await addressModel
      .find({ userId: userId })
      .sort({ createdAt: -1 });

    return res.json({
      data: data,
      msg: "Listado de direcciones",
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

export const updateAddressController = async (req, res) => {
  try {
    const userId = req.userId; // middleware auth
    const { _id, address_line, city, state, country, phone } = req.body;

    const updateAddress = await addressModel.updateOne(
      { _id: _id, userId: userId },
      {
        address_line,
        city,
        state,
        country,
        phone,
      }
    );

    return res.json({
      msg: "Dirección actualizada exitosamente",
      error: false,
      success: true,
      data: updateAddress,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteAddresscontroller = async (req, res) => {
  try {
    const userId = req.userId; // auth middleware
    const { _id } = req.body;

    const disableAddress = await addressModel.updateOne(
      { _id: _id, userId },
      {
        status: false,
      }
    );

    return res.json({
      msg: "Dirección eliminada exitosamente",
      error: false,
      success: true,
      data: disableAddress,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
};
