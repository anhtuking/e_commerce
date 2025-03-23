import React, { useCallback, useEffect, useState } from "react";
import { apiDeleteUsers, apiGetUsers, apiUpdateUsers } from "api";
import { FaTrash, FaEdit, FaUserAlt, FaTimes } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { MdAdminPanelSettings } from "react-icons/md";
import moment from "moment";
import { InputField, Pagination, InputForm, Select } from "components";
import useDebounce from "hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { blockStatus, roles } from "utils/contants";

const ManageUser = () => {
  const [users, setUsers] = useState(null);
  const [queries, setQueries] = useState({
    search: "",
  });
  const [update, setUpdate] = useState(false);
  const [editEl, setEditEl] = useState(null);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    email: "",
    firstname: "",
    lastname: "",
    role: "",
    phone: "",
    isBlocked: "",
  });

  const [params] = useSearchParams();

  const fetchUsers = async (params) => {
    const response = await apiGetUsers({
      ...params,
      limit: +process.env.REACT_APP_LIMIT,
    });
    if (response.success) setUsers(response);
  };

  const renderRoleBadge = (role) => {
    // role = "2010" => Admin, role = "2607" => User
    if (+role === 2010) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-blue-600 inline-flex items-center gap-1">
          <MdAdminPanelSettings size={17} />
          Admin
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-gray-500 inline-flex items-center gap-1">
          <FaUserAlt />
          User
        </span>
      );
    }
  };

  const render = useCallback(() => {
    setUpdate(!update);
  }, [update]);
  const queriesDebounce = useDebounce(queries.search, 1000);

  const handleUpdate = async (data) => {
    const response = await apiUpdateUsers(data, editEl?._id);
    if (response.success) {
      setEditEl(null);
      render();
      toast.success(response.mes);
    } else {
      toast.error(response.mes);
    }
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.search = queriesDebounce;
    fetchUsers(queries);
  }, [queriesDebounce, params, update]);

  useEffect(() => {
    if (editEl) {
      reset({
        email: editEl.email,
        firstname: editEl.firstname,
        lastname: editEl.lastname,
        mobile: editEl.mobile,
      });
    }
  }, [editEl, reset]);

  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: "Delete User",
      text: "Are you sure you want to delete this line?",
      icon: 'warning',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await apiDeleteUsers(uid);
        if (response.success) {
          render();
          toast.success(response.mes);
        } else {
          toast.error(response.mes);
        }
      }
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Users</h1>
      <div className="flex justify-end py-4">
        <InputField
          nameKey={"search"}
          value={queries?.search}
          setValue={setQueries}
          styleClass={"w500"}
          placeholder="Search user..."
        />
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <form onSubmit={handleSubmit(handleUpdate)}>
          <table className="w-full table-auto text-left border-collapse">
            <thead className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-sm uppercase">
              <tr>
                <th className="px-4 py-3 text-center border">#</th>
                <th className="px-4 py-3 w-[365px] border">Email</th>
                <th className="px-4 py-3 border">First Name</th>
                <th className="px-4 py-3 border">Last Name</th>
                <th className="px-4 py-3 border">Role</th>
                <th className="px-4 py-3 border">Phone</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Created At</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users?.users?.map((el, index) => (
                <tr
                  key={el._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className="px-4 py-3">
                    {editEl?._id === el._id ? (
                      <InputForm
                        register={register}
                        errors={errors}
                        id={"email"}
                        validate={{
                          required: "This field is required.",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address.",
                          },
                        }}
                        defaultValue={editEl.email}
                      />
                    ) : (
                      <span>{el.email}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editEl?._id === el._id ? (
                      <InputForm
                        register={register}
                        errors={errors}
                        id={"firstname"}
                        validate={{ required: "This field is required." }}
                        styleClass="w-[180px]"
                        defaultValue={editEl.firstname}
                      />
                    ) : (
                      <span>{el.firstname}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editEl?._id === el._id ? (
                      <InputForm
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"lastname"}
                        validate={{ required: "This field is required." }}
                        defaultValue={editEl.lastname}
                      />
                    ) : (
                      <span>{el.lastname}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editEl?._id === el._id ? (
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"role"}
                        validate={{ required: "This field is required." }}
                        defaultValue={el.role}
                        options={roles}
                      />
                    ) : (
                      <span>{renderRoleBadge(el.role)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editEl?._id === el._id ? (
                      <InputForm
                        register={register}
                        errors={errors}
                        id={"mobile"}
                        styleClass="w-[150px]"
                        validate={{
                          required: "This field is required.",
                          pattern: {
                            value: /^[62|0]+\d{9}/gi,
                            message: "Invalid phone number.",
                          },
                        }}
                        defaultValue={editEl.mobile}
                      />
                    ) : (
                      <span>{el.mobile}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editEl?._id === el._id ? (
                      <Select
                        register={register}
                        fullWidth
                        errors={errors}
                        id={"isBlocked"}
                        validate={{ required: "This field is required." }}
                        defaultValue={el.isBlocked}
                        options={blockStatus}
                      />
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${
                      el.isBlocked
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }
                  `}
                      >
                        {el.isBlocked ? "Blocked" : "Active"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {moment(el.createdAt).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-3 flex items-center justify-center gap-3 my-auto">
                    {editEl?._id === el._id ? (
                      <>
                        <button
                          className="text-gray-500 hover:text-gray-800 transition"
                          onClick={() => setEditEl(null)}
                          type="button"
                        >
                          <FaTimes size={24} />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-800 transition"
                          type="submit"
                        >
                          <TiTick size={33} />
                        </button>
                      </>
                    ) : (
                      <button
                        className="text-blue-600 hover:text-blue-800 transition"
                        onClick={() => setEditEl(el)}
                        type="button"
                      >
                        <FaEdit size={18} />
                      </button>
                    )}
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => handleDeleteUser(el._id)}
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="w-full text-right justify-end my-4">
            <Pagination totalCount={users?.counts} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageUser;
