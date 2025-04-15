import React, { useCallback, useEffect, useState, useRef } from "react";
import { InputForm, Pagination, BlogForm } from "components";
import { useForm } from "react-hook-form";
import moment from "moment";
import { useSearchParams, createSearchParams, useLocation } from "react-router-dom";
import useDebounce from "hooks/useDebounce";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { RiArticleLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import withBase from "hocs/withBase";
import { apiGetAllBlogs, apiDeleteBlog } from "api/blog";

const ManageBlog = ({ dispatch, navigate }) => {
  const { register, formState: { errors }, watch } = useForm();
  const [blogs, setBlogs] = useState([]);
  const [counts, setCounts] = useState(0);
  const [params] = useSearchParams();
  const location = useLocation();
  const [editBlog, setEditBlog] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchInProgressRef = useRef(false);

  const render = useCallback(() => {
    setUpdate(prev => !prev);
  }, []);

  const fetchBlogs = useCallback(async () => {
    if (fetchInProgressRef.current) return;
    fetchInProgressRef.current = true;
    setIsLoading(true);
    try {
      const response = await apiGetAllBlogs();
      if (response.success) {
        setBlogs(response.blogs);
        setCounts(response.blogs.length);
      }
    } catch (error) {
      toast.error("Không thể tải danh sách bài viết");
      console.error(error);
    } finally {
      setIsLoading(false);
      fetchInProgressRef.current = false;
    }
  }, []);

  // Watch query input và đồng bộ lên URL
  const queryDebounce = useDebounce(watch("q"), 1000);

  useEffect(() => {
    const queries = Object.fromEntries([...params]);
    if (queryDebounce) {
      queries.q = queryDebounce;
    } else {
      delete queries.q;
    }
    navigate({
      pathname: location.pathname,
      search: createSearchParams(queries).toString(),
    });
  }, [queryDebounce, navigate, location.pathname, params]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs, update]);

  // Lọc blog theo từ khóa tìm kiếm
  const filteredBlogs = queryDebounce
    ? blogs.filter(blog => blog.title.toLowerCase().includes(queryDebounce.toLowerCase()))
    : blogs;

  const handleDeleteBlog = async (bid) => {
    try {
      const result = await Swal.fire({
        title: 'Xác nhận xóa',
        text: 'Bạn có chắc chắn muốn xóa bài viết này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
      });
      if (result.isConfirmed) {
        await apiDeleteBlog(bid);
        toast.success('Xóa bài viết thành công!');
        render();
      }
    } catch (error) {
      toast.error('Lỗi khi xóa bài viết!');
      console.error(error);
    }
  };

  const handleViewBlog = (blog) => {
    Swal.fire({
      title: blog.title,
      html: `
        <div class="text-left">
          <img src="${blog.image}" alt="${blog.title}" class="w-full h-48 object-cover mb-4 rounded-lg">
          <p class="text-sm text-gray-500 mb-2">Danh mục: ${blog.category}</p>
          <p class="text-sm text-gray-500 mb-2">Tác giả: ${blog.author}</p>
          <p class="text-sm text-gray-500 mb-4">Lượt xem: ${blog.numberViews || 0}</p>
          <p class="text-gray-700 whitespace-pre-line">${blog.description}</p>
          <div class="mt-4 flex items-center space-x-4">
            <div class="flex items-center text-blue-500">
              <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"></path>
              </svg>
              ${blog.likes?.length || 0} Lượt thích
            </div>
            <div class="flex items-center text-red-500">
              <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"></path>
              </svg>
              ${blog.dislikes?.length || 0} Không thích
            </div>
          </div>
        </div>
      `,
      width: 700,
      showCloseButton: true,
      showConfirmButton: false,
    });
  };

  const handleSubmitForm = () => {
    setEditBlog(null);
    setIsCreating(false);
    // Refresh the blog list immediately
    fetchBlogs();
  };

  const handleCancel = () => {
    setEditBlog(null);
    setIsCreating(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {(editBlog || isCreating) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <BlogForm onSubmit={handleSubmitForm} initialData={editBlog} onCancel={handleCancel} />
          </div>
        </div>
      )}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4 shadow-lg">
            <RiArticleLine className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Quản lý bài viết</h1>
            <p className="text-gray-500">Quản lý và bảo trì danh sách bài viết của cửa hàng</p>
          </div>
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </div>
      <div className="flex justify-between items-center px-4 mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-sm flex items-center"
          onClick={() => setIsCreating(true)}
        >
          <span className="mr-2">+</span> Tạo bài viết mới
        </button>
        <form className="w-[45%]">
          <InputForm id="q" register={register} errors={errors} fullWidth placeholder="Tìm kiếm bài viết..." />
        </form>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        {isLoading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        )}
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm">
              <th className="p-3 border">#</th>
              <th className="p-3 border">Ảnh</th>
              <th className="p-3 border">Tiêu đề</th>
              <th className="p-3 border">Danh mục</th>
              <th className="p-3 border">Tác giả</th>
              <th className="p-3 border">Lượt xem</th>
              <th className="p-3 border">Lượt thích</th>
              <th className="p-3 border">Không thích</th>
              <th className="p-3 border">Ngày tạo</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>
          <tbody className={isLoading ? "opacity-50" : ""}>
            {filteredBlogs.map((blog, index) => (
              <tr key={blog._id} className="hover:bg-gray-100 transition-all border-b text-sm">
                <td className="p-3 text-center border">{index + 1}</td>
                <td className="p-3 text-center border">
                  <img src={blog.image} alt={blog.title} className="w-16 h-12 object-cover rounded-md shadow-sm mx-auto" />
                </td>
                <td className="p-3 border">{blog.title}</td>
                <td className="p-3 text-center border">{blog.category}</td>
                <td className="p-3 text-center border">{blog.author}</td>
                <td className="p-3 text-center border">{blog.numberViews || 0}</td>
                <td className="p-3 text-center border">{blog.likes?.length || 0}</td>
                <td className="p-3 text-center border">{blog.dislikes?.length || 0}</td>
                <td className="p-3 text-center border">{moment(blog.createdAt).format("DD/MM/YYYY")}</td>
                <td className="p-3 text-center border">
                  <div className="flex items-center justify-center space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 transition" type="button" onClick={() => handleViewBlog(blog)} title="Xem chi tiết">
                      <FaEye size={18} />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 transition" type="button" onClick={() => setEditBlog(blog)} title="Chỉnh sửa">
                      <FaEdit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800 transition" type="button" onClick={() => handleDeleteBlog(blog._id)} title="Xóa">
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Thông báo khi danh sách rỗng sau khi lọc */}
        {!isLoading && filteredBlogs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {queryDebounce ? "Không tìm thấy bài viết phù hợp" : "Chưa có bài viết nào"}
          </div>
        )}
        <div className="w-full text-right justify-end my-4">
          <Pagination totalCount={counts} />
        </div>
      </div>
    </div>
  );
};

export default withBase(ManageBlog);
