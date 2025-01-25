const jwt = require("jsonwebtoken");
const asynHandler = require("express-async-handler");

const verifyAccessToken = asynHandler((req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    // Bearer + chuỗi token
    const token = req.headers.authorization.split(" ")[1]; // headers: { authorization: Bearer + chuỗi token }
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) return res.status(401).json({
          success: false,
          mes: "Invalid Access token",
        });
      // console.log("Decoded token:", decode);
      req.user = decode;
      next();
    });
  } else {
    return res.status(401).json({
      success: false,
      mes: "Require authentication !",
    });
  }
});

module.exports = {
  verifyAccessToken
};
