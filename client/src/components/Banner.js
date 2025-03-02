import React from 'react';
import banner from '../assets/banner.jpg';

const Banner = () => {
    return (
        <div className='w-full'>
            <img src={banner} alt="banner" className="h-[350px] w-full object-cover"/>
        </div>
    )
}

export default Banner