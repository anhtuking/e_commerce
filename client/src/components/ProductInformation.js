import React, { memo, useState } from 'react';
import { productInfoTabs } from '../utils/contants';

// const activedStyles = '';
// const notActivedStyles = '';

const ProductInformation = () => {
    const [activedTab, setActivedTab] = useState(1);

    return (
        <div>
            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {productInfoTabs.map(e1 => (
                    <span
                        className={`py-2 px-4 cursor-pointer ${activedTab === e1.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        key={e1.id}
                        onClick={() => setActivedTab(e1.id)}
                    >
                        {e1.name}
                    </span>
                ))}
            </div>
            <div className='w-full p-4 border'>
                {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content}
            </div>
        </div>
    );
};

export default memo(ProductInformation);