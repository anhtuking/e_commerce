import React from 'react';

const Product = ({productData}) => {
    return (
        <div className='w-1/3'>
            <img src={productData?.images[0] || ''} alt='' className='w-[246px] h-[246px] object-cover'/>
        </div>
    )
}

export default Product