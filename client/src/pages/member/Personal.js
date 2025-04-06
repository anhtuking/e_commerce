import { InputForm, Loading } from "components";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import avatar from "assets/avatar_default.png";
import { toast } from "react-toastify";
import { apiUpdateCurrent } from "api/user";
import { getCurrent } from "store/user/asyncAction";
import { showModal } from "store/app/appSlice";
import { FiUser, FiMail, FiPhone, FiCalendar, FiShield, FiEdit } from "react-icons/fi";
import { MdOutlineVerified } from "react-icons/md";
import { IoMdCloudUpload } from "react-icons/io";
import withBase from "hocs/withBase";

const Personal = ({dispatch}) => {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
    watch,
  } = useForm();

  const { current } = useSelector((state) => state.user);

  useEffect(() => {
    reset({
      firstname: current?.firstname,
      lastname: current?.lastname,
      email: current?.email,
      mobile: current?.mobile,
      avatar: current?.avatar,
    });
    setAvatarPreview(current?.avatar);
  }, [current, reset]);

  const avatarFile = watch("avatar");

  useEffect(() => {
    let objectUrl = null;

    if (avatarFile && avatarFile.length > 0 && avatarFile[0] instanceof File) {
      const file = avatarFile[0];
      objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
    }

    // Cleanup function
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [avatarFile]);

  const handleUpdateInfor = async (data) => {
    const formData = new FormData();
    if (data.avatar && data.avatar.length > 0) formData.append("avatar", data.avatar[0]);
    delete data.avatar;
    for (let i of Object.entries(data)) {
      formData.append(i[0], i[1]);
    }
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiUpdateCurrent(formData);
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    if (response.success) {
      dispatch(getCurrent());
      toast.success(response.mes);
    } else {
      toast.error(response.mes);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="pl-4 mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Thông tin tài khoản
              </span>
            </h1>
            <p className="text-gray-600">
              Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white w-[1535px] rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Left Column - Avatar and Status */}
            <div className="p-8 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200">
              <div className="flex flex-col items-center">
                <div className="relative group mb-6">
                  <div className="rounded-full p-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    <div className="overflow-hidden rounded-full bg-white p-0.5 h-40 w-40">
                      <img
                        src={avatarPreview || current?.avatar || avatar}
                        alt="User avatar"
                        className="w-full h-full object-cover rounded-full transition-all duration-300 group-hover:opacity-80"
                      />
                    </div>
                  </div>

                  <label
                    htmlFor="avatarUpload"
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300 rounded-full bg-black bg-opacity-40"
                  >
                    <div className="flex flex-col items-center text-white">
                      <IoMdCloudUpload className="text-3xl mb-1" />
                      <span className="text-sm font-medium">Tải ảnh lên</span>
                    </div>
                    <input
                      type="file"
                      id="avatarUpload"
                      className="hidden"
                      {...register("avatar")}
                      accept="image/*"
                    />
                  </label>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {current?.firstname} {current?.lastname}
                </h2>
                <p className="text-gray-500 mb-4">{current?.email}</p>

                <div className="w-full space-y-3">
                  <div className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full mr-3 ${+current?.isBlocked ? "bg-red-500" : "bg-green-500"}`}></div>
                    <span className="font-medium text-gray-700">
                      Trạng thái: {+current?.isBlocked ? "Khóa" : "Hoạt động"}
                    </span>
                  </div>

                  <div className="flex items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                    <FiShield className="text-indigo-500 mr-3" />
                    <span className="font-medium text-gray-700">
                      Vai trò: {+current?.role === 2010 ? "Quản trị viên" : "Người dùng"}
                    </span>
                  </div>

                  <div className="flex items-center p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg">
                    <FiCalendar className="text-amber-500 mr-3" />
                    <span className="font-medium text-gray-700">
                      Ngày tạo : {moment(current?.createdAt).format('MMMM D, YYYY')}
                    </span>
                  </div>

                  <div className="flex items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg">
                    <FiCalendar className="text-emerald-500 mr-3" />
                    <span className="font-medium text-gray-700">
                      Đã tham gia: {moment(current?.createdAt).fromNow(true)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="md:col-span-2 p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FiEdit className="mr-2 text-red-500" />
                Chỉnh sửa thông tin cá nhân
              </h3>

              <form onSubmit={handleSubmit(handleUpdateInfor)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <label className="flex items-center text-gray-700 font-medium mb-2">
                      <FiUser className="mr-2 text-red-500" /> Họ
                    </label>
                    <div className="relative">
                      <InputForm
                        register={register}
                        errors={errors}
                        id="firstname"
                        placeholder="Nhập họ của bạn"
                        validate={{
                          required: "Họ là bắt buộc",
                        }}
                        fullWidth
                        styles="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-3"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label className="flex items-center text-gray-700 font-medium mb-2">
                      <FiUser className="mr-2 text-red-500" /> Tên
                    </label>
                    <div className="relative">
                      <InputForm
                        register={register}
                        errors={errors}
                        id="lastname"
                        placeholder="Nhập tên của bạn"
                        validate={{
                          required: "Tên là bắt buộc",
                        }}
                        fullWidth
                        styles="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-3"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="flex items-center text-gray-700 font-medium mb-2">
                      <FiMail className="mr-2 text-red-500" /> Email
                    </label>
                    <div className="relative">
                      <InputForm
                        register={register}
                        errors={errors}
                        id="email"
                        placeholder="Nhập email của bạn"
                        validate={{
                          required: "Email là bắt buộc",
                          pattern: {
                            value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                            message: 'Vui lòng nhập email hợp lệ'
                          }
                        }}
                        fullWidth
                        styles="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-3"
                      />
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="flex items-center text-gray-700 font-medium mb-2">
                      <FiPhone className="mr-2 text-red-500" /> Số điện thoại
                    </label>
                    <div className="relative">
                      <InputForm
                        register={register}
                        errors={errors}
                        id="mobile"
                        placeholder="Nhập số điện thoại của bạn"
                        validate={{
                          required: "Số điện thoại là bắt buộc",
                          pattern: {
                            value: /^(\+\d{1,3}[-\s]?)?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})$/,
                            message: 'Vui lòng nhập số điện thoại hợp lệ'
                          }
                        }}
                        fullWidth
                        styles="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-3"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-4">
                    Bằng cách cập nhật thông tin cá nhân của bạn, bạn đồng ý với <a href="#" className="text-red-500 hover:underline">Điều khoản dịch vụ</a> và thừa nhận <a href="#" className="text-red-500 hover:underline">Chính sách bảo mật</a>.
                  </p>

                  {isDirty && (
                    <button
                      type="submit"
                      className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <MdOutlineVerified className="text-lg" />
                      Lưu
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(Personal);