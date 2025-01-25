const User = require("../models/user");
const asynHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwToken");
const jwt = require("jsonwebtoken");

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
      maxAge: 7 * 24 * 60 * 60 * 1000, // time hết hạn của refresh token
    });
    return res.status(200).json({
      success: true,
      accessToken,
      // refreshToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials"); //login fail
  }
  
});


const getCurrent = asynHandler(async (req, res) => {
  const { _id } = new ObjectId(req.user); // Lấy id từ req.user
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    result: user ? user : "User not found!",
  });
});

const refreshAccessToken = asynHandler(async (req, res) => {
  // lấy token từ cookie
  const cookie = req.cookies;
  // check xem token có tồn tại không
  if (!cookie || !cookie.refreshToken) {
    return res.status(400).json({
      success: false,
      mes: "No refresh token in cookies",
    });
  }
  // check xem token có hợp lệ không
  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET)
  // check xem token có khớp với token dã lưu trong db
  const response = await User.findOne({
    _id: result.id, 
    refreshToken: cookie.refreshToken,
  });
  if (!response) {
    return res.status(404).json({
      success: false,
      mes: "Refresh token not matched!",
    });
  }
  // Tạo access token mới
  const newAccessToken = generateAccessToken(response._id, response.role);
  // trả về kết quả dựa vào response
  return res.status(200).json({
    success: true,
    newAccessToken,
  });
});

const logout = asynHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  // xóa refresh token ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  // xóa refresh token ở cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: 'Logout is complete.'
  })
});

module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
};
