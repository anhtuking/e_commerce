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
        title: 'Giao hàng miễn phí',
        description: 'Giao hàng miễn phí trên tất cả đơn hàng trên 2,000,000 VND.',
        icon: <FaShippingFast className="text-3xl md:text-4xl text-red-600" />,
        bgColor: 'bg-red-50'
    },
    {
        id: 2,
        title: 'Hoàn tiền 100%',
        description: 'Hoàn tiền 100% trong vòng 30 ngày khi mua hàng.',
        icon: <FaHandHoldingUsd className="text-3xl md:text-4xl text-red-600" />,
        bgColor: 'bg-blue-50'
    },
    {
        id: 3,
        title: 'Hỗ trợ 24/7',
        description: 'Đội ngũ hỗ trợ của chúng tôi sẵn sàng hỗ trợ bạn 24/7.',
        icon: <FaHeadset className="text-3xl md:text-4xl text-red-600" />,
        bgColor: 'bg-green-50'
    },
    {
        id: 4,
        title: 'Trả hàng dễ dàng',
        description: 'Chính sách trả hàng dễ dàng cho tất cả sản phẩm được phép.',
        icon: <FaExchangeAlt className="text-3xl md:text-4xl text-red-600" />,
        bgColor: 'bg-purple-50'
    }
];

// Additional services
const additionalServices = [
    {
        id: 1,
        title: 'Thanh toán an toàn',
        description: 'Tất cả giao dịch được bảo mật bằng mã hóa công nghiệp.',
        icon: <FaCreditCard className="text-2xl text-red-600" />
    },
    {
        id: 2,
        title: 'Hỗ trợ kỹ thuật',
        description: 'Hỗ trợ kỹ thuật chuyên nghiệp cho tất cả sản phẩm đã mua.',
        icon: <BiSupport className="text-2xl text-red-600" />
    },
    {
        id: 3,
        title: 'Dịch vụ bảo hành',
        description: 'Các tùy chọn bảo hành được mở rộng cho hầu hết sản phẩm.',
        icon: <FaShieldAlt className="text-2xl text-red-600" />
    },
    {
        id: 4,
        title: 'Giao hàng nhanh',
        description: 'Nhận sản phẩm nhanh hơn với dịch vụ giao hàng nhanh của chúng tôi.',
        icon: <MdOutlineLocalShipping className="text-2xl text-red-600" />
    },
    {
        id: 5,
        title: 'Bảo hành tốt nhất',
        description: 'Chúng tôi không bảo hành sản phẩm tốt nhất từ các nhà bán lẻ khác.',
        icon: <FaThumbsUp className="text-2xl text-red-600" />
    },
    {
        id: 6,
        title: 'Bao bì đẹp',
        description: 'Dịch vụ bao bì đẹp được cung cấp theo yêu cầu.',
        icon: <FaGift className="text-2xl text-red-600" />
    },
    {
        id: 7,
        title: 'Thanh toán an toàn',
        description: 'Mua hàng với tự tin với quy trình thanh toán an toàn của chúng tôi.',
        icon: <RiSecurePaymentLine className="text-2xl text-red-600" />
    },
    {
        id: 8,
        title: 'Giờ làm việc',
        description: 'Cửa hàng của chúng tôi mở cửa muộn để thuận tiện cho bạn.',
        icon: <BiTimeFive className="text-2xl text-red-600" />
    }
];

const Services = () => {
    return (
        <div className='w-full bg-gray-50 min-h-screen pb-16'>
            {/* Header */}
            <div className="h-[81px] flex justify-start items-start bg-gray-100">
                <div className="w-main mx-auto py-4">
                    <h3 className="font-semibold uppercase text-2xl font-main2">Dịch vụ của chúng tôi</h3>
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
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Quy trình giao hàng của chúng tôi</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Chúng tôi đảm bảo rằng sản phẩm của bạn được giao đến bạn trong cách hiệu quả và an toàn nhất có thể.
                    </p>
                </div>

                <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-red-200 z-0 hidden md:block"></div>

                    <div className="space-y-0 md:space-y-0">
                        {/* Step 1 */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-12 relative">
                            <div className="md:w-1/3 z-10 order-2 md:order-1 text-right">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Xử lý đơn hàng</h3>
                                <p className="text-gray-600">Đơn hàng của bạn được xác nhận và xử lý trong vòng 24 giờ.</p>
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
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Bao bì</h3>
                                <p className="text-gray-600">Sản phẩm được cẩn thận đóng gói với vật liệu bền và bền bỉ cho bảo vệ tối đa.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-12 relative">
                            <div className="md:w-1/3 z-10 order-2 md:order-1 text-right">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Giao hàng</h3>
                                <p className="text-gray-600">Hàng hóa của bạn được giao đến bạn với độ tin cậy của đối tác vận chuyển của chúng tôi.</p>
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
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Giao hàng</h3>
                                <p className="text-gray-600">Sản phẩm của bạn được giao đến cửa nhà bạn với xác nhận nhận hàng.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Services */}
            <div className="w-main mx-auto mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4">Dịch vụ bổ sung</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Chúng tôi cung cấp một loạt dịch vụ bổ sung để làm cho trải nghiệm mua hàng của bạn trở nên thêm thú vị.
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
                    <h2 className="text-3xl font-bold mb-4">Cần trợ giúp với dịch vụ của chúng tôi?</h2>
                    <p className="mb-8 max-w-2xl mx-auto text-white text-opacity-90">
                        Đội ngũ hỗ trợ khách hàng của chúng tôi sẵn sàng giúp đỡ bạn với bất kỳ câu hỏi hoặc lo ngại nào.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-8 py-3 bg-white text-red-600 font-semibold rounded-md shadow-md hover:bg-gray-50 transition-colors duration-300"
                    >
                        Liên hệ với chúng tôi
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Services;