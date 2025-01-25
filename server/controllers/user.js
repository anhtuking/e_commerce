const User = require("../models/user");
const asynHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwToken");
const register = asynHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !firstname || !lastname)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });

  const user = await User.findOne({ email });
  if (user) throw new Error("User has existed!");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      mes: newUser
        ? "Register is successfully. Login now!"
        : "Something went wrong",
    });
  }
});

const login = asynHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  // plain object
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    // tách password và role ra khỏi response
    const { password, role, ...userData } = response.toObject(); // dùng toán tử destructuring kết hợp với rest parameter.
    const accessToken = generateAccessToken(response._id, role); // tạo access token => xác thực user và phân quyền user
    const refreshToken = generateRefreshToken(response._id); // tạo refresh token => cấp mới lại access token
    // lưu refresh token vào database
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
    // lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // chỉ cho phép đầu http truy cập vào
      maxAge: 7 * 24 * 60 * 60 * 1000, // time hết hạn của refresh tokentoken
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials"); //login fail
  }
});

const getCurrent = asynHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select('-refreshToken -password -role');
  return res.status(200).json({
    success: false,
    result: user ? user : "User not found!",
  });
});

module.exports = {
  register,
  login,
  getCurrent,
};
