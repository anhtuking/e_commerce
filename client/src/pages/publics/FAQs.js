import React, { useState } from 'react';
import { Breadcrumb } from 'components';
import { FaPlus, FaMinus, FaHeadset } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

// FAQ categories
const categories = [
    { id: 'general', name: 'Thông tin chung', icon: '🛒' },
    { id: 'orders', name: 'Đơn hàng & Giao hàng', icon: '📦' },
    { id: 'payments', name: 'Thanh toán & Giá cả', icon: '💲' },
    { id: 'returns', name: 'Trả hàng & Hoàn tiền', icon: '↩️' },
    { id: 'account', name: 'Tài khoản & Quyền riêng tư', icon: '👤' },
    { id: 'products', name: 'Sản phẩm', icon: '📱' }
];

// FAQ data
const faqData = {
    general: [
        {
            question: 'Marseille là gì?',
            answer: 'Marseille là nền tảng thương mại điện tử chuyên về sản phẩm công nghệ bao gồm điện thoại, máy tính bảng, máy tính xách tay, phụ kiện và nhiều hơn nữa. Chúng tôi cung cấp giá cả cạnh tranh, sản phẩm chính hãng và dịch vụ khách hàng tốt nhất.'
        },
        {
            question: 'Tất cả sản phẩm có phải chính hãng không?',
            answer: 'Đúng, tất cả sản phẩm bán trên Marseille đều 100% chính hãng và được cung cấp trực tiếp từ nhà phân phối hoặc nhà sản xuất được cấp phép. Chúng tôi cam kết đảm bảo tính chính hãng của tất cả sản phẩm mà chúng tôi bán.'
        },
        {
            question: 'Do bạn giao hàng quốc tế?',
            answer: 'Hiện tại, chúng tôi chỉ giao hàng trong nước. Chúng tôi đang làm việc để mở rộng dịch vụ giao hàng đến các quốc gia khác trong khu vực Đông Nam Á trong tương lai gần.'
        },
        {
            question: 'Làm thế nào để liên hệ với hỗ trợ khách hàng?',
            answer: 'Bạn có thể liên hệ với đội hỗ trợ khách hàng của chúng tôi qua email tại support@marseille.com, qua điện thoại tại 1-800-MARSEILLE, hoặc qua tính năng chat trực tiếp trên trang web của chúng tôi. Đội ngũ hỗ trợ của chúng tôi sẵn sàng hỗ trợ bạn 24/7.'
        }
    ],
    orders: [
        {
            question: 'Làm thế nào để theo dõi đơn hàng của tôi?',
            answer: 'Bạn có thể theo dõi đơn hàng của mình bằng cách đăng nhập vào tài khoản của mình và truy cập phần "Lịch sử đơn hàng". Ngoài ra, bạn có thể sử dụng số theo dõi đơn hàng được cung cấp trong email xác nhận đơn hàng của bạn để theo dõi gói hàng trên trang web của chúng tôi hoặc trang web của đối tác vận chuyển.'
        },
        {
            question: 'Thời gian giao hàng bao lâu?',
            answer: 'Thời gian giao hàng khác nhau tùy thuộc vào vị trí của bạn và phương thức vận chuyển được chọn. Vận chuyển tiêu chuẩn thường mất 3-5 ngày làm việc, trong khi vận chuyển nhanh có thể giao hàng trong 1-2 ngày làm việc. Bạn có thể xem thời gian giao hàng dự kiến trong quá trình thanh toán.'
        },
        {
            question: 'Có thể thay đổi hoặc hủy đơn hàng sau khi đặt không?',
            answer: 'Bạn có thể sửa đổi hoặc hủy đơn hàng trong vòng 1 giờ sau khi đặt. Sau đó, nếu đơn hàng đã được xử lý, bạn cần liên hệ với đội hỗ trợ khách hàng của chúng tôi để giúp đỡ bạn với bất kỳ thay đổi nào hoặc xử lý trả hàng khi bạn nhận được mặt hàng.'
        },
        {
            question: 'Bạn có cung cấp giao hàng ngay lập tức không?',
            answer: 'Giao hàng ngay lập tức có sẵn cho các sản phẩm chọn lọc trong các thành phố lớn. Tính hợp lệ của giao hàng ngay lập tức sẽ được hiển thị trên trang sản phẩm và trong quá trình thanh toán nếu vị trí của bạn đáp ứng được.'
        }
    ],
    payments: [
        {
            question: 'Bạn chấp nhận phương thức thanh toán nào?',
            answer: 'Chúng tôi chấp nhận nhiều phương thức thanh toán khác nhau bao gồm thẻ tín dụng/thẻ ghi nợ (Visa, Mastercard, American Express), PayPal, chuyển khoản ngân hàng và thanh toán khi nhận hàng (COD) cho các khu vực đáp ứng được. Tất cả thông tin thanh toán được xử lý an toàn.'
        },
        {
            question: 'Có bất kỳ phí thêm hoặc thuế nào không?',
            answer: 'Giá sản phẩm trên trang web của chúng tôi đã bao gồm VAT. Các phí thêm như chi phí vận chuyển hoặc phí thanh toán khi nhận hàng (nếu áp dụng) sẽ được hiển thị rõ ràng trong quá trình thanh toán trước khi bạn hoàn tất đơn hàng.'
        },
        {
            question: 'An toàn khi sử dụng thẻ tín dụng trên trang web của bạn?',
            answer: 'Đúng, trang web của chúng tôi sử dụng mã hóa công nghiệp chuẩn để bảo vệ thông tin cá nhân và thông tin thanh toán của bạn. Chúng tôi không lưu trữ thông tin thẻ tín dụng của bạn trên máy chủ của chúng tôi. Tất cả xử lý thanh toán được xử lý bởi các bộ xử lý thanh toán an toàn, đáp ứng PCI-DSS.'
        },
        {
            question: 'Có thể yêu cầu hóa đơn VAT cho đơn hàng của tôi không?',
            answer: 'Đúng, bạn có thể yêu cầu hóa đơn VAT trong quá trình thanh toán bằng cách chọn tùy chọn "Yêu cầu hóa đơn VAT" và cung cấp thông tin công ty của bạn. Hóa đơn sẽ được gửi đến email của bạn sau khi đơn hàng được xác nhận.'
        }
    ],
    returns: [
        {
            question: 'Chính sách trả hàng của bạn là gì?',
            answer: 'Chúng tôi cung cấp chính sách trả hàng 30 ngày cho hầu hết sản phẩm. Mặt hàng phải ở trạng thái gốc với tất cả bao bì và phụ kiện. Một số sản phẩm như tai nghe và phần mềm có thể có điều kiện trả hàng khác do lý do vệ sinh hoặc giấy phép.'
        },
        {
            question: 'Làm thế nào để khởi chạy trả hàng hoặc đổi hàng?',
            answer: 'Để khởi chạy trả hàng hoặc đổi hàng, đăng nhập vào tài khoản của bạn, đi đến "Lịch sử đơn hàng," chọn đơn hàng chứa mặt hàng bạn muốn trả, và thực hiện theo hướng dẫn trả hàng. Ngoài ra, bạn có thể liên hệ với đội hỗ trợ khách hàng của chúng tôi để được trợ giúp.'
        },
        {
            question: 'Ai trả phí vận chuyển trả hàng?',
            answer: 'Nếu trả hàng là do sản phẩm hư hỏng, mặt hàng không chính xác hoặc lỗi của chúng tôi, chúng tôi sẽ bù đắp chi phí vận chuyển trả hàng. Nếu bạn trả hàng do lý do khác (ví dụ: thay đổi ý muốn), bạn sẽ chịu chi phí vận chuyển trả hàng.'
        },
        {
            question: 'Thời gian xử lý hoàn tiền là bao lâu?',
            answer: 'Sau khi nhận được mặt hàng trả lại và xác nhận điều kiện của nó, hoàn tiền thường được xử lý trong vòng 3-5 ngày làm việc. Thời gian để hoàn tiền xuất hiện trong tài khoản của bạn phụ thuộc vào phương thức thanh toán và tổ chức tài chính của bạn, thường là 5-10 ngày làm việc.'
        }
    ],
    account: [
        {
            question: 'Làm thế nào để tạo tài khoản?',
            answer: 'Bạn có thể tạo tài khoản bằng cách nhấp vào nút "Đăng ký" hoặc "Đăng ký" ở phía trên trang web của chúng tôi. Bạn sẽ cần cung cấp địa chỉ email của mình, tạo mật khẩu và điền vào một số thông tin cơ bản để hoàn tất quá trình đăng ký.'
        },
        {
            question: 'Làm thế nào để đặt lại mật khẩu?',
            answer: 'Để đặt lại mật khẩu của bạn, nhấp vào nút "Đăng nhập", sau đó chọn "Quên mật khẩu." Nhập địa chỉ email liên kết với tài khoản của bạn, và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu. Theo hướng dẫn trong email để tạo mật khẩu mới.'
        },
        {
            question: 'Bạn bảo vệ thông tin cá nhân của tôi như thế nào?',
            answer: 'Chúng tôi đối xử với bảo mật dữ liệu nghiêm túc và tuân thủ tất cả các quy định bảo mật liên quan. Thông tin cá nhân của bạn được mã hóa và lưu trữ an toàn. Chúng tôi không bán dữ liệu của bạn cho bên thứ ba. Bạn có thể đọc chính sách bảo mật chi tiết của chúng tôi trên trang web của chúng tôi.'
        },
        {
            question: 'Tôi có thể xóa tài khoản của mình không?',
            answer: 'Đúng, bạn có thể yêu cầu xóa tài khoản của mình. Vui lòng liên hệ với đội hỗ trợ khách hàng của chúng tôi, và họ sẽ hướng dẫn bạn qua quá trình xóa tài khoản. Lưu ý rằng xóa tài khoản sẽ xóa lịch sử đơn hàng và thông tin đã lưu của bạn.'
        }
    ],
    products: [
        {
            question: 'Bạn cung cấp bảo hành cho sản phẩm không?',
            answer: 'Đúng, tất cả sản phẩm đều có bảo hành nhà sản xuất. Thời hạn bảo hành khác nhau tùy theo sản phẩm và thương hiệu, từ 12 đến 36 tháng. Thời hạn bảo hành cụ thể được liệt kê trong phần "Thông tin bảo hành" trên trang sản phẩm.'
        },
        {
            question: 'Các thông số sản phẩm có giống như phiên bản quốc tế không?',
            answer: 'Trong hầu hết các trường hợp, có. Tuy nhiên, một số sản phẩm có thể có sự khác biệt nhỏ về thông số so với phiên bản quốc tế do yêu cầu và chính sách của nhà sản xuất.'
        },
        {
            question: 'Bạn bán sản phẩm đã qua sử dụng hoặc đã qua sử dụng không?',
            answer: 'Chúng tôi chủ yếu bán sản phẩm mới. Khi chúng tôi cung cấp sản phẩm đã qua sử dụng, chúng được rõ ràng ghi nhãn là như vậy và có bảo hành đặc biệt. Chúng tôi không bán sản phẩm đã qua sử dụng hoặc đã qua sử dụng.'
        },
        {
            question: 'Làm thế nào để kiểm tra sản phẩm có tồn kho không?',
            answer: 'Tình trạng tồn kho được hiển thị trên mỗi trang sản phẩm. Nếu sản phẩm có tồn kho, bạn sẽ thấy nút "Thêm vào giỏ hàng". Nếu nó hết hàng, bạn có thể chọn "Thông báo cho tôi" để nhận được email khi sản phẩm trở lại có hàng.'
        }
    ]
};

const FAQs = () => {
    const [activeCategory, setActiveCategory] = useState('general');
    const [openItems, setOpenItems] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFAQs, setFilteredFAQs] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const toggleQuestion = (categoryId, index) => {
        setOpenItems(prev => ({
            ...prev,
            [`${categoryId}-${index}`]: !prev[`${categoryId}-${index}`]
        }));
    };

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId);
        setIsSearching(false);
        setSearchTerm('');
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.length > 2) {
            setIsSearching(true);

            // Search through all categories
            const results = [];
            Object.keys(faqData).forEach(category => {
                faqData[category].forEach((faq, index) => {
                    if (
                        faq.question.toLowerCase().includes(term.toLowerCase()) ||
                        faq.answer.toLowerCase().includes(term.toLowerCase())
                    ) {
                        results.push({
                            ...faq,
                            category,
                            index
                        });
                    }
                });
            });

            setFilteredFAQs(results);
        } else {
            setIsSearching(false);
        }
    };

    return (
        <div className="w-full bg-gray-50 min-h-screen pb-16">
            {/* Header */}
            <div className="h-[81px] flex justify-start items-start bg-gray-100">
                <div className="w-main mx-auto py-4">
                    <h3 className="flex font-semibold uppercase text-2xl font-main2">FAQs</h3>
                    <Breadcrumb category="faqs" />
                </div>
            </div>

            {/* Search Bar */}
            <div className="w-main mx-auto mt-6">
                <p className=" text-gray-400 text-sm mb-2">
                    Tìm câu trả lời cho các câu hỏi thường gặp về sản phẩm, dịch vụ, vận chuyển và nhiều hơn nữa.
                </p>
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Tìm câu trả lời cho các câu hỏi..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                    <BiSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                </div>
            </div>

            {/* FAQ Content */}
            <div className="w-main mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Categories */}
                    <div className="md:w-1/4">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh mục FAQ</h3>
                            <ul className="space-y-2">
                                {categories.map((category) => (
                                    <li key={category.id}>
                                        <button
                                            onClick={() => handleCategoryClick(category.id)}
                                            className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 flex items-center ${activeCategory === category.id && !isSearching
                                                ? 'bg-red-100 text-red-700 font-medium'
                                                : 'hover:bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <span className="mr-2">{category.icon}</span>
                                            {category.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Need more help section */}
                            <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-lg border border-red-100">
                                <div className="flex items-center mb-3">
                                    <FaHeadset className="text-red-600 text-xl mr-2" />
                                    <h4 className="font-medium text-gray-800">Cần thêm trợ giúp?</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Không tìm thấy câu trả lời bạn đang tìm kiếm? Liên hệ với đội hỗ trợ của chúng tôi.
                                </p>
                                <a
                                    href="/"
                                    className="inline-block w-full text-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
                                >
                                    Liên hệ hỗ trợ
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* FAQ Questions */}
                    <div className="md:w-3/4">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            {isSearching ? (
                                <>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                        Kết quả tìm kiếm {filteredFAQs.length > 0 && `(${filteredFAQs.length})`}
                                    </h2>

                                    {filteredFAQs.length > 0 ? (
                                        <div className="border-b border-gray-200 last:border-b-0">
                                            {filteredFAQs.map((faq, index) => (
                                                <div key={`search-${index}`} className="py-4">
                                                    <button
                                                        onClick={() => toggleQuestion(faq.category, faq.index)}
                                                        className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-red-600 transition-colors duration-200"
                                                    >
                                                        <span>{faq.question}</span>
                                                        <span className="ml-2">
                                                            {openItems[`${faq.category}-${faq.index}`] ? (
                                                                <FaMinus className="text-red-600" />
                                                            ) : (
                                                                <FaPlus className="text-gray-500" />
                                                            )}
                                                        </span>
                                                    </button>
                                                    {openItems[`${faq.category}-${faq.index}`] && (
                                                        <div className="mt-3 text-gray-600 pr-4">
                                                            {faq.answer}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-600 mb-4">Không tìm thấy kết quả cho "{searchTerm}"</p>
                                            <p className="text-sm text-gray-500">
                                                Thử sử dụng từ khóa khác hoặc duyệt qua danh mục bên trái.
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                                        {categories.find(cat => cat.id === activeCategory)?.name}
                                    </h2>

                                    <div className="border-b border-gray-200 last:border-b-0">
                                        {faqData[activeCategory].map((faq, index) => (
                                            <div key={`${activeCategory}-${index}`} className="py-4">
                                                <button
                                                    onClick={() => toggleQuestion(activeCategory, index)}
                                                    className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-red-600 transition-colors duration-200"
                                                >
                                                    <span>{faq.question}</span>
                                                    <span className="ml-2">
                                                        {openItems[`${activeCategory}-${index}`] ? (
                                                            <FaMinus className="text-red-600" />
                                                        ) : (
                                                            <FaPlus className="text-gray-500" />
                                                        )}
                                                    </span>
                                                </button>
                                                {openItems[`${activeCategory}-${index}`] && (
                                                    <div className="mt-3 text-gray-600 pr-4">
                                                        {faq.answer}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="w-main mx-auto mt-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 py-10 sm:p-10 text-center text-white">
                    <h2 className="text-2xl font-bold mb-4">Vẫn còn câu hỏi?</h2>
                    <p className="mb-6 max-w-2xl mx-auto text-white text-opacity-90">
                        Đội ngũ hỗ trợ khách hàng của chúng tôi sẵn sàng trả lời bất kỳ câu hỏi nào bạn có.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/"
                            className="inline-block px-6 py-3 bg-white text-red-600 font-semibold rounded-md shadow-md hover:bg-gray-50 transition-colors duration-300"
                        >
                            Liên hệ chúng tôi
                        </a>
                        <a
                            href="/"
                            className="inline-block px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
                        >
                            Chat trực tiếp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQs;