import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { InputForm, Select } from "components";
import { blockStatus, roles } from "utils/contants";

const UserEditModal = ({ user, onClose, onSubmit }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      role: "",
      mobile: "",
      isBlocked: "",
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        mobile: user.mobile,
        role: user.role,
        isBlocked: user.isBlocked
      });
    }
  }, [user, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={onClose}>
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-40"></div>
        
        {/* Modal content */}
        <div 
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-auto z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg">
            <h3 className="text-xl font-semibold text-white">
              Edit User Information
            </h3>
            <button
              type="button"
              className="text-white hover:text-gray-200 transition"
              onClick={onClose}
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <InputForm
                    register={register}
                    errors={errors}
                    id="firstname"
                    fullWidth
                    validate={{ required: "First name is required" }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <InputForm
                    register={register}
                    errors={errors}
                    id="lastname"
                    fullWidth
                    validate={{ required: "Last name is required" }}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <InputForm
                  register={register}
                  errors={errors}
                  id="email"
                  fullWidth
                  validate={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <InputForm
                  register={register}
                  errors={errors}
                  id="mobile"
                  fullWidth
                  validate={{
                    required: "Phone number is required",
                    pattern: {
                      value: /^[62|0]+\d{9}/gi,
                      message: "Invalid phone number format",
                    },
                  }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <Select
                    register={register}
                    errors={errors}
                    id="role"
                    fullWidth
                    validate={{ required: "Role is required" }}
                    options={roles}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select
                    register={register}
                    errors={errors}
                    id="isBlocked"
                    fullWidth
                    validate={{ required: "Status is required" }}
                    options={blockStatus}
                  />
                </div>
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal; 