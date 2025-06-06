import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { apiGetProduct, apiGetProducts } from 'api/product';
import { Breadcrumb, ProductExtraInfoItem, SelectQuantity, ProductInformation } from 'components';
import CustomSlider from 'components/common/CustomSlider';
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';
import { formatPrice, renderStarFromNumber, addToCartUtil } from 'utils/helpers';
import { productExtraInformation } from 'utils/contants';
import DOMPurify from 'dompurify';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import withBase from 'hocs/withBase';
import { useSelector } from 'react-redux';
import path from 'utils/path';
import { apiUpdateCart, apiUpdateWishlist } from 'api/user';
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
    const params = useParams();
    const { pid } = params;
    const category = params.category;
    const location = useLocation();
    const [product, setProduct] = useState(null)
    const { current } = useSelector(state => state.user)
    const [currentImage, setCurrentImage] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProduct, setRelatedProduct] = useState(null)
    const [update, setUpdate] = useState(false)
    const [variant, setVariant] = useState(null)
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
    const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
    const maxStock = product?.quantity || 0;

    const fetchProductData = async () => {
        try {
            const response = await apiGetProduct(pid)
            if (response.success) {
                setProduct(response.dataProduct)
                setCurrentImage(response.dataProduct?.thumb)
            } else {
                console.error('Failed to fetch product:', response);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }
    const fetchProducts = async () => {
        const response = await apiGetProducts({ category })
        if (response.success) setRelatedProduct(response.dataProducts)
    }

    useEffect(() => {
        if (variant) {
            const selectedVariant = product?.variants?.find(el => el.sku === variant);
            if (selectedVariant) {
                setCurrentProduct(prev => ({
                    ...prev,
                    title: selectedVariant.title,
                    color: selectedVariant.color,
                    thumb: selectedVariant.thumb,
                    price: selectedVariant.price,
                }));
            }
        } else if (product) {
            setCurrentProduct((prev) => ({
                ...prev,
                title: product.title,
                color: product.color,
                thumb: product.thumb,
                price: product.price,
            }));
        }
    }, [variant, product]);

    const filteredVariants = product?.variants?.filter(
        (el) => el.color !== product.color
    );

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
    }, [quantity]);
    
    const handleChangeQuantity = useCallback((flag, maxQuantity) => {
        // Kiểm tra nếu số lượng hiện tại bằng 1, không cho giảm
        if (flag === 'minus' && quantity === 1) return;
        // Nếu là dấu trừ, giảm số lượng
        if (flag === 'minus') {
            setQuantity(prev => +prev - 1);
        }
        // Nếu là dấu cộng, kiểm tra số lượng có vượt quá maxQuantity không
        if (flag === 'plus' && quantity >= maxQuantity) {
            // Notify user of max stock when trying to exceed
            toast.info(`Không thể thêm quá số lượng sản phẩm có sẵn.`);
            return;
        }
        // Nếu không vượt quá maxQuantity, tăng số lượng
        if (flag === 'plus') {
            setQuantity(prev => +prev + 1);
        }
    }, [quantity, toast]);

    const handleClickImages = (e, el) => {
        e.stopPropagation();
        setCurrentImage(el);
        setCurrentProduct(prev => ({
            ...prev,
            thumb: el
        }));
    }

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

        const currentVariant = variant ? product?.variants?.find(el => el.sku === variant) : null;
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

    const handleAddToWishlist = async () => {
        if (!current) return Swal.fire({
            title: 'Wait...',
            text: 'Please login to add to wishlist',
            icon: 'info',
            confirmButtonText: 'Login',
            denyButtonText: 'Cancel',
            showDenyButton: true,
            confirmButtonColor: '#3085d6',
        }).then(async (result) => {
            if (result.isConfirmed) navigate(`/${path.LOGIN}?redirect=${location.pathname}`);
        })

        setIsAddingToWishlist(true);

        try {
            const response = await apiUpdateWishlist(pid);

            setIsAddingToWishlist(false);

            if (response.success) {
                toast.success(response.mes);
                dispatch(getCurrent());
            } else {
                toast.error(response.mes);
            }
        } catch (error) {
            setIsAddingToWishlist(false);
            toast.error("An error occurred. Please try again.");
            console.error("Wishlist update error:", error);
        }
    }

    return (
        <div className='w-full bg-gray-50'>
            {/* Header & Breadcrumb */}
            <div className='bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm'>
                <div className='w-main mx-auto px-4 py-6 overflow-hidden' >
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
            <div className='w-main mx-auto px-4 py-8 overflow-hidden'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8'>
                    {/* Product Images */}
                    <div className='lg:col-span-5 flex flex-col gap-4'>
                        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                            <div className='relative border hover:border-main transition-all rounded-lg overflow-hidden group'>
                                <div className='absolute top-2 right-2 z-10 bg-white bg-opacity-80 text-main text-xs font-medium px-2 py-1 rounded-full flex items-center shadow-sm'>
                                    <FaEye className='mr-1' /> {Math.floor(Math.random() * 20) + 5} watching
                                </div>
                                <div className="overflow-hidden">
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
                        </div>
                        <div className='mt-4'>
                            <Slider {...settings} className='product-thumbnails'>
                                {currentProduct?.images?.length === 0 && product?.images?.map((el, index) => (
                                    <div className='px-1' key={el}>
                                        <div
                                            onClick={e => handleClickImages(e, el)}
                                            className={`cursor-pointer border-2 rounded-lg overflow-hidden hover:shadow-md transform transition-transform hover:scale-105 ${currentImage === el ? 'border-main ring-2 ring-red-200' : 'border-gray-200'}`}
                                        >
                                            <img src={el} alt={`sub-product-${index}`} className='h-full w-full object-cover' />
                                        </div>
                                    </div>
                                ))}
                                {currentProduct?.images?.length > 0 && currentProduct.images?.map((el, index) => (
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
                                    Thông số
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
                                            <p key={el} className='text-sm leading-6 text-gray-600 whitespace-pre-line'>{el}</p>
                                        ))}
                                        {product?.description?.length === 1 &&
                                            <div
                                                className='text-sm leading-6 text-gray-600 line-clamp-[15] whitespace-pre-line'
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
                                        <div className='flex items-start space-x-3'>
                                            <div>
                                                <h4 className='text-sm font-medium'>Mới, đầy đủ phụ kiện từ nhà sản xuất</h4>
                                            </div>
                                        </div>
                                        <div className='flex items-start space-x-3'>
                                            <div>
                                                <h4 className='text-sm font-medium'>Bảo hành 18 tháng tại trung tâm bảo hành Chính hãng</h4>
                                            </div>
                                        </div>
                                        <div className='flex items-start space-x-3'>
                                            <div>
                                                <h4 className='text-sm font-medium'>Giá sản phẩm đã bao gồm VAT</h4>
                                            </div>
                                        </div>
                                        <div className='flex items-start space-x-3'>
                                            <div>
                                                <h4 className='text-sm font-medium'>1 đổi 1 trong 30 ngày nếu có lỗi phần cứng từ nhà sản xuất</h4>
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
                                        {Number(currentProduct.price || product?.price)
                                            ? `${formatPrice(Number(currentProduct.price || product?.price))} VND`
                                            : "Đang cập nhật"}
                                    </h2>
                                    {product?.originalPrice && Number(product?.originalPrice) > 0 && (
                                        <div className='flex items-center mt-1 gap-2'>
                                            <span className='text-sm text-gray-500 line-through'>
                                                {formatPrice(Number(product?.originalPrice))} VND
                                            </span>
                                        </div>
                                    )}
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
                                            {`Tồn kho: ${product?.quantity || 0}`}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className='flex items-center gap-2 mb-4'>
                                <span className='text-sm font-medium text-gray-600'>Trạng thái:</span>
                                <span className='flex items-center gap-1 text-green-600'>
                                    <FaRegCheckCircle size={14} />
                                    <span className='text-sm font-medium'>In Stock</span>
                                </span>
                            </div>
                        </div>

                        {/* Variants */}
                        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
                            <h3 className='text-lg font-semibold mb-4 text-gray-800'>Màu sắc</h3>
                            <div className='flex flex-wrap gap-3'>
                                <div
                                    onClick={() => setVariant(null)}
                                    className={clsx(
                                        'flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all transform hover:shadow-md',
                                        !variant ? 'border-main bg-red-50 scale-105' : 'border-gray-200 hover:border-main hover:scale-105'
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
                                        <span className='text-xs text-gray-500'>
                                            {Number(product?.price)
                                                ? formatPrice(Number(product?.price))
                                                : "Đang cập nhật"} VND
                                        </span>
                                    </div>
                                </div>
                                {filteredVariants?.map(el => (
                                    <div
                                        key={el.sku}
                                        onClick={() => setVariant(el.sku)}
                                        className={clsx(
                                            'flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all transform hover:shadow-md',
                                            variant === el.sku ? 'border-main bg-red-50 scale-105' : 'border-gray-200 hover:border-main hover:scale-105'
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
                                            <span className='text-xs text-gray-500'>
                                                {Number(el.price)
                                                    ? formatPrice(Number(el.price))
                                                    : "Đang cập nhật"} VND
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Add to Cart */}
                        <div className='bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-4'>
                            <div className='mb-4'>
                                <h3 className='text-lg font-semibold mb-2 text-gray-800'>Số lượng</h3>
                                <div className='flex flex-col'>
                                    <div className='flex items-center mb-2'>
                                        <SelectQuantity
                                            quantity={quantity}
                                            handleQuantity={handleQuantity}
                                            handleChangeQuantity={handleChangeQuantity}
                                            maxQuantity={maxStock}
                                        />
                                        <span className='ml-3 text-sm text-gray-500'>
                                            {maxStock > 0 ? `${maxStock} sản phẩm có sẵn` : 'Hết hàng'}
                                        </span>
                                    </div>
                                    {maxStock < 10 && maxStock > 0 && (
                                        <p className='text-xs text-orange-500 font-medium mt-1'>
                                            <span className='inline-block w-2 h-2 bg-orange-500 rounded-full mr-1'></span>
                                            Chỉ còn {maxStock} sản phẩm có sẵn
                                        </p>
                                    )}
                                    {maxStock === 0 && (
                                        <p className='text-xs text-red-500 font-medium mt-1'>
                                            <span className='inline-block w-2 h-2 bg-red-500 rounded-full mr-1'></span>
                                            Sản phẩm tạm thời hết hàng
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className='flex flex-col space-y-3'>
                                <button
                                    onClick={handleAddToCart}
                                    className={`w-full ${isAddingToCart || maxStock === 0 ? 'bg-gray-500' : 'bg-main hover:bg-red-700'} text-white py-4 rounded-lg flex items-center justify-center gap-2 transition-all transform ${maxStock === 0 ? '' : 'hover:shadow-lg hover:scale-105'}`}
                                    disabled={isAddingToCart || maxStock === 0}
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                            <span>Adding...</span>
                                        </>
                                    ) : maxStock === 0 ? (
                                        <>
                                            <span>Hết hàng</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaShoppingCart />
                                            Thêm vào giỏ hàng
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleAddToWishlist}
                                    className={`w-full border ${current?.wishlist?.includes(pid) ? 'bg-red-50 border-red-500 text-red-500' : 'border-main text-main hover:bg-red-50'} py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:shadow-md`}
                                    disabled={isAddingToWishlist}
                                >
                                    {isAddingToWishlist ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-500"></div>
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaHeart color={current?.wishlist?.includes(pid) ? 'red' : undefined} />
                                            {current?.wishlist?.includes(pid) ? 'Đã thêm vào yêu thích' : 'Thêm vào danh sách yêu thích'}
                                        </>
                                    )}
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
            <div className='w-main mx-auto px-4 mt-10 overflow-hidden'>
                <div className='bg-white rounded-lg shadow-sm'>
                    <ProductInformation
                        totalRatings={product?.totalRatings}
                        ratings={product?.ratings}
                        nameProduct={product?.title}
                        pid={product?._id}
                        rerender={rerender}
                        productInfo={product?.infomations}
                    />
                </div>
            </div>

            {/* Related Products */}
            <div className='w-main mx-auto px-4 mt-10 mb-20 overflow-hidden'>
                <div className='bg-white rounded-lg shadow-sm p-6'>
                    <h3 className='text-xl font-bold text-gray-800 mb-6 pb-2 border-b'>Sản phẩm bạn có thể thích</h3>
                    <CustomSlider products={relatedProduct} normal={true} />
                </div>
            </div>
        </div>
    );
};

export default withBase(DetailProduct);