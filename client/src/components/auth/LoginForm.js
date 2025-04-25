import React, { useState, useCallback } from "react";
import { InputField, Loading } from "components";
import { apiLogin } from "api/user";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import path from "utils/path";
import { login } from "store/user/userSlice";
import { useDispatch } from "react-redux";
import { validate } from "utils/helpers";
import { Link } from "react-router-dom";
import { showModal } from "store/app/appSlice";
import icons from "utils/icons";

const { FaEye, FaEyeSlash } = icons;

const LoginForm = ({ switchToRegister, switchToForgotPassword }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [payload, setPayload] = useState({
        email: "",
        password: "",
    });
    const [invalidFields, setInvalidFields] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [searchParams] = useSearchParams();

    const handleSubmit = useCallback(async () => {
        const invalids = validate(payload, setInvalidFields);
        if (invalids === 0) {
            try {
                dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
                const result = await apiLogin(payload);
                dispatch(showModal({ isShowModal: false, modalChildren: null }))

                if (result && result.success) {
                    // Check if all required properties exist in the response
                    if (!result.accessToken) {
                        console.error('Missing accessToken in successful response');
                    }

                    if (!result.userData) {
                        console.error('Missing userData in successful response');
                    }

                    const userData = result.userData || {};

                    dispatch(
                        login({
                            isLoggedIn: true,
                            token: result.accessToken,
                            userData: userData,
                        })
                    );
                    searchParams.get('redirect') ? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`);
                } else {
                    // Kiểm tra xem có phải lỗi "tài khoản bị khóa" không
                    if (result?.mes?.includes("bị khóa")) {
                        Swal.fire({
                            html: `
                                <div class="flex flex-col items-center">
                                    <div class="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                                        <svg class="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-xl font-bold text-gray-800 mb-2">Tài khoản bị khóa</p>
                                        <p class="text-gray-600 mb-4">Tài khoản của bạn đã bị khóa vì vi phạm điều khoản dịch vụ hoặc lý do bảo mật.</p>
                                        <div class="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4 rounded">
                                            <p class="text-sm text-orange-700">Vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi để được giúp đỡ.</p>
                                            <p class="text-sm font-medium mt-2">Email: <a href="mailto:support@marseille.com" class="text-blue-600 hover:underline">support@marseille.com</a></p>
                                        </div>
                                    </div>
                                </div>`,
                            showConfirmButton: true,
                            confirmButtonText: "Đã hiểu",
                            customClass: {
                                popup: 'rounded-xl shadow-2xl border border-orange-200',
                                confirmButton: 'bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition-colors font-medium'
                            },
                            buttonsStyling: false,
                            backdrop: `rgba(0,0,0,0.4)`,
                            showCloseButton: true,
                        });
                    } else if (result?.mes?.includes("Mật khẩu không chính xác")) {
                        Swal.fire({
                            html: `
                                <div class="flex flex-col items-center">
                                    <div class="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                                        <svg class="w-9 h-9 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-lg font-semibold text-gray-800 mb-2">Mật khẩu không chính xác</p>
                                        <p class="text-gray-600 mb-4">Vui lòng kiểm tra lại mật khẩu của bạn.</p>
                                        <div class="bg-gray-50 border p-3 rounded-lg text-left mb-2">
                                            <p class="text-sm text-gray-600">
                                                <span class="font-medium">Gợi ý:</span> Bạn có thể:
                                            </p>
                                            <ul class="list-disc pl-5 text-sm text-gray-600 mt-1 space-y-1">
                                                <li>Kiểm tra phím Caps Lock</li>
                                                <li>Thử lại với cẩn thận</li>
                                                <li>Đặt lại mật khẩu nếu bạn không nhớ</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>`,
                            showConfirmButton: true,
                            showDenyButton: true,
                            confirmButtonText: "Thử lại",
                            denyButtonText: "Quên mật khẩu?",
                            customClass: {
                                popup: 'rounded-xl shadow-2xl border border-yellow-100',
                                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors font-medium mr-2',
                                denyButton: 'bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg transition-colors font-medium',
                                actions: 'space-x-2'
                            },
                            buttonsStyling: false,
                        }).then((result) => {
                            if (result.isDenied) {
                                switchToForgotPassword();
                            }
                        });
                    } else if (result?.mes?.includes("Email không tồn tại")) {
                        Swal.fire({
                            html: `
                                <div class="flex flex-col items-center">
                                    <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                                        <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-lg font-semibold text-gray-800 mb-2">Email không tồn tại</p>
                                        <p class="text-gray-600 mb-4">Email này chưa được đăng ký trong hệ thống của chúng tôi.</p>
                                        <div class="flex justify-center space-x-2">
                                            <button id="try-again" class="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition-colors text-sm font-medium">
                                                Thử lại
                                            </button>
                                            <button id="register-now" class="px-4 py-2 bg-green-500 rounded-lg text-white hover:bg-green-600 transition-colors text-sm font-medium">
                                                Đăng ký ngay
                                            </button>
                                        </div>
                                    </div>
                                </div>`,
                            showConfirmButton: false,
                            showCloseButton: true,
                            customClass: {
                                popup: 'rounded-xl shadow-2xl border border-blue-100',
                            },
                            didOpen: () => {
                                document.getElementById('try-again').addEventListener('click', () => {
                                    Swal.close();
                                });
                                document.getElementById('register-now').addEventListener('click', () => {
                                    Swal.close();
                                    switchToRegister();
                                });
                            }
                        });
                    } else {
                        Swal.fire({
                            html: `
                                <div class="flex flex-col items-center">
                                    <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <p class="text-lg font-semibold text-gray-800 mb-2">Đăng nhập thất bại</p>
                                        <p class="text-gray-600">${result?.mes || "Tài khoản hoặc mật khẩu không chính xác. Vui lòng thử lại."}</p>
                                    </div>
                                </div>`,
                            showConfirmButton: true,
                            confirmButtonText: "Thử lại",
                            customClass: {
                                popup: 'rounded-xl shadow-2xl border border-red-100',
                                confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium'
                            },
                            buttonsStyling: false,
                            backdrop: `rgba(0,0,0,0.4)`,
                            showCloseButton: true,
                            focusConfirm: false,
                            timer: 5000,
                            timerProgressBar: true
                        });
                    }
                }
            } catch (error) {
                console.error('Login error details:', error);
                dispatch(showModal({ isShowModal: false, modalChildren: null }));
                Swal.fire({
                    title: "Lỗi kết nối",
                    html: `
                    <div class="flex flex-col items-center">
                        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div class="text-center">
                            <p class="text-lg font-semibold text-gray-800 mb-2">${error?.mes || "Lỗi kết nối"}</p>
                            <p class="text-gray-600">${error?.details || "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối internet và thử lại."}</p>
                        </div>
                    </div>`,
                    showConfirmButton: true,
                    confirmButtonText: "Đã hiểu",
                    customClass: {
                        popup: 'rounded-xl shadow-2xl border border-red-100',
                        confirmButton: 'bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium'
                    },
                    buttonsStyling: false,
                    backdrop: `rgba(0,0,0,0.4)`,
                    showCloseButton: true,
                    animation: true,
                    heightAuto: false
                });
            }
        }
    }, [payload, dispatch, navigate, searchParams]);

    return (
        <div className="w-full">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Chào mừng đến với cửa hàng của chúng tôi
            </h1>
            <p className="text-gray-600 text-center mb-8">
                Đăng nhập để truy cập tài khoản và bảng điều khiển
            </p>

            <InputField
                value={payload.email}
                setValue={setPayload}
                nameKey="email"
                invalidFields={invalidFields}
                setInvalidFields={setInvalidFields}
                styleClass="border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                placeholder="Email"
            />
            <div className="relative w-full">
                <InputField
                    value={payload.password}
                    setValue={setPayload}
                    nameKey="password"
                    type={showPassword ? "text" : "password"}
                    invalidFields={invalidFields}
                    setInvalidFields={setInvalidFields}
                    styleClass="border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    placeholder="Mật khẩu"
                />
                <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-red-600 to-indigo-700 hover:from-red-700 hover:to-indigo-800 text-white font-semibold py-3 px-4 rounded-lg mt-6 transition-all duration-300 shadow-md transform hover:-translate-y-1"
            >
                Đăng nhập
            </button>

            <div className="flex items-center justify-between mt-4 w-full text-sm">
                <button
                    className="text-red-600 hover:text-red-800 hover:underline transition-colors"
                    onClick={switchToRegister}
                >
                    Tạo tài khoản
                </button>
                <button
                    onClick={switchToForgotPassword}
                    className="text-red-600 hover:text-red-800 hover:underline transition-colors"
                >
                    Quên mật khẩu?
                </button>
            </div>

            <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="mx-4 text-sm text-gray-500">OR</span>
                <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            <div className="text-center mt-8">
                <Link
                    className="text-red-600 font-medium hover:text-red-800 hover:underline transition-colors inline-block"
                    to={`/${path.HOME}`}
                >
                    Cửa hàng của chúng tôi
                </Link>
            </div>
        </div>
    );
};

export default LoginForm; 