import { Button, InputForm, Loading } from "components";
import moment from "moment";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import avatar from "assets/avatar_default.png";
import { toast } from "react-toastify";
import { apiUpdateCurrent } from "api/user";
import { getCurrent } from "store/user/asyncAction";
import { showModal } from "store/app/appSlice";

const Personal = () => {
  const dispatch = useDispatch()
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
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
  }, [current, reset]);
  const handleUpdateInfor = async (data) => {
    const formData = new FormData();
    if (data.avatar.length > 0) formData.append("avatar", data.avatar[0])
    delete data.avatar
    for (let i of Object.entries(data)) {
      formData.append(i[0], i[1])
    }
    dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
    const response = await apiUpdateCurrent(formData)
    dispatch(showModal({ isShowModal: false, modalChildren: null }));
    if (response.success) {
      dispatch(getCurrent())
      toast.success(response.mes)
    } else {
      toast.error(response.mes)
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Personal</h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <form
          onSubmit={handleSubmit(handleUpdateInfor)}
          className="w-3/5 mx-auto py-8 flex flex-col gap-4"
        >
          <InputForm
            label="First Name"
            register={register}
            errors={errors}
            id="firstname"
            validate={{
              required: "Need fill this field",
            }}
          />
          <InputForm
            label="Last Name"
            register={register}
            errors={errors}
            id="lastname"
            validate={{
              required: "Need fill this field",
            }}
          />
          <InputForm
            label="Email address"
            register={register}
            errors={errors}
            id="email"
            validate={{
              required: "Need fill this field",
              pattern: {
                value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Email invalid.'
              }
            }}
          />
          <InputForm
            label="Phone"
            register={register}
            errors={errors}
            id="mobile"
            validate={{
              required: "Need fill this field",
              pattern: {
                value: /^(\+\d{1,3}[-\s]?)?\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})$/,
                message: 'Please enter a valid phone number'
              }
            }}
          />
          <div className="flex items-center gap-2">
            <span className="font-medium">Account status:</span>
            <span>{+current?.isBlocked ? "Blocked" : "Active"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Role:</span>
            <span>{+current?.role === 2010 ? "Admin" : "User"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">CreatedAt:</span>
            <span>{moment(current?.createdAt).fromNow()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Avatar:</span>
            <label htmlFor="file" className="cursor-pointer">
              <img src={current?.avatar || avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <input type="file" id="file" className="hidden" {...register("avatar")} />
            </label>
          </div>
          {isDirty && <div className="w-full flex justify-end">
            <Button type="submit">Save</Button>
          </div>}
        </form>
      </div>
    </div>
  );
};

export default Personal;