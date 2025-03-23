import React, { useCallback, useEffect, useState } from 'react';
import { createSearchParams, useLocation, useParams } from 'react-router-dom';
import { apiGetProduct, apiGetProducts } from 'api/product';
import { Breadcrumb, Button, ProductExtraInfoItem, SelectQuantity, ProductInformation } from 'components';
import CustomSlider from 'components/common/CustomSlider';
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, formatPrice, renderStarFromNumber } from 'utils/helpers';
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

var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const DetailProduct = ({navigate, dispatch}) => {
    const { pid, category } = useParams()
    const location = useLocation();
    const [product, setProduct] = useState(null)
    const { current } = useSelector(state => state.user)
    const [currentImage, setCurrentImage] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProduct, setRelatedProduct] = useState(null)
    const [update, setUpdate] = useState(false)
    const [varriant, setVarriant] = useState(null)
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
        window.scroll(0, 0)
    }, [pid])

    useEffect(() => {
        if (pid) fetchProductData()
    }, [update])

    const handleQuantity = useCallback((number) => {
        console.log(number);
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

    const handleAddToCart = async() => {
        if (!current) return Swal.fire({
          title: 'Wait...',
          text: 'Please login to add to cart',
          icon: 'info',
          confirmButtonText: 'Login',
          denyButtonText: 'Cancel',
          showDenyButton: true,
          confirmButtonColor: '#3085d6',
        }).then( async (result) => {
          if (result.isConfirmed) navigate(`/${path.LOGIN}?redirect=${location.pathname}`);
        })
        const response = await apiUpdateCart({
            pid: product?._id,
            color: currentProduct?.color || product?.color,
            quantity,
            price: currentProduct?.price || product?.price,
            thumbnail: currentProduct?.thumb || product?.thumb,
            title: currentProduct?.title || product?.title
        });
      if (response.success) {
        toast.success(response.mes)
        dispatch(getCurrent())
      } else {
        toast.error(response.mes)
      }
    }
    return (
        <div className='w-full'><div className='h-[81px] flex justify-center items-center bg-gray-100'>
            <div className='w-main font-semibold'>
                <h3>{currentProduct?.title || product?.title.toUpperCase()}</h3>
                <Breadcrumb title={currentProduct?.title || product?.title} category={category} />
            </div>
        </div>
            <div className='w-main m-auto mt-6 flex'>
                <div className=' flex flex-col gap-4 w-2/5'>
                    <div className='h-[458px] w-[458px] border flex items-center overflow-hidden'>
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: '',
                                isFluidWidth: true,
                                src: currentProduct?.thumb || currentImage
                            },
                            largeImage: {
                                src: currentProduct?.thumb || currentImage,
                                width: 1800,
                                height: 1500
                            }
                        }} />
                    </div>
                    <div className='w-[458px]'>
                        <Slider {...settings}>
                            {currentProduct.images.length === 0 && product?.images?.map((el, index) => (
                                <div className='flex w-full gap-2 cursor-pointer' key={el}>
                                    <img onClick={e => handleClickImages(e, el)} src={el} alt={`sub-product-${index}`} className='h-[140px] w-[140px] object-cover border-items' />
                                </div>
                            ))}
                            {currentProduct.images.length > 0 && currentProduct.images?.map((el, index) => (
                                <div className='flex w-full gap-2 cursor-pointer' key={el}>
                                    <img onClick={e => handleClickImages(e, el)} src={el} alt={`sub-product-${index}`} className='h-[140px] w-[140px] object-cover border-items' />
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                <div className='w-2/5 text-[30px] flex flex-col gap-4'>
                    <div className='flex items-center justify-between font-semibold'>
                        <h2>
                            {`${formatPrice(formatMoney(currentProduct.price || product?.price))} VND`}
                        </h2>
                    </div>
                    <div className='flex items-center gap-1'>
                        {renderStarFromNumber(product?.totalRatings)?.map((el, index) => (
                            <span key={index} >
                                {el}
                            </span>
                        ))}
                        <span className='text-sm font-main2 text-main ml-4'>
                            {`Sold: ${product?.sold} /`}
                        </span>

                        <span className='text-sm font-main2 text-main'>
                            {`Stock: ${product?.quantity}`}
                        </span>
                    </div>
                    <ul className='list-disc pl-5 text-sm font-main2 text-gray-800'>
                        {product?.description?.length > 1 && product?.description?.map((el) => (<li key={el} className='leading-8'>{el}</li>))}
                        {product?.description?.length === 1 && <div className='text-sm line-clamp-[15] mb-8' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
                    </ul>
                    <div className='my-4 flex gap-4'>
                        <span className='font-bold'>Color</span>
                        <div className='flex flex-wrap gap-4 items-center w-full'>
                            <div onClick={() => setVarriant(null)} className={clsx('flex items-center gap-2 p-2 border cursor-pointer', !varriant && 'border-red-500')}>
                                <img src={product?.thumb} alt='thumb' className='w-8 h-8 object-cover rounded-md' />
                                <span className='flex flex-col'>
                                    <span className='text-xs'>{product?.color}</span>
                                    <span className='text-sm'>{product?.price}</span>
                                </span>
                            </div>
                            {product?.varriants?.map(el => (
                                <div key={el.sku} onClick={() => setVarriant(el.sku)} className={clsx('flex items-center gap-2 p-2 border cursor-pointer', varriant === el.sku && 'border-red-500')}>
                                    <img src={el.thumb} alt='thumb' className='w-8 h-8 object-cover rounded-md' />
                                    <span className='flex flex-col'>
                                        <span className='text-xs'>{el.color}</span>
                                        <span className='text-sm'>{el.price}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col gap-8 font-main2'>
                        <div className='flex items-center gap-4'>
                            <span className='font-semibold'>Quantity</span>
                            <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} handleChangeQuantity={handleChangeQuantity} />
                        </div>
                        <Button handleOnClick={handleAddToCart} fw>
                            Add to cart
                        </Button>
                    </div>
                </div><div className='w-1/5'>
                    {productExtraInformation.map(el => (
                        <ProductExtraInfoItem key={el.id} title={el.title} sub={el.sub} icon={el.icon} />
                    ))}
                </div>
            </div><div className='w-main m-auto mt-8'>
                <ProductInformation totalRatings={product?.totalRatings} ratings={product?.ratings} nameProduct={product?.title} pid={product?._id} rerender={rerender} />
            </div>
            <div className='w-main m-auto mt-8'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMER ALSO BUY</h3>
                <CustomSlider products={relatedProduct} normal={true} />
            </div>
            <div className='h-[100px] w-full'></div>
        </div>
    )
}

export default withBase(DetailProduct)