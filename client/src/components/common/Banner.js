import React, { memo } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
    // Settings for the small banners slider
    const smallBannerSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    arrows: false,
                }
            }
        ]
    };

    // Array of small banner images
    const smallBanners = [
        {
            id: 1,
            src: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_8cda4a9d9f.png",
            alt: "banner 1"
        },
        {
            id: 2,
            src: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_c5d8793756.png",
            alt: "banner 2"
        },
        {
            id: 3,
            src: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_8824eb350f.png",
            alt: "banner 3"
        },
        {
            id: 4,
            src: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_e97abfb675.png",
            alt: "banner 4"
        },
        {
            id: 5,
            src: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/H2_614x212_002b4b6a00.png",
            alt: "banner 5"
        }
    ];

    return (
        <div className='w-full flex flex-col gap-5'>
            {/* Main banner */}
            <div className='w-full relative group overflow-hidden rounded-lg'>
                <img 
                    src="https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/desk_header_d24626f696.png" 
                    alt="Main Banner"
                    className="w-full"
                />
            </div>
            
            {/* Small Promotional Banners with Slider */}
            <div className="w-full banner-slider">
                <Slider {...smallBannerSettings}>
                    {smallBanners.map(banner => (
                        <div key={banner.id} className="px-2">
                            <div className="rounded-md overflow-hidden shadow-sm transition-transform duration-300 hover:scale-[1.01]">
                                <img
                                    src={banner.src}
                                    alt={banner.alt}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    )
}

export default memo(Banner);