import React, { memo } from 'react'

const ProductExtraInfoItem = ({ icon, title, sub }) => {
    return (
        <div className='flex items-center p-3 gap-4 mb-[10px] border-item font-main2'>
            <span className='p-2 bg-gray-800 rounded-full flex items-center justify-center text-white'>{icon}</span>
            <div className='flex flex-col text-sm text-gray-500'>
                <span className='font-bold text-gray-800'>{title}</span>
                <span className='text-xs'>{sub}</span>
            </div>
        </div>
    );
};

export default memo(ProductExtraInfoItem)