import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'components';
import { Link } from 'react-router-dom';
import {
  BiSearch,
  BiCalendar,
  BiUser,
  BiMessageRounded,
  BiRightArrowAlt,
  BiChevronRight,
  BiLeftArrowAlt
} from 'react-icons/bi';
import { FaTags, FaRegBookmark } from 'react-icons/fa';
import { apiGetAllBlogs } from 'api/blog';

// Nếu cần, bạn vẫn có thể giữ lại dữ liệu mẫu cho các phần khác như Categories, Popular Posts, Tags:
const categories = [
  { name: 'Technology', count: 15 },
  { name: 'Buying Guide', count: 8 },
  { name: 'Gadgets', count: 12 },
  { name: 'Smart Home', count: 7 },
  { name: 'Security', count: 5 },
  { name: 'Reviews', count: 20 },
  { name: 'News', count: 18 }
];

const popularPosts = [
  {
    id: 1,
    title: 'Top 10 Điện thoại thông minh năm 2025',
    date: 'Ngày 10 tháng 4 năm 2025',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 2,
    title: 'Hướng dẫn hoàn hảo cho bàn phím cơ',
    date: 'Ngày 28 tháng  năm 2025',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 3,
    title: 'Cách AI đang thay đổi ngành công nghệ',
    date: 'Ngày 15 tháng 3 năm 2025',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 4,
    title: 'Tai nghe giá rẻ tốt nhất năm 2025',
    date: 'Ngày 30 tháng 2 năm 2025',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
  }
];

const tags = [
  'Smartphones', 'Laptops', 'Wearables', 'Gaming', 'AI',
  'IoT', 'Headphones', 'Cameras', 'Speakers', 'Accessories',
  'Apple', 'Samsung', 'Reviews', 'Tips'
];

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
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
                
                {blogData.length > 0 ? (
                  <div className="grid grid-cols-1 gap-8">
                    {blogData.map((post) => (
                      <div key={post._id} className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-8 last:border-b-0 last:pb-0">
                        <div className="md:w-1/3 overflow-hidden rounded-lg group">
                          <Link to={`/blog/${post._id}`} className="block">
                            <div className="relative h-60 md:h-48 overflow-hidden rounded-lg">
                              <img
                                src={post.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/300x200?text=Error+Loading+Image';
                                }}
                              />
                              <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded">
                                {post.category || 'Chưa phân loại'}
                              </div>
                            </div>
                          </Link>
                        </div>
                        <div className="md:w-2/3">
                          <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-red-600 transition-colors duration-300">
                            <Link to={`/blog/${post._id}`}>{post.title}</Link>
                          </h3>
                          <div className="flex flex-wrap items-center text-gray-500 text-sm mb-3 gap-4">
                            <div className="flex items-center">
                              <BiUser className="mr-1" />
                              {post.author || 'Unknown'}
                            </div>
                            <div className="flex items-center">
                              <BiCalendar className="mr-1" />
                              {post.date}
                            </div>
                            <div className="flex items-center">
                              <BiMessageRounded className="mr-1" />
                              {post.numberComments || 0} Bình luận
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {post.excerpt}
                          </p>
                          <Link
                            to={`/blog/${post._id}`}
                            className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors duration-300"
                          >
                            Đọc thêm <BiRightArrowAlt className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-gray-400 text-lg mb-4">Không tìm thấy bài viết nào</div>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setCurrentPage(1);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      Xem tất cả bài viết
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex justify-center">
                    <div className="flex flex-wrap gap-2 items-center">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 border border-gray-300 rounded-md flex items-center ${
                          currentPage === 1 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <BiLeftArrowAlt className="mr-1" /> Prev
                      </button>
                      
                      {renderPaginationItems()}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 border border-gray-300 rounded-md flex items-center ${
                          currentPage === totalPages 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Next <BiRightArrowAlt className="ml-1" />
                      </button>
                    </div>
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
                {categories.map((category, index) => (
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
                {tags.map((tag, index) => (
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