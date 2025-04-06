import React, { memo } from 'react'

const SelectQuantity = ({quantity, handleQuantity, handleChangeQuantity}) => {
    console.log(quantity);
  return (
    <div className='flex items-center justify-center border-item w-[120px]'>
        <span onClick={() => handleChangeQuantity('minus')} className='p-2 cursor-pointer hover:text-gray-500'>-</span>
        <input 
        className='py-2 text-center outline-none w-[50px]' 
        type='text'
        value={quantity}
        onChange={e => handleQuantity(e.target.value)}
        />
        <span onClick={() => handleChangeQuantity('plus')} className='p-2 cursor-pointer hover:text-gray-500'>+</span>
    </div>
  )
}

export default memo(SelectQuantity)