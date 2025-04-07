import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { apiGetProduct, apiGetProducts } from 'api/product';
import { Breadcrumb, ProductExtraInfoItem, SelectQuantity, ProductInformation } from 'components';
import CustomSlider from 'components/common/CustomSlider';
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, formatPrice, renderStarFromNumber, addToCartUtil } from 'utils/helpers';
import { productExtraInformation } from 'utils/contants';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import withBase from 'hocs/withBase';
import { useSelector } from 'react-redux';
import path from 'utils/path';
import { apiUpdateCart } from 'api';
import { toast } from 'react-toastify';
import { getCurrent } from 'store/user/asyncAction';
import { FaHeart, FaShoppingCart, FaShippingFast, FaRegCheckCircle, FaArrowLeft, FaEye, FaStore, FaShieldAlt, FaInfoCircle, FaGift, FaHeadset } from 'react-icons/fa';

var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
            }
        }
    ]
};

const DetailProduct = ({ navigate, dispatch }) => {
    const { pid, category } = useParams()
    const location = useLocation();
    const [product, setProduct] = useState(null)
    const { current } = useSelector(state => state.user)
    const [currentImage, setCurrentImage] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProduct, setRelatedProduct] = useState(null)
    const [update, setUpdate] = useState(false)
    const [varriant, setVarriant] = useState(null)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [activeTab, setActiveTab] = useState('description')
    const titleRef = useRef(null)
    const [currentProduct, setCurrentProduct] = useState({
        title: '',
        thumb: '',
        images: [],
        price: '',
        color: ''
    })

    const fetchProductData = async () => {
        const response = await apiGetProduct(pid)
        if (response.success) {
            setProduct(response.dataProduct)
            setCurrentImage(response.dataProduct?.thumb)
        }
    }
    const fetchProducts = async () => {
        const response = await apiGetProducts({ category })
        if (response.success) setRelatedProduct(response.dataProducts)
    }

    useEffect(() => {
        if (varriant) {
            const selectedVariant = product?.varriants?.find(el => el.sku === varriant);
            if (selectedVariant) {
                setCurrentProduct({
                    title: selectedVariant.title,
                    color: selectedVariant.color,
                    images: selectedVariant.images,
                    thumb: selectedVariant.thumb,
                    price: selectedVariant.price,
                });
            }
        } else if (product) {
            setCurrentProduct({
                title: product?.title,
                color: product?.color,
                images: product?.images || [],
                thumb: product?.thumb,
                price: product?.price,
            });
        }
    }, [varriant, product]);

    const rerender = useCallback(() => {
        setUpdate(!update)
    }, [update])

    useEffect(() => {
        if (pid) {
            fetchProductData()
            fetchProducts()
        }
        // window.scrollTo(0, 0)
        if (titleRef.current) {
            titleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }, [pid])

    useEffect(() => {
        if (pid) fetchProductData()
    }, [update])

    const handleQuantity = useCallback((number) => {
        if (!Number(number) || Number(number) < 1) {
            return
        } else setQuantity(number)
    }, [quantity])

    const handleClickImages = (e, el) => {
        e.stopPropagation();
        setCurrentImage(el);
        setCurrentProduct(prev => ({
            ...prev,
            thumb: el
        }));
    }

    const handleChangeQuantity = useCallback((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }, [quantity])

    const handleAddToCart = async () => {
        if (!current) return Swal.fire({
            title: 'Wait...',
            text: 'Please login to add to cart',
            icon: 'info',
            confirmButtonText: 'Login',
            denyButtonText: 'Cancel',
            showDenyButton: true,
            confirmButtonColor: '#3085d6',
        }).then(async (result) => {
            if (result.isConfirmed) navigate(`/${path.LOGIN}?redirect=${location.pathname}`);
        })

        setIsAddingToCart(true);

        const currentVariant = varriant ? product?.varriants?.find(el => el.sku === varriant) : null;
        const cartData = addToCartUtil(product, quantity, currentVariant);

        const response = await apiUpdateCart(cartData);

        setIsAddingToCart(false);

        if (response.success) {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Thêm vào giỏ hàng thành công!',
                text: `${quantity} sản phẩm đã được thêm vào giỏ hàng của bạn`,
                showConfirmButton: false,
                timer: 1500,
                backdrop: 'rgba(0,0,0,0.4)'
            });
            dispatch(getCurrent())
        } else {
            toast.error(response.mes)
        }
    }

    return (
        <div className='w-full bg-gray-50'>
            {/* Header & Breadcrumb */}
            <div className='bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm'>
                <div className='w-main mx-auto px-4 py-6' >
                    <div className='flex items-center gap-2 mb-3'>
                        <button
                            onClick={() => navigate(-1)}
                            className='flex items-center text-gray-600 hover:text-main transition-all text-sm font-medium'
                        >
                            <FaArrowLeft className='mr-2' /> Trở lại
                        </button>
                    </div>
                    <h1 
                        ref={titleRef}
                        className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'
                    >
                        {currentProduct?.title || product?.title}
                    </h1>
                    <div className='flex items-center flex-wrap gap-4 mb-2'>
                        <Breadcrumb title={currentProduct?.title || product?.title} category={category} />
                        <div className='flex items-center gap-2 text-sm text-gray-500'>
                            <FaStore className='text-gray-400' />
                            <span>Official Store</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Product Content */}
            <div className='w-main mx-auto px-4 py-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8'>
                    {/* Product Images */}
                    <div className='lg:col-span-5 flex flex-col gap-4'>
                        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                            <div className='relative border hover:border-main transition-all rounded-lg overflow-hidden group'>
                                <div className='absolute top-2 right-2 z-10 bg-white bg-opacity-80 text-main text-xs font-medium px-2 py-1 rounded-full flex items-center shadow-sm'>
                                    <FaEye className='mr-1' /> {Math.floor(Math.random() * 20) + 5} watching
                                </div>
                                <ReactImageMagnify {...{
                                    smallImage: {
                                        alt: currentProduct?.title || product?.title,
                                        isFluidWidth: true,
                                        src: currentProduct?.thumb || currentImage
                                    },
                                    largeImage: {
                                        src: currentProduct?.thumb || currentImage,
                                        width: 1800,
                                        height: 1500
                                    },
                                    enlargedImagePosition: 'over',
                                    isHintEnabled: true,
                                    shouldHideHintAfterFirstActivation: false,
                                    hintTextMouse: 'Hover to zoom'
                                }} />
                            </div>
                        </div>
                        <div className='mt-4'>
                            <Slider {...settings} className='product-thumbnails'>
                                {currentProduct.images.length === 0 && product?.images?.map((el, index) => (
                                    <div className='px-1' key={el}>
                                        <div
                                            onClick={e => handleClickImages(e, el)}
                                            className={`cursor-pointer border-2 rounded-lg overflow-hidden hover:shadow-md transform transition-transform hover:scale-105 ${currentImage === el ? 'border-main ring-2 ring-red-200' : 'border-gray-200'}`}
                                        >
                                            <img src={el} alt={`sub-product-${index}`} className='h-full w-full object-cover' />
                                        </div>
                                    </div>
                                ))}
                                {currentProduct.images.length > 0 && currentProduct.images?.map((el, index) => (
                                    <div className='px-1' key={el}>
                                        <div
                                            onClick={e => handleClickImages(e, el)}
                                            className={`cursor-pointer border-2 rounded-lg overflow-hidden hover:shadow-md transform transition-transform hover:scale-105 ${currentImage === el ? 'border-main ring-2 ring-red-200' : 'border-gray-200'}`}
                                        >
                                            <img src={el} alt={`sub-product-${index}`} className='h-full w-full object-cover' />
                                        </div>
                                    </div>
                                ))}
                            </Slider>
                        </div>

                        {/* Product Tabs */}
                        <div className='bg-white rounded-lg shadow-sm mb-6'>
                            <div className='flex border-b'>
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${activeTab === 'description' ? 'text-main border-b-2 border-main' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Mô tả
                                </button>
                                <button
                                    onClick={() => setActiveTab('features')}
                                    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors ${activeTab === 'features' ? 'text-main border-b-2 border-main' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    Đặc điểm
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className='p-6'>
                                {activeTab === 'description' && (
                                    <div className='space-y-2'>
                                        {product?.description?.length > 1 && product?.description?.map((el) => (
                                            <p key={el} className='text-sm leading-6 text-gray-600'>{el}</p>
                                        ))}
                                        {product?.description?.length === 1 &&
                                            <div
                                                className='text-sm leading-6 text-gray-600 line-clamp-[8]'
                                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}
                                            ></div>
                                        }
                                    </div>
                                )}

                                {activeTab === 'features' && (
                                    <div className='space-y-4'>
                                        <div className='flex items-start space-x-3'>
                                            <FaShieldAlt className='text-green-500 mt-1 flex-shrink-0' />
                                            <div>
                                                <h4 className='text-sm font-medium'>Chất lượng cao</h4>
                                                <p className='text-sm text-gray-600'>Được làm từ vật liệu cao cấp cho độ bền</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start space-x-3'>
                                            <FaShippingFast className='text-blue-500 mt-1 flex-shrink-0' />
                                            <div>
                                                <h4 className='text-sm font-medium'>Giao hàng nhanh</h4>
                                                <p className='text-sm text-gray-600'>Giao hàng đến tận cửa nhà bạn</p>
                                            </div>
                                        </div>
                                        <div className='flex items-start space-x-3'>
                                            <FaGift className='text-red-500 mt-1 flex-shrink-0' />
                                            <div>
                                                <h4 className='text-sm font-medium'>Đóng gói đặc biệt</h4>
                                                <p className='text-sm text-gray-600'>Hoàn hảo cho việc tặng người thân</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className='lg:col-span-4 flex flex-col'>
                        {/* Price & Rating */}
                        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                            <div className='flex justify-between items-center mb-4'>
                                <div>
                                    <h2 className='text-2xl md:text-3xl font-bold text-main'>
                                        {`${formatPrice(formatMoney(currentProduct.price || product?.price))} VND`}
                                    </h2>
                                    <div className='flex items-center mt-1 gap-2'>
                                        <span className='text-sm text-gray-500 line-through'>
                                            {`${formatPrice(formatMoney(product?.originalPrice))} VND`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-center gap-2 mb-4'>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex items-center gap-1 text-yellow-400 mr-2'>
                                        {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
                                            <span key={index}>{el}</span>
                                        ))}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span className='text-sm text-gray-500 border-r border-gray-300 pr-2'>
                                            {`${product?.ratings?.length || 0} Đánh giá`}
                                        </span>
                                        <span className='text-sm text-gray-500 border-r border-gray-300 pr-2'>
                                            {`Đã bán: ${product?.sold || 0}`}
                                        </span>
                                        <span className='text-sm text-gray-500'>
                                            {`Kho: ${product?.quantity || 0}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className='flex items-center gap-2 mb-4'>
                                <span className='text-sm font-medium text-gray-600'>Status:</span>
                                <span className='flex items-center gap-1 text-green-600'>
                                    <FaRegCheckCircle size={14} />
                                    <span className='text-sm font-medium'>In Stock</span>
                                </span>
                            </div>
                        </div>

                        {/* Color Variants */}
                        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                            <h3 className='text-lg font-semibold mb-4 text-gray-800'>Color Options</h3>
                            <div className='flex flex-wrap gap-3'>
                                <div
                                    onClick={() => setVarriant(null)}
                                    className={clsx(
                                        'flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all transform hover:shadow-md',
                                        !varriant ? 'border-main bg-red-50 scale-105' : 'border-gray-200 hover:border-main hover:scale-105'
                                    )}
                                >
                                    <div className='relative w-10 h-10 rounded-md overflow-hidden border border-gray-200'>
                                        <img
                                            src={product?.thumb}
                                            alt='thumb'
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-sm font-medium'>{product?.color}</span>
                                        <span className='text-xs text-gray-500'>{formatPrice(formatMoney(product?.price))} VND</span>
                                    </div>
                                </div>

                                {product?.varriants?.map(el => (
                                    <div
                                        key={el.sku}
                                        onClick={() => setVarriant(el.sku)}
                                        className={clsx(
                                            'flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all transform hover:shadow-md',
                                            varriant === el.sku ? 'border-main bg-red-50 scale-105' : 'border-gray-200 hover:border-main hover:scale-105'
                                        )}
                                    >
                                        <div className='relative w-10 h-10 rounded-md overflow-hidden border border-gray-200'>
                                            <img
                                                src={el.thumb}
                                                alt='thumb'
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-sm font-medium'>{el.color}</span>
                                            <span className='text-xs text-gray-500'>{formatPrice(formatMoney(el.price))} VND</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className='bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-4'>
                            <div className='mb-4'>
                                <h3 className='text-lg font-semibold mb-2 text-gray-800'>Quantity</h3>
                                <div className='flex items-center jc'>
                                    <SelectQuantity
                                        quantity={quantity}
                                        handleQuantity={handleQuantity}
                                        handleChangeQuantity={handleChangeQuantity}
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col space-y-3'>
                                <button
                                    onClick={handleAddToCart}
                                    className={`w-full ${isAddingToCart ? 'bg-gray-500' : 'bg-main hover:bg-red-700'} text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:shadow-lg hover:scale-105`}
                                    disabled={isAddingToCart}
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            <span>Adding...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaShoppingCart />
                                            Thêm vào giỏ hàng
                                        </>
                                    )}
                                </button>

                                <button
                                    className='w-full border border-main text-main hover:bg-red-50 py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:shadow-md'
                                >
                                    <FaHeart />
                                    Thêm vào danh sách yêu thích
                                </button>
                            </div>

                            {/* Promotion Info */}
                            <div className='mt-4 pt-4 border-t border-gray-100'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <FaInfoCircle className='text-blue-500' />
                                    <span className='text-xs font-medium text-gray-700'>Thanh toán an toàn</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <FaGift className='text-red-500' />
                                    <span className='text-xs font-medium text-gray-700'>Bao bì quà miễn phí</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Info & Shipping */}
                    <div className='lg:col-span-3'>
                        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                            <div className='space-y-4'>
                                {productExtraInformation.map(el => (
                                    <ProductExtraInfoItem key={el.id} title={el.title} sub={el.sub} icon={el.icon} />
                                ))}
                            </div>
                        </div>

                        {/* Customer Support */}
                        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                            <h3 className='text-lg font-semibold mb-4 text-gray-800 border-b pb-2'>Cần trợ giúp?</h3>
                            <div className='flex flex-col items-center text-center'>
                                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3'>
                                    <FaHeadset size={24} />
                                </div>
                                <h4 className='font-medium mb-1'>Hỗ trợ khách hàng</h4>
                                <p className='text-sm text-gray-600 mb-3'>Đội ngũ của chúng tôi sẵn sàng giúp bạn</p>
                                <button className='bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors'>
                                    Liên hệ chúng tôi
                                </button>
                            </div>
                        </div>

                        {/* Buyer Protection */}
                        <div className='bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm p-6'>
                            <div className='flex items-center gap-3 mb-3'>
                                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600'>
                                    <FaShieldAlt size={18} />
                                </div>
                                <h3 className='text-lg font-semibold text-gray-800'>Bảo vệ người mua</h3>
                            </div>
                            <ul className='space-y-2 text-sm'>
                                <li className='flex items-center gap-2'>
                                    <FaRegCheckCircle className='text-green-500' />
                                    <span>Hoàn tiền</span>
                                </li>
                                <li className='flex items-center gap-2'>
                                    <FaRegCheckCircle className='text-green-500' />
                                    <span>Sản phẩm chính hãng</span>
                                </li>
                                <li className='flex items-center gap-2'>
                                    <FaRegCheckCircle className='text-green-500' />
                                    <span>Giao hàng nhanh chóng</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Information Tabs */}
            <div className='w-main mx-auto px-4 mt-10'>
                <div className='bg-white rounded-lg shadow-sm'>
                    <ProductInformation
                        totalRatings={product?.totalRatings}
                        ratings={product?.ratings}
                        nameProduct={product?.title}
                        pid={product?._id}
                        rerender={rerender}
                    />
                </div>
            </div>

            {/* Related Products */}
            <div className='w-main mx-auto px-4 mt-10 mb-20'>
                <div className='bg-white rounded-lg shadow-sm p-6'>
                    <h3 className='text-xl font-bold text-gray-800 mb-6 pb-2 border-b'>Sản phẩm bạn có thể thích</h3>
                    <CustomSlider products={relatedProduct} normal={true} />
                </div>
            </div>
        </div>
    );
};

export default withBase(DetailProduct);