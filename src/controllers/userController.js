import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import generatedOtp from "../utils/generatedOtp.js";
import forgotPwdTemplate from "../utils/forgotPwdTemplate.js";
import jwt from 'jsonwebtoken';

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "Proveer name, email y password",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(201).json({
        msg: "Email ya registrado",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new UserModel(payload);
    const save = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verificando email de Chris",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });

    return res.status(201).json({
      msg: "Usuario registrado exitosamente",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function verifiedEmail(req, res) {
  try {
    const { code } = req.body;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({
        msg: "Código inválido",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return res.json({
      msg: "Email verificado exitosamente",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message,
      error: true,
      success: true,
    });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Credenciales inválidas, ingrese email y password",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Usuario no registrado",
        error: true,
        success: false,
      });
    }

    if (user.status !== "Active") {
      return res.status(400).json({
        msg: "Contactar con el administrador",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        msg: "Verifica tu contraseña",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await generatedRefreshToken(user._id);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.json({
      msg: "Login exitoso",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function logoutUser(req, res) {
  try {
    const userid = req.userId; //Middleware

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await UserModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return res.json({
      msg: "Logout exitoso",
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
}

export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const image = req.file; // multer middleware

    const upload = await uploadImageCloudinary(image);
    const updateUser = await UserModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });

    return res.json({
      msg: "Cargado el avatar al perfil",
      data: {
        _id: userId,
        avatar: upload.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId; //auth middleware
    const { name, email, phone, password } = req.body;

    let hashPassword = "";
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }
    const updateUser = await UserModel.updateOne({_id: userId}, {
      ...(name && { name: name }),
      ...(email && { email: email }),
      ...(phone && { phone: phone }),
      ...(password && { password: hashPassword }),
    });

    return res.json({
      msg: "Usuario actualizado exitosamente",
      error: false,
      success: true,
      data: updateUser,
    });
  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}
//Olvidar la contraseña sin loguearse
export async function forgotPassword(req, res) {
  try {
    const {email} = req.body;

    const user = await UserModel.findOne({email})

    if(!user){
      return res.status(400).json({
        msg: "Email incorrecto",
        error: true,
        success: false
      })
    }

    const otp = generatedOtp()
    const expireTime = new Date() + 60 * 60 * 1000 //1hr

    const update = await UserModel.findByIdAndUpdate(user._id,{
      forgot_password_opt: otp,
      forgot_password_expiry: new Date(expireTime).toISOString()
    })

    await sendEmail({
      sendTo: email,
      subject: "Contraseña olvidada de frontApp",
      html: forgotPwdTemplate({
        name: user.name,
        otp: otp
      })
    })

    return res.json({
      msg: "Se envió un email, revisa tu bandeja de entrada",
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

export async function verifyForgotPassword(req, res) {
  try {
    const {email, otp} = req.body;

    if(!email || !otp){
      return res.status(400).json({
        msg: "Se requiere los campos email, otp",
        error: true,
        success: false
      })
    }

    const user = await UserModel.findOne({email})

    if(!user){
      return res.status(400).json({
        msg: "Email incorrecto",
        error: true,
        success: false
      })
    }

    const currentTime = new Date().toISOString();
    if(user.forgot_password_expiry < currentTime){
      return res.status(400).json({
        msg: "OTP expiró",
        error: true,
        success: false
      })
    }

    if(otp !== user.forgot_password_opt){
      return res.status(400).json({
        msg: "OTP inválido",
        error: true,
        success: false
      })
    }

    return res.json({
      msg: "OTP verificado exitosamente",
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

export async function resetPassword(req, res) {
  try {
    const {email, newPassword, confirmPassword} = req.body;

    if(!email || !newPassword || !confirmPassword){
      return res.status(400).json({
        msg: "Campos requeridos email, newPassword, confirmPassword"
      })
    }

    const user = await UserModel.findOne({email})

    if(!user){
      return res.status(400).json({
        msg: "Email inválido o no disponible",
        error: true,
        success: false
      })
    }

    if(newPassword !== confirmPassword){
      return res.status(400).json({
        msg: "newPassword y confirmPassword no coinciden",
        error: true,
        success: false
      })
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    const update = await UserModel.findOneAndUpdate(user._id,{
      password: hashPassword
    })

    return res.json({
      msg: "Contraseña actualizada correctamente",
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

export async function refreshToken(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken || req?.header?.authorization?.split(" ")[1]

    if(!refreshToken){
      return res.status(401).json({
        msg: "Token inválido",
        error: true,
        success: false
      })
    }

    const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

    if(!verifyToken){
      return res.status(401).json({
        msg: "Token expiró",
        error: true,
        success: false
      })
    }

    const userId = verifyToken?._id

    const newAccessToken = await generatedAccessToken(userId)

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie('accessToken', newAccessToken, cookiesOption )
    return res.json({
      msg: "Nuevo token generado",
      error: false,
      success: true,
      data: {
        accessToken: newAccessToken
      }
    })



  } catch (error) {
    return res.status(500).json({
      msg: error.message || error,
      error: true,
      success: false,
    });
  }
}
