import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetProduct, apiGetProducts } from 'api/product';
import { Breadcrumb, Button, ProductExtraInfoItem, SelectQuantity, ProductInformation, CustomSlider } from 'components';
import Slider from "react-slick";
import ReactImageMagnify from 'react-image-magnify';
import { formatMoney, formatPrice, renderStarFromNumber } from 'utils/helpers';
import { productExtraInformation } from 'utils/contants';
import DOMPurify from 'dompurify';

var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

const DetailProduct = () => {
    const {pid, title, category} = useParams()
    const [product, setProduct] = useState(null)
    const [currentImage, setCurrentImage] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [relatedProduct, setRelatedProduct] = useState(null)
    const [update, setUpdate] = useState(false)

    const fetchProductData = async () => {
        const response = await apiGetProduct(pid)
        if (response.success) {
            setProduct(response.dataProduct)
            setCurrentImage(response.dataProduct?.thumb)
        }
    } 
    const fetchProducts = async () => {
        const response = await apiGetProducts({category})
        if (response.success) setRelatedProduct(response.dataProducts)
    }

    const rerender = useCallback(() => { 
        setUpdate(!update)
     }, [update])

    useEffect(() => {
        if(pid) {
            fetchProductData()
            fetchProducts()
        }
        window.scroll(0,0)
    }, [pid])
     useEffect(() => {
        if(pid) fetchProductData()
    }, [update])

    const handleQuantity = useCallback((number) => {
        console.log(number);
        if (!Number(number) || Number(number) < 1) {
            return
        } else setQuantity(number)
    }, [quantity])
    const handleClickImages = (e, el) => { 
        e.stopPropagation()
        setCurrentImage(el)
     }
    const handleChangeQuantity = useCallback ((flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }, [quantity])
    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main font-semibold'>
                    <h3>{title.toUpperCase()}</h3>
                    <Breadcrumb title={title} category={category}/>
                </div>
            </div>
            <div className='w-main m-auto mt-6 flex'>
                <div className=' flex flex-col gap-4 w-2/5'>
                    <div className='h-[458px] w-[458px]'>
                        <ReactImageMagnify {...{
                            smallImage: {
                                alt: '',
                                isFluidWidth: true,
                                src: currentImage
                            },
                            largeImage: {
                                src: currentImage,
                                width: 1800,
                                height: 1500
                            }
                        }} />
                    </div>
                    <div className='w-[458px]'>
                        <Slider {...settings}>
                        {product?.images?.map((el, index) => (
                            <div className='flex w-full gap-2 cursor-pointer'key={el}>
                                <img onClick={e => handleClickImages(e, el)} src={el} alt={`sub-product-${index}`} className='h-[140px] w-[140px] object-cover border-items'/>
                            </div>
                        ))}
                        </Slider>
                    </div>
                </div>
                <div className='w-2/5 text-[30px] flex flex-col gap-4'>
                    <div className='flex items-center justify-between font-semibold'>
                        <h2>
                            {`${formatPrice(formatMoney(product?.price))} VND`}
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
                        {product?.description?.length === 1 && <div className='text-sm' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(product?.description[0])}}></div>}
                    </ul>
                    <div className='flex flex-col gap-8 font-main2'>
                        <div className='flex items-center gap-4'>
                            <span className='font-semibold'>Quantity</span>
                            <SelectQuantity quantity={quantity} handleQuantity={handleQuantity} handleChangeQuantity={handleChangeQuantity}/>
                        </div>
                        <Button fw>
                            Add to cart
                        </Button>
                    </div>
                </div>
                <div className='w-1/5'>
                    {productExtraInformation.map(el => (
                        <ProductExtraInfoItem key={el.id} title={el.title} sub={el.sub} icon={el.icon}/>
                    ))}
                </div>
            </div>
            <div className='w-main m-auto mt-8'>
                <ProductInformation totalRatings={product?.totalRatings} ratings={product?.ratings} nameProduct={product?.title} pid={product?._id} rerender={rerender}/>
            </div>
            <div className='w-main m-auto mt-8'>
                <h3 className='text-[20px] font-semibold py-[15px] border-b-2 border-main'>OTHER CUSTOMER ALSO BUY</h3>
                <CustomSlider products={relatedProduct} normal={true}/>
            </div>
            <div className='h-[100px] w-full'></div>
        </div>
    )
}

export default DetailProduct