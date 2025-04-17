import React, { useEffect, useState } from "react";
import BestSellers from "components/product/BestSellers";
import Banner from "components/common/Banner";
import DealDaily from "components/product/DealDaily";
import FeatureProducts from "components/product/FeatureProducts";
import { CategoryGrid } from "components";
import { useSelector } from "react-redux";
import icons from "utils/icons";
import { createSearchParams, Link } from "react-router-dom";
import path from "utils/path";
import withBase from "hocs/withBase";
import { apiGetAllBlogs } from "api/blog";
import { brandLogos } from "utils/contants";
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

  // Cài đặt cho slider thương hiệu
  const brandSliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "cubic-bezier(0.45, 0, 0.55, 1)",
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          arrows: false,
        }
      }
    ]
  };

  return (
    <div className="overflow-x-hidden">
      {/*================== HERO SECTION ==================*/}
      <div className="w-main mx-auto flex flex-col gap-5 mt-6">
        {/* Full-width Banner */}
        <div className="rounded-md overflow-hidden shadow-sm">
          <Banner />
        </div>
        
        {/* Categories Grid */}
        <CategoryGrid />
        
        {/* DealDaily and BestSellers */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Left column - DealDaily */}
          <div className="md:col-span-1 bg-white p-4 rounded-md shadow-sm">
            <DealDaily />
          </div>
          
          {/* Right column - BestSellers */}
          <div className="md:col-span-3 bg-white p-4 rounded-md shadow-sm">
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
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[5rem]">
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

      {/*================== BRANDS SLIDER SECTION ==================*/}
      <div className="my-16 w-main mx-auto">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-gray-800 inline-block relative">
            <span className="relative z-10 font-main2 text-main">THƯƠNG HIỆU HÀNG ĐẦU</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-red-200 to-main opacity-40 -z-0"></span>
          </h3>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Khám phá và mua sắm sản phẩm từ các thương hiệu công nghệ hàng đầu thế giới</p>
        </div>

        <div className="relative">
          {/* Main slider container */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-md overflow-hidden">
            {/* Top wave decoration */}
            <div className="h-6 bg-gradient-to-r from-red-50 to-red-100 w-full relative overflow-hidden">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute -bottom-5 left-0 w-full h-10 text-white">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
              </svg>
            </div>

            {/* Slider content */}
            <div className="py-8 px-4">
              <Slider {...brandSliderSettings}>
                {brandLogos.map(brand => (
                  <div key={brand.id} className="px-4">
                    <div
                      className="group relative flex flex-col items-center justify-center h-32 rounded-lg p-6 transition-all duration-300"
                      onClick={() => navigate({
                        pathname: `/${path.PRODUCTS}`,
                        search: createSearchParams({ brand: brand.name }).toString(),
                      })}
                    >
                      {/* Hover effect background */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"
                        style={{ backgroundColor: brand.color }}
                      ></div>

                      {/* Logo */}
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="max-h-14 max-w-full object-contain mb-3 transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                      />

                      {/* Brand name */}
                      <span className="text-sm font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{brand.name}</span>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withBase(Home);
