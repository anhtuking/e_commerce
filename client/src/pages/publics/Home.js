import React from "react";
import BestSellers from "components/product/BestSellers";
import Sidebar from "components/sidebar/Sidebar";
import Banner from "components/common/Banner";
import DealDaily from "components/product/DealDaily";
import FeatureProducts from "components/product/FeatureProducts";
import { useSelector } from "react-redux";
import icons from "utils/icons";
import { Link } from "react-router-dom";
import path from "utils/path";

const { IoMdArrowDropright, BsArrowRight } = icons;

// Dữ liệu mẫu cho blog posts
const blogPosts = [
  {
    id: 1,
    title: 'The Future of Smartphone Technology in 2025',
    excerpt: 'Explore the upcoming trends and innovations that will shape the smartphone industry in the next few years, from foldable displays to AI integration.',
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Technology',
    date: 'May 15, 2023',
  },
  {
    id: 2,
    title: 'How to Choose the Perfect Laptop for Your Needs',
    excerpt: 'Buying a new laptop can be overwhelming with countless options available. This guide will help you identify what features matter most based on your specific needs.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    category: 'Buying Guide',
    date: 'April 28, 2023',
  },
  {
    id: 3,
    title: 'Wearable Tech: Beyond Fitness Tracking',
    excerpt: 'Wearable technology has evolved far beyond step counting. Discover how smartwatches and other wearables are becoming essential health and productivity tools.',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Gadgets',
    date: 'April 15, 2023',
  }
];

const Home = () => {
  const { categories } = useSelector((state) => state.app);
  // console.log(categories);
  // const { isLoggedIn, current } = useSelector((state) => state.user);
  // console.log({isLoggedIn, current});

  return (
    <>
      <div className="w-main flex font-main2 mt-6 ">
        <div className="flex flex-col gap-5 w-[25%] flex-auto">
          <Sidebar />
          <DealDaily />
        </div>
        <div className="flex flex-col gap-5 pl-5 w-[75%] h-[80%] flex-auto ">
          <Banner />
          <BestSellers />
        </div>
      </div>
      <div className="my-8 w-main">
        <FeatureProducts />
      </div>
      <div className="my-8 w-main">
        <h3 className="text-[20px] py-[15px] border-b-2 border-main font-semibold">
          {" "}
          HOT COLLECTIONS{" "}
        </h3>
        <div className="grid grid-cols-3 gap-6 mt-6 font-main2">
          {categories?.filter(el => el.brand.length > 0)?.map((el) => (
            <div key={el._id} className="border-item p-4 flex items-center uppercase">
              <img
                src={el?.image}
                alt=""
                className="w-[200px] h-[200px] object-contain mr-4"
              />
              <div>
                <h4 className="text-lg">{el.title}</h4>
                <ul className="list-none text-gray-600">
                  {el?.brand?.map((item) => (
                    <li className="mt-1 flex items-center gap-1">
                      <IoMdArrowDropright className="text-gray-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="my-12 w-main">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[20px] font-semibold border-b-2 border-main py-[15px]">
            LATEST BLOG POSTS
          </h3>
          <Link 
            to={`/${path.BLOGS}`} 
            className="flex items-center gap-1 text-gray-500 hover:text-main font-medium transition-colors"
          >
            View all articles
            <BsArrowRight />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 font-main2">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
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
                <span className="text-gray-500 text-sm">{post.date}</span>
                <h4 className="text-lg font-semibold mt-2 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-main transition-colors">
                  {post.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[4.5rem]">
                  {post.excerpt}
                </p>
                <Link 
                  to={`/${path.BLOGS}/${post.id}`} 
                  className="inline-flex items-center gap-2 text-main font-medium hover:underline"
                >
                  Read more
                  <BsArrowRight />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
