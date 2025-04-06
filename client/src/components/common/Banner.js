import React, { memo } from 'react';
import largeThumbnail from 'assets/large-thumbnail.mp4';
import { Link } from 'react-router-dom';
import path from 'utils/path';

const Banner = () => {
    return (        
        <div className='w-full relative group overflow-hidden rounded-lg'>
            <video 
                src={largeThumbnail} 
                autoPlay 
                muted 
                loop 
                className="h-full md:h-full lg:h-full w-full object-cover transition-transform duration-10000   "
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center px-6 md:px-10 lg:px-16">
                <div className="max-w-lg">
                    <h2 
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3"
                        style={{ animation: 'fadeInDown 0.8s ease-out forwards' }}
                    >
                        Công nghệ mới xuất hiện
                    </h2>
                    <p 
                        className="text-sm md:text-base text-white mb-6 opacity-90"
                        style={{ animation: 'fadeInUp 0.8s ease-out forwards' }}
                    >
                        Tìm hiểu về công nghệ mới nhất với bộ sưu tập các thiết bị công nghệ tiên tiến và điện tử. Chất lượng và hiệu suất tốt nhất với giá cả không thể đối kháng.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link 
                            to={`/${path.PRODUCTS}`}
                            className="px-5 py-2.5 bg-white text-gray-900 font-medium rounded-md hover:bg-main hover:text-white transition-colors transform hover:scale-105"
                            style={{ animation: 'fadeIn 0.8s ease-out forwards' }}
                        >
                            Mua ngay
                        </Link>
                        <Link 
                            to={`/${path.BLOGS}`}
                            className="px-5 py-2.5 bg-transparent text-white border border-white font-medium rounded-md hover:bg-white hover:text-gray-900 transition-colors transform hover:scale-105"
                            style={{ animation: 'fadeIn 0.8s ease-out forwards', animationDelay: '150ms' }}
                        >
                            Tìm hiểu thêm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Banner);