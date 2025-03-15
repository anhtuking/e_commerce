import React, { useCallback, useEffect, useState } from "react";
import { apiGetUsers } from "api";
import {FaTrash, FaEdit, FaUserAlt} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import moment from "moment";
import { InputField, Pagination } from "components";
import useDebounce from "hooks/useDebounce";
import { useSearchParams } from "react-router-dom";

const ManageUser = () => {
  const [users, setUsers] = useState(null)
  const [queries, setQueries] = useState({
    search: ""
  })

  const [params] = useSearchParams()

  const fetchUsers = async (params) => {
    const response = await apiGetUsers({...params, limit: +process.env.REACT_APP_LIMIT});
    if (response.success) setUsers(response)
  };

  const renderRoleBadge = (role) => {
    // role = "2010" => Admin, role = "2607" => User
    if (+role === 2010) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-blue-600 inline-flex items-center gap-1">
          <MdAdminPanelSettings size={17}/>
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

  const queriesDebounce = useDebounce(queries.search, 1000)

  useEffect(() => {
    const queries = Object.fromEntries([...params])
    if (queriesDebounce) queries.search = queriesDebounce
    fetchUsers(queries);
  }, [queriesDebounce, params]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Manage Users</h1>
      <div className="flex justify-end py-4">
        <InputField nameKey={'search'} value={queries?.search} setValue={setQueries} style={'w500'} placeholder="Search user..."/>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full table-auto text-left border-collapse">
          <thead className="bg-blue-600 text-white text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-center">#</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users?.users?.map((user, index) => (
              <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3 text-center">{index + 1}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{`${user.firstname} ${user.lastname}`}</td>
                <td className="px-4 py-3">{renderRoleBadge(user.role)}</td>
                <td className="px-4 py-3">{user.mobile}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${user.isBlocked ? "bg-red-500 text-white" : "bg-green-500 text-white"}
                  `}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-3">{moment(user.createdAt).format('DD/MM/YYYY')}</td>
                <td className="px-4 py-3 flex items-center justify-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800 transition">
                    <FaEdit size={18} />
                  </button>
                  <button className="text-red-600 hover:text-red-800 transition">
                    <FaTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <div className="w-full text-right justify-end">
          <Pagination totalCount={users?.counts}/>
        </div>
    </div>
  );
};

export default ManageUser;