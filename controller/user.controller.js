import User from "../model/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
dotenv.config();
const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, email, password) are required",
      errorCode: "MISSING_FIELDS",
      data: null,
    });
  }
  console.log(name, email, password);
  //check in database
  try {
    const existsUser = await User.findOne({ email });
    //user exists - condition statement
    if (existsUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
        errorCode: "USER_EXISTS",
        data: {
          name: existsUser.name,
          email: existsUser.email,
        },
      });
    }
    const user = await User.create({
      //create is used to make a new schema
      name,
      email,
      password,
    });

    //check condition whether user registered or not

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Failed to register user due to an internal error",
        errorCode: "REGISTRATION_FAILED",
        data: null,
      });
    }

    //create a token and send it through mail
    const tokenVeri = crypto.randomBytes(32).toString("hex");
    console.log("dev token checker :", tokenVeri);
    user.VerficationToken = tokenVeri;
    await user.save();
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const info = {
      from: process.env.NODEMAILER_SENDERMAIL, // sender address
      to: user.email, // list of receivers
      subject: `Verification Code`, // Subject line
      text: `Hello,\n\nYour verification link is:  http://localhost:${process.env.PORT}/api/v1/user/verify/${tokenVeri}\n\nThis  will expire in 10 minutes. If you did not request this code, please ignore this email.\n\nRegards,\nSupport Team`, // plain text body
      html: `<p>Hello,</p><p>This link will expire in 10 minutes. If you did not request this code, please ignore this email.</p><p>Regards,<br>Support Team</p>`,
    };

    await transporter.sendMail(info); // token send it to the user through mail
    res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email for verification.",
      data: {
        name: user.name,
        email: user.email,
        verificationSent: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred during registration",
      errorCode: "SERVER_ERROR",
      data: null,
      details: error.message,
    });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      message: "No token found",
      success: false,
    });
  }

  const user = await User.findOne({ VerficationToken: token });
  console.log("user", user);
  if (!user) {
    return res.status(400).json({
      message: "Invalid Token",
      success: false,
    });
  }
  user.isVerify = true;
  user.VerficationToken = undefined;
  await user.save();
  res.status(201).json({
    success: true,
    message: "user verified",
    data: {
      name: user.name,
      email: user.email,
      verify: user.isVerify,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, email, password) are required",
      errorCode: "MISSING_FIELDS",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found with the provided email",
      errorCode: "USER_NOT_FOUND",
      data: null,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("password checker:", password, user.password);
  console.log("isMatch", isMatch);
  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "The password you entered is incorrect",
      errorCode: "INVALID_PASSWORD",
      data: null,
    });
  }

  const jsToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JSON_SECRETKEY,
    {
      expiresIn: "24hr",
    }
  );
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
  res.cookie("token", jsToken, cookieOptions);
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      token: jsToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    console.log(user.name);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Profile successfully retrieved",
      success: true,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Interval server problem",
      success: false,
    });
  }
};
const logOutUser = async (req, res) => {
  res.cookie("token", "", {});
  try {
    res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server problem",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = Date.now() + 10 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiry = resetExpiry;
    await user.save();
    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: process.env.NODEMAILER_PORT,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const info = {
      from: process.env.NODEMAILER_SENDERMAIL, // sender address
      to: user.email, // list of receivers
      subject: `Reset password Code`, // Subject line
      text: `Hello,\n\nYour reset password link is:  http://localhost:${process.env.PORT}/api/v1/user/resetpassword/${resetToken}\n\nThis  will expire in 10 minutes. If you did not request this code, please ignore this email.\n\nRegards,\nSupport Team`, // plain text body
      html: `<p>Hello,</p><p>This link will expire in 10 minutes. If you did not request this code, please ignore this email.</p><p>Regards,<br>Support Team</p>`,
    };

    await transporter.sendMail(info);
    res.status(200).json({
      success: true,
      message: "forgot password successfully",
    });
  } catch (error) {}
};
const resetPassword = async (req, res) => {
  //get token from params
  const { token } = req.params;
  //get new password from body
  const { password } = req.body;
  console.log(`token : ${token} and password : ${password}`);

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();
    res.status(200).json({
      success: true,
      message: "password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server problem",
    });
  }
};

export {
  userRegister,
  verifyUser,
  login,
  getMe,
  logOutUser,
  forgotPassword,
  resetPassword,
};
