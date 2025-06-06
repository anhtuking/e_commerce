import React, { useEffect, useState } from 'react'
import { SelectQuantity } from 'components'
import { formatPrice } from 'utils/helpers'
import { FaTrash, FaHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'
import withBase from 'hocs/withBase'
import { apiRemoveCart, apiUpdateWishlist } from 'api/user'
import { getCurrent } from 'store/user/asyncAction'
import { updateCart } from 'store/user/userSlice'
import { useSelector } from 'react-redux'
import { FiCheckCircle, FiCircle } from 'react-icons/fi'

const OrderItem = ({ el, dispatch, getCount, defaultQuantity = 1, selected, onSelect }) => {
    const [quantity, setQuantity] = useState(() => defaultQuantity)
    const [isSaving, setIsSaving] = useState(false)
    const { current } = useSelector(state => state.user)
    const isInWishlist = current?.wishlist?.includes(el.product?._id)

    const handleQuantity = (number) => {
        if (+number > 1) setQuantity(number)
    }

    const handleChangeQuantity = (flag) => {
        if (flag === 'minus' && quantity === 1) return
        if (flag === 'minus') setQuantity(prev => +prev - 1)
        if (flag === 'plus') setQuantity(prev => +prev + 1)
    }

    const handleRemoveFromCart = async (pid, color) => {
        const response = await apiRemoveCart(pid, color)
        if (response.success) {
            dispatch(getCurrent())
        } else {
            toast.error(response.mes)
        }
    };

    const handleAddToWishlist = async () => {
        if (!el.product?._id) {
            toast.error('Không thể thêm vào danh sách yêu thích')
            return
        }

        setIsSaving(true)
        try {
            const response = await apiUpdateWishlist(el.product?._id)

            if (response.success) {
                toast.success(isInWishlist
                    ? 'Đã xóa khỏi danh sách yêu thích'
                    : 'Đã thêm vào danh sách yêu thích')
                dispatch(getCurrent())
            } else {
                toast.error(response.mes || 'Không thể cập nhật danh sách yêu thích')
            }
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi cập nhật danh sách yêu thích')
        } finally {
            setIsSaving(false)
        }
    }

    useEffect(() => {
        dispatch(updateCart({ pid: el.product?._id, quantity, color: el.color }))
    }, [quantity])

    return (
        <div className='w-full grid grid-cols-10 py-4 px-6 items-center hover:bg-gray-50 transition-colors duration-200'>
            <div className='col-span-6 w-full flex gap-4 items-center'>
                <div
                    className="cursor-pointer text-2xl"
                    onClick={onSelect}
                >
                    {selected ? <FiCheckCircle className="text-red-600" /> : <FiCircle className="text-gray-400" />}
                </div>
                <div className='relative flex-shrink-0'>
                    <img
                        src={el.thumbnail}
                        alt="thumb"
                        className='w-28 h-28 object-cover rounded-md border border-gray-200'
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <h3 className='font-medium text-gray-800 line-clamp-2'>{el.title}</h3>
                    <div className='text-xs text-gray-500 flex flex-wrap gap-2 mt-1'>
                        {el.color && <span className='py-0.5 px-2 bg-gray-100 rounded-full'>Màu sắc: {el.color}</span>}
                        <span className='py-0.5 px-2 bg-gray-100 rounded-full'>Giá: {formatPrice(el.price)} VND</span>
                    </div>

                    <div className='flex gap-3 mt-3'>
                        <button
                            onClick={() => handleRemoveFromCart(el.product?._id, el.color)}
                            className='text-xs flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors'
                        >
                            <FaTrash size={10} />
                            <span>Xóa</span>
                        </button>

                        <button
                            onClick={handleAddToWishlist}
                            disabled={isSaving}
                            className={`text-xs flex items-center gap-1 ${isInWishlist ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                        >
                            <FaHeart size={10} />
                            <span>{isSaving ? 'Đang lưu...' : isInWishlist ? 'Đã thích' : 'Thích'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className='col-span-1 w-full h-full flex justify-center items-center'>
                <SelectQuantity
                    quantity={quantity}
                    handleChangeQuantity={handleChangeQuantity}
                    handleQuantity={handleQuantity}
                />
            </div>

            <div className='col-span-3 w-full flex justify-center items-center'>
                <span className='font-semibold text-red-600'>{formatPrice(el.price * quantity)} VND</span>
            </div>
        </div>
    )
}

export default withBase(OrderItem)