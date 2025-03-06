import userModel from "../models/userModel.js";

export const admin = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (user.role !== "ADMIN") {
      return res.status(400).json({
        msg: "Permisos denegados",
        error: true,
        success: false,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      msg: "Permisos denegados",
      error: true,
      success: false,
    });
  }
};
