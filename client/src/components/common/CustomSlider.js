import React, { memo } from "react";
import Slider from "react-slick";
import Product from "../product/Product";

var settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
};

const CustomSlider = ({ products, activeTab, normal }) => {
  return (
    <>
      {products && (
        <Slider className="custom-slider" {...settings}>
          {products?.map((el, index) => (
            <Product
              key={index}
              pid={el._id}
              productData={el}
              isNew={activeTab === 1 ? false : true}
              normal={normal}
            />
          ))}
        </Slider>
      )}
    </>
  );
};

export default memo(CustomSlider);
