import withBase from 'hocs/withBase';
import React, { memo } from 'react';
import { FiShoppingCart, FiX, FiTrash2, FiChevronRight, FiPackage } from 'react-icons/fi';
import { BsTruck } from 'react-icons/bs';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { showCart } from 'store/app/appSlice';
import { formatPrice } from 'utils/helpers';
import { apiRemoveCart } from 'api/user';
import { getCurrent } from 'store/user/asyncAction';
import { toast } from 'react-toastify';
import path from 'utils/path';

const Cart = ({ dispatch, navigate }) => {
    const { currentCart } = useSelector(state => state.user);

    const handleRemoveFromCart = async (pid, color) => {
        const response = await apiRemoveCart(pid, color)
        if (response.success) {
            dispatch(getCurrent())
        } else {
            toast.error(response.mes)
        }
    };

    const getCartTotal = () => {
        return currentCart?.reduce((total, item) => {
            return total + (item.product?.price * item.quantity || 0);
        }, 0) || 0;
    };

    const handleCheckout = () => {
        dispatch(showCart());
        navigate(`/${path.MEMBER}/${path.MY_CART}`);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[50000] flex justify-end transition-all duration-300 backdrop-blur-sm">
            <div
                className="w-full max-w-md h-screen bg-white shadow-xl grid grid-rows-[auto_1fr_auto] animate-slide-left relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cart Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="bg-white bg-opacity-20 p-2 rounded-full mr-3">
                            <FiShoppingCart className="text-xl" size={25} />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg flex">YOUR CART
                                <div className="ml-3 bg-white text-red-600 rounded-full h-7 w-7 flex items-center justify-center text-xs font-bold shadow-md">
                                    {currentCart?.length || 0}
                                </div>
                            </h2>

                            <p className="text-xs text-red-100">Product information has been added to your cart.</p>
                        </div>
                    </div>
                    <button
                        className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
                        onClick={() => dispatch(showCart({ signal: false }))}
                    >
                        <FiX className="text-xl" />
                    </button>
                </div>

                {/* Cart Body */}
                <div className="overflow-y-auto p-4 bg-gray-50">
                    {/* Shipping & Payment Info */}
                    <div className="bg-red-50 rounded-lg p-3 mb-4 border border-red-100">
                        <div className="flex items-center gap-3 mb-2">
                            <BsTruck className="text-red-500" />
                            <span className="text-sm text-gray-700">Free shipping on orders over 2,000,000 VND</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <RiSecurePaymentLine className="text-red-500" />
                            <span className="text-sm text-gray-700">Secure payment & money back guarantee</span>
                        </div>
                    </div>
                    {(!currentCart || currentCart?.length === 0) && <span>
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 p-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <FiShoppingCart className="text-4xl text-gray-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
                            <p className="text-sm text-center mb-8 text-gray-500">Looks like you haven't added any products to your cart yet.</p>
                            <button
                                onClick={() => dispatch(showCart({ signal: false }))}
                                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </span>}
                    <div className="space-y-4">
                        {currentCart && currentCart?.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-lg shadow-sm p-4 flex gap-4 border border-gray-100 hover:border-red-200 transition-all duration-200 group relative"
                            >
                                {/* Product Image */}
                                <div className="relative rounded-md overflow-hidden">
                                    <img
                                        src={item.thumbnail || "https://via.placeholder.com/80"}
                                        alt={item.title}
                                        className="w-20 h-20 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800 line-clamp-1 group-hover:text-red-600 transition-colors duration-200">{item.title}</h3>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">Color: {item.color || 'Default'}</span>
                                    </div>
                                    <div className="flex items-center justify-end mt-3">
                                        <div className="text-red-600 font-bold">
                                            {formatPrice(item.price)} VND
                                        </div>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <span
                                    onClick={() => handleRemoveFromCart(item.product?._id, item.color)}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer"
                                >
                                    <FiTrash2 size={16} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart Footer */}
                {currentCart && currentCart?.length > 0 && (
                    <div className="bg-white border-t border-gray-200 pt-4 pb-4 px-4 shadow-md">
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1 text-sm">
                                <span className="text-gray-500">Subtotal ({currentCart?.length} items):</span>
                                <span className="font-medium text-gray-700">{formatPrice(getCartTotal())} VND</span>
                            </div>

                            <div className="flex items-center justify-between mb-4 text-sm">
                                <span className="text-gray-500">Shipping:</span>
                                <span className="font-medium text-green-600">Free</span>
                            </div>

                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-gray-200">
                                <span className="text-gray-800 font-medium">Total:</span>
                                <span className="text-lg font-bold text-red-600">{formatPrice(getCartTotal())} VND</span>
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={handleCheckout}
                                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg transition-all duration-200 shadow flex items-center justify-center gap-2 hover:shadow-lg hover:from-red-600 hover:to-red-700"
                            >
                                <FiPackage className="text-lg" />
                                Proceed to Shopping cart
                                <FiChevronRight />
                            </button>
                            <button
                                onClick={() => dispatch(showCart({ signal: false }))}
                                className="w-full py-2.5 mt-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 hover:bg-gray-50 rounded"
                            >
                                Continue Shopping
                            </button>
                        </div>

                        {/* Payment methods */}
                        <div className="mt-4 px-4 py-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center gap-2">
                            <img src="https://cdn-icons-png.flaticon.com/128/196/196578.png" alt="Visa" className="h-6 opacity-60" />
                            <img src="https://cdn-icons-png.flaticon.com/128/196/196561.png" alt="MasterCard" className="h-6 opacity-60" />
                            <img src="https://cdn-icons-png.flaticon.com/128/196/196566.png" alt="PayPal" className="h-6 opacity-60" />
                            <span className="text-xs text-gray-500 ml-2">Secure Payment</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default withBase(memo(Cart));