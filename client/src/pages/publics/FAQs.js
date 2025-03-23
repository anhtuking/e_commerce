import React, { useState } from 'react';
import { Breadcrumb } from 'components';
import { FaPlus, FaMinus, FaHeadset } from 'react-icons/fa';
import { BiSearch } from 'react-icons/bi';

// FAQ categories
const categories = [
    { id: 'general', name: 'General Information', icon: '🛒' },
    { id: 'orders', name: 'Orders & Shipping', icon: '📦' },
    { id: 'payments', name: 'Payments & Pricing', icon: '💲' },
    { id: 'returns', name: 'Returns & Refunds', icon: '↩️' },
    { id: 'account', name: 'Account & Privacy', icon: '👤' },
    { id: 'products', name: 'Products', icon: '📱' }
];

// FAQ data
const faqData = {
    general: [
        {
            question: 'What is Digital World?',
            answer: 'Digital World is an e-commerce platform specializing in technology products including smartphones, laptops, tablets, accessories and more. We offer competitive prices, authentic products, and excellent customer service.'
        },
        {
            question: 'Are all products authentic?',
            answer: 'Yes, all products sold on Digital World are 100% authentic and sourced directly from authorized distributors or manufacturers. We guarantee the authenticity of every product we sell.'
        },
        {
            question: 'Do you ship internationally?',
            answer: 'Currently, we only ship within Vietnam. We\'re working on expanding our shipping services to other countries in Southeast Asia in the near future.'
        },
        {
            question: 'How can I contact customer support?',
            answer: 'You can contact our customer support team through email at support@digitalworld.com, by phone at 1-800-DIGITAL, or through the live chat feature on our website. Our team is available 24/7 to assist you.'
        }
    ],
    orders: [
        {
            question: 'How do I track my order?',
            answer: 'You can track your order by logging into your account and visiting the "Order History" section. Alternatively, you can use the tracking number provided in your order confirmation email to track your package on our website or the courier\'s website.'
        },
        {
            question: 'How long will it take to receive my order?',
            answer: 'Delivery times vary based on your location and the shipping method selected. Standard shipping typically takes 3-5 business days, while express shipping can deliver within 1-2 business days. You can see the estimated delivery time during checkout.'
        },
        {
            question: 'Can I change or cancel my order after placing it?',
            answer: 'You can modify or cancel your order within 1 hour of placing it. After that, if the order has been processed, you\'ll need to contact our customer support team to assist you with any changes or to process a return once you receive the item.'
        },
        {
            question: 'Do you offer same-day delivery?',
            answer: 'Same-day delivery is available for select products in major cities. Eligibility for same-day delivery will be displayed on the product page and during checkout if your location qualifies.'
        }
    ],
    payments: [
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept various payment methods including credit/debit cards (Visa, Mastercard, American Express), PayPal, bank transfers, and cash on delivery (COD) for eligible areas. All payment information is securely processed.'
        },
        {
            question: 'Are there any additional fees or taxes?',
            answer: 'Product prices shown on our website include VAT. Additional fees such as shipping costs or COD fees (if applicable) will be clearly displayed during the checkout process before you complete your order.'
        },
        {
            question: 'Is it safe to use my credit card on your website?',
            answer: 'Yes, our website uses industry-standard SSL encryption to protect your personal and payment information. We do not store your credit card details on our servers. All payment processing is handled by secure, PCI-compliant payment processors.'
        },
        {
            question: 'Can I get a VAT invoice for my purchase?',
            answer: 'Yes, you can request a VAT invoice during checkout by selecting the "Request VAT Invoice" option and providing your company details. The invoice will be sent to your email after your order is confirmed.'
        }
    ],
    returns: [
        {
            question: 'What is your return policy?',
            answer: 'We offer a 30-day return policy for most products. Items must be in their original condition with all packaging and accessories. Some products like earphones and software may have different return conditions for hygiene or licensing reasons.'
        },
        {
            question: 'How do I initiate a return or exchange?',
            answer: 'To initiate a return or exchange, log into your account, go to "Order History," select the order containing the item you wish to return, and follow the return instructions. Alternatively, you can contact our customer support team for assistance.'
        },
        {
            question: 'Who pays for return shipping?',
            answer: 'If the return is due to a defective product, incorrect item, or our error, we will cover the return shipping costs. If you\'re returning the item for other reasons (e.g., change of mind), you will be responsible for the return shipping costs.'
        },
        {
            question: 'How long does it take to process a refund?',
            answer: 'Once we receive your returned item and verify its condition, refunds are typically processed within 3-5 business days. The time it takes for the refund to appear in your account depends on your payment method and financial institution, usually 5-10 business days.'
        }
    ],
    account: [
        {
            question: 'How do I create an account?',
            answer: 'You can create an account by clicking on the "Sign Up" or "Register" button at the top of our website. You\'ll need to provide your email address, create a password, and fill in some basic information to complete the registration process.'
        },
        {
            question: 'How can I reset my password?',
            answer: 'To reset your password, click on the "Login" button, then select "Forgot Password." Enter the email address associated with your account, and we\'ll send you a link to reset your password. Follow the instructions in the email to create a new password.'
        },
        {
            question: 'How do you protect my personal information?',
            answer: 'We take data protection seriously and comply with all applicable privacy laws. Your personal information is encrypted and securely stored. We do not sell your data to third parties. You can review our detailed privacy policy on our website.'
        },
        {
            question: 'Can I delete my account?',
            answer: 'Yes, you can request to delete your account. Please contact our customer support team, and they will guide you through the account deletion process. Note that deleting your account will permanently remove your order history and saved information.'
        }
    ],
    products: [
        {
            question: 'Do you offer warranty on products?',
            answer: 'Yes, all products come with a manufacturer\'s warranty. Warranty periods vary by product and brand, ranging from 12 to 36 months. The specific warranty duration is listed on each product page under the "Warranty Information" section.'
        },
        {
            question: 'Are the product specifications the same as the international versions?',
            answer: 'In most cases, yes. However, some products may have slight variations in specifications compared to international versions due to regional requirements or manufacturer policies. These differences, if any, are clearly noted on the product pages.'
        },
        {
            question: 'Do you sell refurbished or second-hand products?',
            answer: 'We primarily sell brand new products. When we do offer refurbished products, they are clearly labeled as such and come with a special warranty. We do not sell second-hand or used products.'
        },
        {
            question: 'How can I check if a product is in stock?',
            answer: 'Product availability is displayed on each product page. If a product is in stock, you\'ll see an "Add to Cart" button. If it\'s out of stock, you can select "Notify Me" to receive an email when the product becomes available again.'
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
                    Find answers to common questions about our products, services, shipping, and more.
                </p>
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Search for questions..."
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
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">FAQ Categories</h3>
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
                                    <h4 className="font-medium text-gray-800">Need More Help?</h4>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    Can't find the answer you're looking for? Contact our support team.
                                </p>
                                <a
                                    href="/"
                                    className="inline-block w-full text-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-200"
                                >
                                    Contact Support
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
                                        Search Results {filteredFAQs.length > 0 && `(${filteredFAQs.length})`}
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
                                            <p className="text-gray-600 mb-4">No results found for "{searchTerm}"</p>
                                            <p className="text-sm text-gray-500">
                                                Try using different keywords or browse the categories on the left.
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
                    <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
                    <p className="mb-6 max-w-2xl mx-auto text-white text-opacity-90">
                        Our customer service team is available 24/7 to answer any questions you may have.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="#"
                            className="inline-block px-6 py-3 bg-white text-red-600 font-semibold rounded-md shadow-md hover:bg-gray-50 transition-colors duration-300"
                        >
                            Contact Us
                        </a>
                        <a
                            href="#"
                            className="inline-block px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
                        >
                            Live Chat
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQs;