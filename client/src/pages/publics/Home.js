import React, { useEffect, useState } from "react";
import BestSellers from "components/product/BestSellers";
import Sidebar from "components/sidebar/Sidebar";
import Banner from "components/common/Banner";
import DealDaily from "components/product/DealDaily";
import FeatureProducts from "components/product/FeatureProducts";
import { useSelector } from "react-redux";
import icons from "utils/icons";
import { createSearchParams, Link } from "react-router-dom";
import path from "utils/path";
import withBase from "hocs/withBase";
import { apiGetAllBlogs } from "api/blog";

// Import slider và style liên quan
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const { IoMdArrowDropright, BsArrowRight } = icons;

const Home = ({ navigate }) => {
  const { categories } = useSelector((state) => state.app);
  
  // State để lưu danh sách blog và trạng thái loading
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Sử dụng useEffect để gọi API lấy danh sách blog từ MongoDB
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await apiGetAllBlogs();
        if (response.success) {
          setBlogPosts(response.blogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };
    fetchBlogs();
  }, []);

  // Cài đặt cho slider của blog posts
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Số bài hiển thị cùng lúc
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="overflow-x-hidden">
      {/*================== HERO SECTION ==================*/}
      <div className="w-main mx-auto flex flex-col md:flex-row gap-5 mt-6">
        <div className="md:w-[25%] flex flex-col gap-5">
          <div className="shadow-sm rounded-md overflow-hidden">
            <Sidebar />
          </div>
          <div className="shadow-sm rounded-md overflow-hidden">
            <DealDaily />
          </div>
          <div className="shadow-sm rounded-md overflow-hidden">
            <div className="w-full relative flex flex-col gap-3">
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/RightBanner-iPadAirM3 (2).jpg"
                alt="Promotion Banner"
                className="w-full h-[135px] object-cover"
              />
              <img
                src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/s-edu-2-0-right-laptop.jpg"
                alt="Promotion Banner"
                className="w-full h-[135px] object-cover"
              />
            </div>
          </div>
        </div>
        <div className="md:w-[75%] flex flex-col gap-5">
          <div className="rounded-md overflow-hidden shadow-sm">
            <Banner />
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <BestSellers />
          </div>
        </div>
      </div>

      {/*================== FEATURED PRODUCTS SECTION ==================*/}
      <div className="my-10 w-main mx-auto bg-white rounded-md shadow-sm p-6">
        <FeatureProducts />
      </div>

      {/*================== HOT COLLECTIONS SECTION ==================*/}
      <div className="my-10 w-main mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-main pb-2">
            BỘ SƯU TẬP NỔI BẬT
          </h3>
          <Link
            to={`/${path.PRODUCTS}`}
            className="flex items-center gap-1 text-gray-600 hover:text-main transition-colors"
          >
            Xem tất cả <BsArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-main2">
          {categories?.filter(el => el.brand.length > 0)?.map((el) => (
            <div
              key={el._id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 p-4 flex items-center border"
            >
              <img
                src={el?.image}
                alt={el.title}
                className="w-[120px] h-[120px] object-contain mr-4"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{el.title}</h4>
                <ul className="list-none text-gray-600">
                  {el?.brand?.map((item) => (
                    <span
                      key={item}
                      className="flex gap-1 items-center text-gray-500 hover:text-main transition-colors hover:underline cursor-pointer"
                      onClick={() =>
                        navigate({
                          pathname: `/${el.title}`,
                          search: createSearchParams({ brand: item }).toString(),
                        })
                      }
                    >
                      <IoMdArrowDropright className="text-gray-500" size={12} />
                      <li>{item}</li>
                    </span>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*================== BLOG POSTS SLIDER SECTION ==================*/}
      <div className="my-10 w-main mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 border-b-2 border-main pb-2">
            BÀI VIẾT MỚI NHẤT
          </h3>
          <Link
            to={`/${path.BLOGS}`}
            className="flex items-center gap-1 text-gray-600 hover:text-main transition-colors"
          >
            Xem tất cả các bài viết <BsArrowRight />
          </Link>
        </div>
        {loadingBlogs ? (
          <div className="text-center text-gray-500">Đang tải bài viết...</div>
        ) : blogPosts.length > 0 ? (
          <Slider {...sliderSettings}>
            {blogPosts.map(post => (
              <div key={post._id} className="px-2">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                  {/* Blog Image with Overlay */}
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-main text-white text-xs px-2 py-1 rounded">
                      {post.category}
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-5">
                    <span className="text-gray-500 text-sm">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <h4 className="text-lg font-semibold mt-2 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-main transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[4.5rem]">
                      {post.description}
                    </p>
                    <Link
                      to={`/${path.BLOGS}/${post._id}`}
                      className="inline-flex items-center gap-2 text-main font-medium hover:underline"
                    >
                      Read more <BsArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-center text-gray-500">Không có bài viết nào</div>
        )}
      </div>
    </div>
  );
};

export default withBase(Home);
