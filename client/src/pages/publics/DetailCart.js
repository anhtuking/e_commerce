import { Breadcrumb, Button} from 'components'
import OrderItem from 'components/product/OrderItem'
import withBase from 'hocs/withBase'
import { useSelector } from 'react-redux'
import { formatPrice } from 'utils/helpers'
const DetailCart = ({ location }) => {
  const { current } = useSelector(state => state.user)
  return (
    <div className='w-full'>
      <div className="h-[81px] flex justify-center items-center bg-gray-100">
        <div className="w-main">
          <h3 className="font-semibold uppercase text-2xl font-main2">Your Shopping Cart</h3>
          <Breadcrumb category={location.pathname} />
        </div>
      </div>
      <div className='flex flex-col border mt-8'>
        <div className='w-main mx-auto bg-main text-white font-bold grid grid-cols-10 opacity-80'>
          <span className='col-span-6 w-full text-center'>Products</span>
          <span className='col-span-1 w-full text-center'>Quantity</span>
          <span className='col-span-3 w-full text-center'>Price</span>
        </div>
        {current?.cart?.map(el => (
          <OrderItem key={el._id} el={el} />
        ))}
      </div>
      <div className='w-main mx-auto flex flex-col gap-2 justify-ceter items-end'>
        <span className='flex gap-2'>
          <span>Total:</span>
          <span>{formatPrice(current?.cart?.reduce((sum, el) => sum + +el.price * el.quantity, 0))} VND</span>
        </span>
        <span className='text-sm italic text-gray-600 font-main2'>Shipping, taxes, and discounts will be calculated at checkout.</span>
        <Button>Checkout</Button>
      </div>
    </div >
  )
}

export default withBase(DetailCart)