import jwt from "jsonwebtoken";

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log(token);
    if (!token) {
      return res.status(401).json({
        message: " Authentication Failed",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JSON_SECRETKEY);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("error :", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export { isLogin };
