import React from "react";
import { FaUser, FaLocationDot } from "react-icons/fa6";
import { InputForm } from "components";

const ShippingInfo = ({ paymentInfo, handleChange, formErrors }) => {
  // Create adapter for InputForm to work with our handleChange and formErrors
  const register = (name) => ({
    onChange: handleChange,
    name: name,
    value: paymentInfo[name] || ''
  });

  const errors = formErrors ? 
    Object.entries(formErrors).reduce((acc, [key, value]) => {
      if (value) acc[key] = { message: value };
      return acc;
    }, {}) : {};

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FaUser className="text-red-500" />
        Thông tin giao hàng
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InputForm
            label="Họ"
            id="firstname"
            register={register}
            errors={errors}
            placeholder="Nhập họ"
            defaultValue={paymentInfo.firstname}
            fullWidth
          />
          <InputForm
            label="Tên"
            id="lastname"
            register={register}
            errors={errors}
            placeholder="Nhập tên"
            defaultValue={paymentInfo.lastname}
            fullWidth
          />
        </div>

        <InputForm
          label="Email"
          id="email"
          type="email"
          register={register}
          errors={errors}
          placeholder="Nhập email"
          defaultValue={paymentInfo.email}
          fullWidth
        />

        <InputForm
          label="Số điện thoại"
          id="phone"
          type="tel"
          register={register}
          errors={errors}
          placeholder="Nhập số điện thoại"
          defaultValue={paymentInfo.phone}
          fullWidth
        />

        <div className="border-t border-gray-200 pt-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaLocationDot className="text-red-500" />
            Địa chỉ giao hàng
          </h2>
          <InputForm
            label="Địa chỉ chi tiết"
            id="address"
            register={register}
            errors={errors}
            placeholder="Nhập địa chỉ chi tiết"
            defaultValue={paymentInfo.address}
            fullWidth
          />

          <div className="grid grid-cols-3 gap-4 mt-4">
            <InputForm
              label="Tỉnh/Thành phố"
              id="city"
              register={register}
              errors={errors}
              placeholder="Nhập tỉnh/thành phố"
              defaultValue={paymentInfo.city}
              fullWidth
            />

            <InputForm
              label="Quận/Huyện"
              id="district"
              register={register}
              errors={errors}
              placeholder="Nhập quận/huyện"
              defaultValue={paymentInfo.district}
              fullWidth
            />

            <InputForm
              label="Phường/Xã"
              id="ward"
              register={register}
              errors={errors}
              placeholder="Nhập phường/xã"
              defaultValue={paymentInfo.ward}
              fullWidth
            />
          </div>

          <div className="mt-4">
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="note">Ghi chú:</label>
              <textarea
                id="note"
                name="note"
                rows="3"
                value={paymentInfo.note || ''}
                onChange={handleChange}
                className="form-input my-auto w-full rounded-md border border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 outline-none p-2"
                placeholder="Nhập ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn hoặc những yêu cầu đặc biệt khác."
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo; 