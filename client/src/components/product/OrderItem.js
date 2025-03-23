import React, { useState } from 'react'
import { SelectQuantity } from 'components'
import { formatPrice } from 'utils/helpers'

const OrderItem = ({ el }) => {

  const [quantity, setQuantity] = useState(el.quantity)
  const handleQuantity = (number) => {
    if (+number > 1) setQuantity(number)
  }
  const handleChangeQuantity = (flag) => {
    if (flag === 'minus' && quantity === 1) return
    if (flag === 'minus') setQuantity(prev => +prev - 1)
    if (flag === 'plus') setQuantity(prev => +prev + 1)
  }

    return (
        <div className='w-main mx-auto font-bold grid grid-cols-10'>
            <span className='col-span-6 w-full text-center'>
                <div className='flex gap-2'>
                    <img src={el.thumbnail} alt="thumb" className='w-48 h-48 object-cover' />
                    <div className='flex flex-col items-start gap-1'>
                        <span className='text-sm text-main mt-4 pl-8'>{el.title}</span>
                        <span className='text-[10px] pl-8'>{el.color}</span>
                    </div>
                </div>
            </span >
            <span className='col-span-1 w-full h-full text-center flex justify-center items-center'>
                <div>
                    <SelectQuantity
                        quantity={quantity}
                        handleChangeQuantity={handleChangeQuantity}
                        handleQuantity={handleQuantity}
                    />
                </div>
            </span>
            <span className='col-span-3 w-full text-center'>
                <span className='text-lg'>{formatPrice(el.price)} VND</span>
            </span>
        </div >
    )
}

export default OrderItem