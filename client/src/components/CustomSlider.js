import React, {memo} from 'react';
import Slider from "react-slick";
import {Product} from './'

var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

const CustomSlider = ({products, activeTab}) => {
    return (
        <>
        {products && <Slider {...settings}>
          {products?.map((el) => (
            <Product
              key={el._id}
              pid={el._id}
              productData={el}
              isNew={activeTab === 1 ? false : true}
            />
          ))}
        </Slider>}
        </>
    )
}

export default memo(CustomSlider)