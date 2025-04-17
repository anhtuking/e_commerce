import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'components';
import { Link, useNavigate } from 'react-router-dom';
import {
  BiSearch,
  BiCalendar,
  BiUser,
  BiMessageRounded,
  BiRightArrowAlt,
  BiChevronRight,
  BiLeftArrowAlt
} from 'react-icons/bi';
import { FaTags, FaRegBookmark, FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
import { apiGetAllBlogs, apiLikeBlog, apiDislikeBlog } from 'api/blog';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { popularPosts, blogTags, blogCategories } from 'utils/contants';

const Blogs = () => {
  const navigate = useNavigate();
  const { current } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loadingAction, setLoadingAction] = useState(false);
  const blogsPerPage = 5;

  // Xử lý tìm kiếm (nếu cần)
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle like blog
  const handleLike = async (bid) => {
    if (!current) {
      toast.warning('Vui lòng đăng nhập để thực hiện chức năng này!');
      navigate('/login');
      return;
    }

    try {
      setLoadingAction(true);
      const response = await apiLikeBlog(bid);
      if (response.success) {
        // Cập nhật lại danh sách blog sau khi like/unlike
        const updatedBlogs = blogData.map(blog =>
          blog._id === bid ? { ...blog, likes: response.result.likes, dislikes: response.result.dislikes } : blog
        );
        setBlogData(updatedBlogs);
        toast.success('Đã cập nhật đánh giá!');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        navigate('/login');
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại sau!');
      }
    } finally {
      setLoadingAction(false);
    }
  };

  // Handle dislike blog
  const handleDislike = async (bid) => {
    if (!current) {
      toast.warning('Vui lòng đăng nhập để thực hiện chức năng này!');
      navigate('/login');
      return;
    }

    try {
      setLoadingAction(true);
      const response = await apiDislikeBlog(bid);
      if (response.success) {
        // Cập nhật lại danh sách blog sau khi dislike/undislike
        const updatedBlogs = blogData.map(blog =>
          blog._id === bid ? { ...blog, likes: response.result.likes, dislikes: response.result.dislikes } : blog
        );
        setBlogData(updatedBlogs);
        toast.success('Đã cập nhật đánh giá!');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
        navigate('/login');
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại sau!');
      }
    } finally {
      setLoadingAction(false);
    }
  };

  // Check if user has liked or disliked a blog
  const hasUserLiked = (blog) => {
    return current && blog.likes?.includes(current._id);
  };

  const hasUserDisliked = (blog) => {
    return current && blog.dislikes?.includes(current._id);
  };

  // Call API lấy blog từ MongoDB, thay vì sử dụng dữ liệu mẫu
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await apiGetAllBlogs({
          page: currentPage,
          limit: blogsPerPage,
          search: searchTerm
        });
        
        if (response.success) {
          // Nếu API không có trường excerpt, bạn có thể tạo nó (ví dụ: cắt ngắn description)
          const blogsWithExcerpt = response.blogs.map(blog => ({
            ...blog,
            excerpt: blog.description ? blog.description.substring(0, 150) + '...' : '',
            // Chuyển createdAt thành định dạng ngày nếu cần
            date: new Date(blog.createdAt).toLocaleDateString()
          }));
          
          setBlogData(blogsWithExcerpt);
          
          // Set pagination info from response
          setTotalBlogs(response.count || 0);
          setTotalPages(response.pages || Math.ceil(response.count / blogsPerPage) || 1);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, [currentPage, searchTerm, blogsPerPage]);

  // Generate pagination items
  const renderPaginationItems = () => {
    const pages = [];
    
    // For small number of pages, show all
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-4 py-2 border ${
              currentPage === i 
                ? 'border-red-600 bg-red-600 text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-md`}
          >
            {i}
          </button>
        );
      }
    } else {
      // For larger number of pages, show current, neighbors, first, last and ellipses
      
      // Always show first page
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 border ${
            currentPage === 1 
              ? 'border-red-600 bg-red-600 text-white' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          } rounded-md`}
        >
          1
        </button>
      );
      
      // Show ellipsis if not on first 3 pages
      if (currentPage > 3) {
        pages.push(
          <span key="ellipsis1" className="px-3 py-2">
            ...
          </span>
        );
      }
      
      // Show neighbor pages
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-4 py-2 border ${
              currentPage === i 
                ? 'border-red-600 bg-red-600 text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-md`}
          >
            {i}
          </button>
        );
      }
      
      // Show ellipsis if not near last page
      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="ellipsis2" className="px-3 py-2">
            ...
          </span>
        );
      }
      
      // Always show last page if more than 1 page
      if (totalPages > 1) {
        pages.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className={`px-4 py-2 border ${
              currentPage === totalPages 
                ? 'border-red-600 bg-red-600 text-white' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-md`}
          >
            {totalPages}
          </button>
        );
      }
    }
    
    return pages;
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="h-[81px] flex justify-start items-start bg-gray-100">
        <div className="w-main mx-auto py-4">
          <h3 className="font-semibold uppercase text-2xl font-main2">Bài viết</h3>
          <Breadcrumb category="blogs" />
        </div>
      </div>

      {/* Blog Content */}
      <div className="w-main mx-auto mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="grid grid-cols-1 gap-6">
                  {[1, 2, 3, 4, 5].map(item => (
                    <div key={item} className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 bg-gray-200 rounded-lg h-48"></div>
                      <div className="md:w-2/3 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-3">
                  Bài viết mới nhất
                  <p className="text-gray-400 text-sm">
                    Khám phá tin tức, mẹo và bài viết về công nghệ và sản phẩm số
                  </p>
                  {totalBlogs > 0 && (
                    <p className="text-gray-400 text-sm mt-1">
                      Hiển thị {blogData.length} / {totalBlogs} bài viết (Trang {currentPage}/{totalPages})
                    </p>
                  )}
                </h2>
                
                {blogData.length === 0 ? (
                  <div className="py-8 text-center text-gray-600">
                    {searchTerm ? `Không tìm thấy bài viết cho "${searchTerm}"` : 'Chưa có bài viết nào'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {blogData.map((blog) => (
                      <div key={blog._id} className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-8">
                        {/* Blog Image */}
                        <div className="md:w-1/3">
                          <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className="w-full h-56 object-cover rounded-lg shadow-sm transition-transform hover:scale-105"
                          />
                        </div>
                        
                        {/* Blog Content */}
                        <div className="md:w-2/3 flex flex-col">
                          <Link to={`/blog/${blog._id}`} className="text-xl font-semibold text-gray-800 hover:text-red-600 transition-colors">
                            {blog.title}
                          </Link>
                          
                          {/* Meta info */}
                          <div className="flex flex-wrap items-center gap-4 my-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <BiCalendar className="mr-1" />
                              <span>{blog.date}</span>
                            </div>
                            <div className="flex items-center">
                              <BiUser className="mr-1" />
                              <span>{blog.author}</span>
                            </div>
                            <div className="flex items-center">
                              <BiMessageRounded className="mr-1" />
                              <span>{blog.numberViews || 0} lượt xem</span>
                            </div>
                          </div>
                          
                          {/* Excerpt */}
                          <p className="text-gray-600 my-3">{blog.excerpt}</p>
                          
                          <div className="mt-auto pt-3 flex justify-between items-center">
                            <Link
                              to={`/blog/${blog._id}`}
                              className="inline-flex items-center font-medium text-red-600 hover:text-red-800 transition-colors"
                            >
                              Đọc tiếp <BiRightArrowAlt className="ml-1" />
                            </Link>
                            
                            {/* Like/Dislike UI */}
                            <div className="flex items-center gap-4">
                              <button
                                onClick={() => handleLike(blog._id)}
                                disabled={loadingAction}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                                  hasUserLiked(blog) 
                                    ? 'text-blue-600 bg-blue-50' 
                                    : 'text-gray-600 hover:text-blue-600'
                                }`}
                                title="Thích"
                              >
                                {hasUserLiked(blog) ? <FaThumbsUp /> : <FaRegThumbsUp />}
                                <span>{blog.likes?.length || 0}</span>
                              </button>
                              
                              <button
                                onClick={() => handleDislike(blog._id)}
                                disabled={loadingAction}
                                className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                                  hasUserDisliked(blog) 
                                    ? 'text-red-600 bg-red-50' 
                                    : 'text-gray-600 hover:text-red-600'
                                }`}
                                title="Không thích"
                              >
                                {hasUserDisliked(blog) ? <FaThumbsDown /> : <FaRegThumbsDown />}
                                <span>{blog.dislikes?.length || 0}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-10">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 mr-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <BiLeftArrowAlt size={20} />
                    </button>
                    
                    <div className="flex space-x-2">
                      {renderPaginationItems()}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 ml-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <BiChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tìm kiếm</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <BiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh mục</h3>
              <ul className="space-y-3">
                {blogCategories.map((category, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center justify-between text-gray-600 hover:text-red-600 transition-colors duration-300"
                    >
                      <span className="flex items-center">
                        <BiChevronRight className="mr-2" /> {category.name}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bài viết phổ biến</h3>
              <div className="space-y-4">
                {popularPosts.map((post) => (
                  <a
                    href="#"
                    key={post.id}
                    className="flex gap-3 group"
                  >
                    <div className="w-20 h-20 overflow-hidden rounded-md flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 group-hover:text-red-600 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <BiCalendar className="mr-1" /> {post.date}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaTags className="mr-2 text-red-600" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blogTags.map((tag, index) => (
                  <a
                    href="#"
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-red-600 hover:text-white transition-colors duration-300"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <FaRegBookmark className="mr-2" /> Đăng ký nhận bản tin
              </h3>
              <p className="text-sm mb-4 text-white text-opacity-90">
                Nhận tin tức và bài viết mới nhất đến email của bạn
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Địa chỉ email của bạn"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts Section */}
      <div className="w-main mx-auto mt-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Bạn có thể thích</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogData.slice(0, 3).map((post) => (
              <div key={post._id} className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="overflow-hidden h-48">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
                    <span className="text-red-600">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-red-600 transition-colors duration-300">
                    <a href="#">{post.title}</a>
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <a
                    href="#"
                    className="inline-flex items-center text-red-600 text-sm font-medium hover:text-red-700 transition-colors duration-300"
                  >
                    Đọc thêm <BiRightArrowAlt className="ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;