import React, { memo } from 'react';
import largeThumbnail from 'assets/large-thumbnail.mp4';

const Banner = () => {
    return (        
        <div className='w-full'>
            <video src={largeThumbnail} autoPlay muted loop className="h-[630px] w-full object-cover"/>
        </div>
    )
}

export default memo(Banner)