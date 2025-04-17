import React, { memo, useEffect, useRef, useState } from 'react'
import logo from 'assets/logo.png'
import { ratingOptions } from 'utils/contants'
import { AiFillStar } from 'react-icons/ai'
import Button from 'components/common/Button'

const VoteOption = ({nameProduct, handleSubmitVoteOption}) => {
    const modalRef = useRef(null)
    const [chosenScore, setChosenScore] = useState(null)
    const [comment, setComment] = useState('')

    useEffect(() => { 
        modalRef.current?.scrollIntoView({block: 'center', behavior: 'smooth'})
    }, []);

  return (
    <div 
      onClick={e => e.stopPropagation()} 
      ref={modalRef} 
      className='bg-white w-[700px] max-w-[95vw] p-4 flex flex-col gap-4 items-center justify-center font-main2 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2000] rounded-lg shadow-2xl'
    >
        <img src={logo} alt='logo' className='w-[300px] my-6 object-contain'></img>
        <h2 className='text-center text-medium text-lg'>
            {`Đánh giá sản phẩm: ${nameProduct}`}
        </h2>
        <textarea 
          className='form-textarea w-full placeholder:italic placeholder:text-xs placeholder:text-gray-500 text-sm' 
          placeholder='Nhập bình luận của bạn'
          value = {comment}
          onChange={e => setComment(e.target.value)}
        >
        </textarea>
        <div className='w-full flex flex-col gap-4 items-center border-item'>
            <p>Bạn cảm thấy thế nào về sản phẩm này?</p>
            <div className='flex items-center justify-center gap-4 flex-wrap'>
                {ratingOptions.map(el => (
                    <div key={el.id} onClick={() => setChosenScore(el.id)} className='flex items-center justify-center flex-col gap-2 p-4 cursor-pointer'>
                        {(Number(chosenScore)) && chosenScore >= el.id ? <AiFillStar color='orange' size={70}/> : <AiFillStar color='gray' size={70}/>}
                        <span>{el.text}</span>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <Button handleOnClick={() => handleSubmitVoteOption({comment, score: chosenScore})}>Gửi đánh giá</Button>
        </div>
    </div>
  )
}

export default memo(VoteOption)