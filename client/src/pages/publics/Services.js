import React from 'react';
import { Breadcrumb } from 'components';
import {
    FaShippingFast,
    FaHandHoldingUsd,
    FaHeadset,
    FaExchangeAlt,
    FaCreditCard,
    FaShieldAlt,
    FaThumbsUp,
    FaGift
} from 'react-icons/fa';
import { BiSupport, BiTimeFive } from 'react-icons/bi';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { MdOutlineLocalShipping } from 'react-icons/md';

// Main services
const mainServices = [
    {
        id: 1,
        title: 'Free Shipping',
        description: 'Free shipping on all orders over 2,000,000 VND.',
        icon: <FaShippingFast className="text-3xl md:text-4xl text-red-600" />,
        bgColor: 'bg-red-50'
    },
    {
        id: 2,
        title: 'Money Back Guarantee',
        description: '100% money back guarantee within 30 days of purchase.',
        icon: <FaHandHoldingUsd className="text-3xl md:text-4xl text-red-600" />,
        bgColor: 'bg-blue-50'
    },
    {
        id: 3,
        title: '24/7 Customer Support',
        description: 'Our support team is available 24/7 to help you.',
        icon: <FaHeadset className="text-3xl md:text-4xl text-red-600" />,
        bgColor: 'bg-green-50'
    },
    {
        id: 4,
        title: 'Easy Returns',
        description: 'Hassle-free return policy for all eligible products.',
        icon: <FaExchangeAlt className="text-3xl md:text-4xl text-red-600" />,
        bgColor: 'bg-purple-50'
    }
];

// Additional services
const additionalServices = [
    {
        id: 1,
        title: 'Secure Payment',
        description: 'All transactions are secured with industry-standard encryption.',
        icon: <FaCreditCard className="text-2xl text-red-600" />
    },
    {
        id: 2,
        title: 'Technical Support',
        description: 'Expert technical assistance for all products purchased.',
        icon: <BiSupport className="text-2xl text-red-600" />
    },
    {
        id: 3,
        title: 'Warranty Service',
        description: 'Extended warranty options available for most products.',
        icon: <FaShieldAlt className="text-2xl text-red-600" />
    },
    {
        id: 4,
        title: 'Express Delivery',
        description: 'Get your products faster with our express delivery service.',
        icon: <MdOutlineLocalShipping className="text-2xl text-red-600" />
    },
    {
        id: 5,
        title: 'Best Price Guarantee',
        description: 'We match prices for identical products from other retailers.',
        icon: <FaThumbsUp className="text-2xl text-red-600" />
    },
    {
        id: 6,
        title: 'Gift Wrapping',
        description: 'Special gift wrapping service available upon request.',
        icon: <FaGift className="text-2xl text-red-600" />
    },
    {
        id: 7,
        title: 'Secure Shopping',
        description: 'Shop with confidence with our secure checkout process.',
        icon: <RiSecurePaymentLine className="text-2xl text-red-600" />
    },
    {
        id: 8,
        title: 'Extended Hours',
        description: 'Our physical stores are open late for your convenience.',
        icon: <BiTimeFive className="text-2xl text-red-600" />
    }
];

const Services = () => {
    return (
        <div className='w-full bg-gray-50 min-h-screen pb-16'>
            {/* Header */}
            <div className="h-[81px] flex justify-start items-start bg-gray-100">
                <div className="w-main mx-auto py-4">
                    <h3 className="font-semibold uppercase text-2xl font-main2">Our Services</h3>
                    <Breadcrumb category="services" />
                </div>
            </div>

            {/* Main Services Section */}
            <div className="w-main mx-auto mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {mainServices.map((service) => (
                        <div
                            key={service.id}
                            className={`${service.bgColor} p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden group`}
                        >
                            <div className="relative z-10">
                                <div className="mb-4">{service.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-200 to-transparent rounded-bl-full opacity-50 transition-transform duration-300 transform translate-x-8 -translate-y-8 group-hover:translate-x-4 group-hover:-translate-y-4"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shipping Process */}
            <div className="w-main mx-auto mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Our Shipping Process</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We ensure that your products are delivered to you in the most efficient and secure way possible.
                    </p>
                </div>

                <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-200 z-0 hidden md:block"></div>

                    <div className="space-y-0 md:space-y-0">
                        {/* Step 1 */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-12 relative">
                            <div className="md:w-1/3 z-10 order-2 md:order-1 text-right">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Processing</h3>
                                <p className="text-gray-600">Your order is verified and processed within 24 hours of placement.</p>
                            </div>

                            <div className="z-10 order-1 md:order-2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xl shadow-lg">
                                1
                            </div>

                            <div className="md:w-1/3 order-3 hidden md:block"></div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-12 relative">
                            <div className="md:w-1/3 order-1 hidden md:block"></div>

                            <div className="z-10 order-1 md:order-2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xl shadow-lg">
                                2
                            </div>

                            <div className="md:w-1/3 z-10 order-2 md:order-3 text-left">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Packaging</h3>
                                <p className="text-gray-600">Products are carefully packed with eco-friendly materials for maximum protection.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-12 relative">
                            <div className="md:w-1/3 z-10 order-2 md:order-1 text-right">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Shipping</h3>
                                <p className="text-gray-600">Your package is dispatched with our trusted courier partners for timely delivery.</p>
                            </div>

                            <div className="z-10 order-1 md:order-2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xl shadow-lg">
                                3
                            </div>

                            <div className="md:w-1/3 order-3 hidden md:block"></div>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative">
                            <div className="md:w-1/3 order-1 hidden md:block"></div>

                            <div className="z-10 order-1 md:order-2 bg-red-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xl shadow-lg">
                                4
                            </div>

                            <div className="md:w-1/3 z-10 order-2 md:order-3 text-left">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Delivery</h3>
                                <p className="text-gray-600">Your products are delivered to your doorstep with confirmation of receipt.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Services */}
            <div className="w-main mx-auto mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Additional Services</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We offer a range of additional services to make your shopping experience more enjoyable.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {additionalServices.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-t-4 border-red-500 hover:transform hover:-translate-y-1"
                        >
                            <div className="mb-4">{service.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                            <p className="text-gray-600 text-sm">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact CTA */}
            <div className="w-main mx-auto mt-20 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 py-12 sm:p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Need Help with Our Services?</h2>
                    <p className="mb-8 max-w-2xl mx-auto text-white text-opacity-90">
                        Our customer service team is ready to assist you with any questions or concerns you may have.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-8 py-3 bg-white text-red-600 font-semibold rounded-md shadow-md hover:bg-gray-50 transition-colors duration-300"
                    >
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Services;