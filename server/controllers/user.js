const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwToken");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const crypto = require("crypto");
const makeToken = require("uniqid");
const { response } = require("express");

// const register = asyncHandler(async (req, res) => {
//   const { email, password, firstname, lastname } = req.body;
//   if (!email || !password || !firstname || !lastname)
//     return res.status(400).json({
//       success: false,
//       mes: "Missing inputs",
//     });

//   const user = await User.findOne({ email });
//   if (user) throw new Error("User has existed!");
//   else {
//     const newUser = await User.create(req.body);
//     return res.status(200).json({
//       success: newUser ? true : false,
//       mes: newUser
//         ? "Register is successfully. Login now!"
//         : "Something went wrong",
//     });
//   }
// });

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  if (!email || !password || !lastname || !firstname || !mobile) {
    return res.status(400).json({
      success: false,
      mes: "Missing inputs",
    });
  }

  const user = await User.findOne({ email });
  if (user) throw new Error("User has existed");
  else {
    const token = makeToken();
    const emailEdited = btoa(email) + '@' + token
    const newUser = await User.create({
      email: emailEdited, password, firstname, lastname, mobile
    })
    if (newUser){
      const html = `<h2>Register code: </h2><br/><blockquote>${ token }</blockquote>`;
      await sendMail({
      email,
      html,
      subject:
        "Thank you for registering in Marseille. Please continue to the next step to complete your registration!",
    });
    }
    setTimeout(async() => {
      await User.deleteOne({email: emailEdited})
    }, [900000])
    return res.json({
      success: newUser ? true : false,
      mes: newUser ? "Please check your email to activate account" : 'Something went wrong! Please try again later',
    });
  }
});

const finalRegister = asyncHandler(async (req, res) => {
  // const cookie = req.cookies;
  const { token } = req.params;
  const notActiveEmail = await User.findOne({email: new RegExp(`${token}$`)})
  if(notActiveEmail){
    notActiveEmail.email = atob(notActiveEmail?.email.split('@')[0])
    notActiveEmail.save()
  }
  return res.json({
    success: notActiveEmail ? true : false,
    response: notActiveEmail ? 'Register is successfully. Login now!' : 'Something went wrong! Please try again later.',
  });
});

const login = asyncHandler(async (req, res) => {
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
    const { password, role, refreshToken, ...userData } = response.toObject(); // dùng toán tử destructuring kết hợp với rest parameter.
    const accessToken = generateAccessToken(response._id, role); // tạo access token => xác thực user và phân quyền user
    const newRefreshToken = generateRefreshToken(response._id); // tạo refresh token => cấp mới lại access token
    // lưu refresh token vào database
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: newRefreshToken },
      { new: true }
    );
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

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = new ObjectId(req.user); // Lấy id từ req.user
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: user ? true : false,
    result: user ? user : "User not found!",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
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
  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
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

const logout = asyncHandler(async (req, res) => {
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
    mes: "Logout is complete.",
  });
});

// Reset password
// Client gửi mail
// Server check mail có hợp lệ hay không => Resent mail + link (password change token)
// Client check lại mail => click link
// Client gửi api kèm theo token
// Server check token xem có khớp với token mà server đã gửi trước đó không
// Change password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found!");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  // Điều kiện để gửi được mail là phải có gmail được bảo mật 2 lớp = phone
  // Sử dụng App Password
  const html = `Please click the link below to change your password. This link will expire in 15 minutes. 
  <a href = ${process.env.CLIENT_URL}/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
    subject: "Forgot password",
  };
  const result = await sendMail(data);
  return res.status(200).json({
    success: result.response?.includes("OK") ? true : false,
    mes: result.response?.includes("OK")
      ? "Check your email now!"
      : "Error! Please try again later.",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();

  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated new password!" : "Something went wrong!",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -role");
  return res.status(200).json({
    success: response ? true : false,
    users: response,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing value");
  const response = await User.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    deleteUser: response
      ? `User with email ${response.email} deleted`
      : `No user delete.`,
  });
});

const updateUser = asyncHandler(async (req, res) => {
  // console.log(req.user);
  const { id } = req.user;
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing value");
  const response = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong!",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  // console.log(req.user);
  const { uid } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing value");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { id } = req.user;
  if (!req.body.address) throw new Error("Missing value");
  const response = await User.findByIdAndUpdate(
    id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    updatedUser: response ? response : "Some thing went wrong",
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color) throw new Error("Missing value");
  const user = await User.findById(id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Some thing went wrong",
      });
    } else {
      const response = await User.findByIdAndUpdate(
        id,
        { $push: { cart: { product: pid, quantity, color } } },
        { new: true }
      );
      return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : "Some thing went wrong",
      });
    }
  } else {
    const response = await User.findByIdAndUpdate(
      id,
      { $push: { cart: { product: pid, quantity, color } } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      updatedUser: response ? response : "Some thing went wrong",
    });
  }
});

module.exports = {
  register,
  finalRegister,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
};
