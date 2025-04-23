import React, { memo } from 'react'

const SelectQuantity = ({quantity, handleQuantity, handleChangeQuantity, maxQuantity}) => {
    console.log(quantity);
  // Check if max quantity is reached
  const isMaxReached = maxQuantity !== undefined && quantity >= maxQuantity;
  
  return (
    <div className='flex items-center justify-center border-item w-[120px]'>
        <span 
          onClick={() => handleChangeQuantity('minus')} 
          className={`p-2 cursor-pointer hover:text-gray-500 ${quantity <= 1 ? 'text-gray-300 cursor-not-allowed' : ''}`}
        >
          -
        </span>
        <input 
          className='py-2 text-center outline-none w-[50px]' 
          type='text'
          value={quantity}
          onChange={e => handleQuantity(e.target.value)}
        />
        <span 
          onClick={() => handleChangeQuantity('plus', maxQuantity)} 
          className={`p-2 ${isMaxReached ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer hover:text-gray-500'}`}
          title={isMaxReached ? `Tối đa ${maxQuantity} sản phẩm` : ''}
        >
          +
        </span>
    </div>
  )
}

export default memo(SelectQuantity)