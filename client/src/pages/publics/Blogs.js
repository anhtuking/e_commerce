import React, { useState, useEffect } from 'react';
import { Breadcrumb } from 'components';
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

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: 'The Future of Smartphone Technology in 2025',
    excerpt: 'Explore the upcoming trends and innovations that will shape the smartphone industry in the next few years, from foldable displays to AI integration.',
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Technology',
    author: 'David Chen',
    date: 'May 15, 2023',
    comments: 24
  },
  {
    id: 2,
    title: 'How to Choose the Perfect Laptop for Your Needs',
    excerpt: 'Buying a new laptop can be overwhelming with countless options available. This guide will help you identify what features matter most based on your specific needs.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    category: 'Buying Guide',
    author: 'Sarah Johnson',
    date: 'April 28, 2023',
    comments: 42
  },
  {
    id: 3,
    title: 'Wearable Tech: Beyond Fitness Tracking',
    excerpt: 'Wearable technology has evolved far beyond step counting. Discover how smartwatches and other wearables are becoming essential health and productivity tools.',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Gadgets',
    author: 'Michael Park',
    date: 'April 15, 2023',
    comments: 18
  },
  {
    id: 4,
    title: 'The Evolution of Virtual Reality Technology',
    excerpt: 'From gaming to professional training, virtual reality is transforming numerous industries. Learn about the latest advancements and what\'s coming next.',
    image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlydHVhbCUyMHJlYWxpdHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Technology',
    author: 'Emily Zhang',
    date: 'March 30, 2023',
    comments: 31
  },
  {
    id: 5,
    title: 'Smart Home Essentials for Beginners',
    excerpt: 'Ready to make your home smarter? This beginner-friendly guide covers the essential devices to get started with building an integrated smart home system.',
    image: 'https://images.unsplash.com/photo-1558002038-1055e2cf8a69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnQlMjBob21lfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60',
    category: 'Smart Home',
    author: 'Robert Wilson',
    date: 'March 18, 2023',
    comments: 27
  },
  {
    id: 6,
    title: 'Cybersecurity Tips Everyone Should Follow',
    excerpt: 'In an increasingly digital world, protecting your personal information is crucial. Learn these essential cybersecurity practices to keep your data safe.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3liZXJzZWN1cml0eXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60',
    category: 'Security',
    author: 'Jennifer Lee',
    date: 'February 24, 2023',
    comments: 45
  }
];

// Categories
const categories = [
  { name: 'Technology', count: 15 },
  { name: 'Buying Guide', count: 8 },
  { name: 'Gadgets', count: 12 },
  { name: 'Smart Home', count: 7 },
  { name: 'Security', count: 5 },
  { name: 'Reviews', count: 20 },
  { name: 'News', count: 18 }
];

// Popular posts
const popularPosts = [
  {
    id: 1,
    title: 'Top 10 Smartphones of 2023',
    date: 'June 10, 2023',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGhvbmV8ZW58MHwwfDB8fHww&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 2,
    title: 'The Ultimate Guide to Mechanical Keyboards',
    date: 'May 28, 2023',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2V5Ym9hcmR8ZW58MHwwfDB8fHww&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 3,
    title: 'How AI is Changing the Tech Industry',
    date: 'May 15, 2023',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8QUl8ZW58MHwwfDB8fHww&auto=format&fit=crop&w=800&q=60'
  },
  {
    id: 4,
    title: 'Best Budget Earbuds for 2023',
    date: 'April 30, 2023',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZWFyYnVkc3xlbnwwfDB8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'
  }
];

// Tags
const tags = [
  'Smartphones', 'Laptops', 'Wearables', 'Gaming', 'AI',
  'IoT', 'Headphones', 'Cameras', 'Speakers', 'Accessories',
  'Apple', 'Samsung', 'Google', 'Reviews', 'Tips'
];

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setBlogData(blogPosts);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="h-[81px] flex justify-start items-start bg-gray-100">
        <div className="w-main mx-auto py-4">
          <h3 className="font-semibold uppercase text-2xl font-main2">Our Blogs</h3>
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
                  {[1, 2, 3].map(item => (
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
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-3">Latest Articles
                  <p className="text-gray-400 text-sm">
                    Discover the latest news, tips, and insights about technology and digital products
                  </p>
                </h2>
                <div className="grid grid-cols-1 gap-8">
                  {blogData.map((post) => (
                    <div className="flex flex-col md:flex-row gap-6 border-b border-gray-100 pb-8 last:border-b-0 last:pb-0">
                      <div className="md:w-1/3 overflow-hidden rounded-lg group">
                        <div className="relative h-60 md:h-48 overflow-hidden rounded-lg">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded">
                            {post.category}
                          </div>
                        </div>
                      </div>
                      <div className="md:w-2/3">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 hover:text-red-600 transition-colors duration-300">
                          <a href="#">{post.title}</a>
                        </h3>
                        <div className="flex items-center text-gray-500 text-sm mb-3 space-x-4">
                          <div className="flex items-center">
                            <BiUser className="mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <BiCalendar className="mr-1" />
                            {post.date}
                          </div>
                          <div className="flex items-center">
                            <BiMessageRounded className="mr-1" />
                            {post.comments} Comments
                          </div>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {post.excerpt}
                        </p>
                        <a
                          href="#"
                          className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors duration-300"
                        >
                          Read More <BiRightArrowAlt className="ml-1" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-10 flex justify-center">
                  <div className="flex space-x-1">
                    <a
                      href="#"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <BiLeftArrowAlt className="mr-1" /> Prev
                    </a>
                    <a
                      href="#"
                      className="px-4 py-2 border border-red-600 bg-red-600 text-white rounded-md"
                    >
                      1
                    </a>
                    <a
                      href="#"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      2
                    </a>
                    <a
                      href="#"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      3
                    </a>
                    <a
                      href="#"
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      Next <BiRightArrowAlt className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Search</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <BiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Posts</h3>
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
                <FaRegBookmark className="mr-2" /> Subscribe to Newsletter
              </h3>
              <p className="text-sm mb-4 text-white text-opacity-90">
                Get the latest articles and news delivered to your inbox
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Related Posts Section */}
      <div className="w-main mx-auto mt-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">You Might Also Like</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogPosts.slice(0, 3).map((post) => (
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
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
                    Read More <BiRightArrowAlt className="ml-1" />
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