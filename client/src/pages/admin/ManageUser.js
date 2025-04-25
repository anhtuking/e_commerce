import React, { useCallback, useEffect, useState } from "react";
import { apiDeleteUsers, apiGetUsers, apiUpdateUsers } from "api";
import { FaTrash, FaEdit, FaUserAlt } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiGroupLine } from "react-icons/ri";
import moment from "moment";
import { InputField, Pagination } from "components";
import UserEditModal from "./UserEditModal";
import useDebounce from "hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { blockStatus, roles } from "utils/contants";

const ManageUser = () => {
  const [users, setUsers] = useState(null);
  const [queries, setQueries] = useState({
    search: "",
  });
  const [update, setUpdate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [params] = useSearchParams();
  const fetchUsers = async (params) => {
    try {
      const response = await apiGetUsers({
        ...params,
        limit: +process.env.REACT_APP_LIMIT,
      });
      if (response.success) {
        setUsers(response);
      } else {
        // Show server-provided message on failure
        toast.error(response.mes || 'Failed to load users');
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error('Failed fetching users:', error);
      toast.error(error.mes || 'Error fetching users. Please try again.');
    }
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

  const handleOpenEditModal = (user) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setEditUser(null);
    setShowEditModal(false);
  };

  const handleUpdateUser = async (data) => {
    try {
      const response = await apiUpdateUsers(data, editUser?._id);
      if (response.success) {
        handleCloseEditModal();
        render();
        toast.success(response.mes || 'User updated successfully');
      } else {
        toast.error(response.mes || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.mes || 'Error updating user. Please try again.');
    }
  };

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queriesDebounce) queries.search = queriesDebounce;
    fetchUsers(queries);
  }, [queriesDebounce, params, update]);

  const handleDeleteUser = (uid) => {
    Swal.fire({
      title: "Delete User",
      text: "Are you sure you want to delete this user?",
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4 shadow-lg">
            <RiGroupLine className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
            <p className="text-gray-500">Quản lý tài khoản và kiểm soát truy cập</p>
          </div>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </div>
      
      <div className="flex justify-end py-4 mb-4">
        <InputField
          nameKey={"search"}
          value={queries?.search}
          setValue={setQueries}
          styleClass={"w500"}
          placeholder="Tìm kiếm tài khoản..."
        />
      </div>
      
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto text-left border-collapse">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-center border">#</th>
              <th className="px-4 py-3 border">Email</th>
              <th className="px-4 py-3 border text-center">Họ</th>
              <th className="px-4 py-3 border text-center">Tên</th>
              <th className="px-4 py-3 border text-center">Vai trò</th>
              <th className="px-4 py-3 border text-center">Số điện thoại</th>
              <th className="px-4 py-3 border text-center">Trạng thái</th>
              <th className="px-4 py-3 border text-center">Ngày tạo</th>
              <th className="px-4 py-3 border text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users?.users?.map((el, index) => (
              <tr
                key={el._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3">{el.email}</td>
                <td className="px-4 py-3 text-center">{el.firstname}</td>
                <td className="px-4 py-3 text-center">{el.lastname}</td>
                <td className="px-4 py-3 text-center">{renderRoleBadge(el.role)}</td>
                <td className="px-4 py-3 text-center">{el.mobile}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold 
                  ${
                    el.isBlocked
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }
                `}
                  >
                    {el.isBlocked ? "Đã khóa" : "Hoạt động"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {moment(el.createdAt).format("DD/MM/YYYY")}
                </td>
                <td className="px-4 py-3 flex items-center justify-center gap-3 my-auto">
                  <button
                    className="text-blue-600 hover:text-blue-800 transition"
                    onClick={() => handleOpenEditModal(el)}
                    type="button"
                  >
                    <FaEdit size={18} />
                  </button>
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
          {users && users.counts !== undefined && (
            <Pagination totalCount={users.counts} />
          )}
        </div>
      </div>
      
      {/* User Edit Modal */}
      {showEditModal && (
        <UserEditModal 
          user={editUser}
          onClose={handleCloseEditModal}
          onSubmit={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default ManageUser;
