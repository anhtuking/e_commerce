import React, { memo, useEffect, useRef, useState } from 'react'
import logo from '../assets/logo.png'
import { ratingOptions } from '../utils/contants'
import { AiFillStar, AiOutlineCloudUpload, AiOutlineClose } from 'react-icons/ai'
import Button from './Button'

const VoteOption = ({nameProduct, handleSubmitVoteOption}) => {
    const modalRef = useRef(null)
    const [files, setFiles] = useState([]);
    const [chosenScore, setChosenScore] = useState(null)
    const [comment, setComment] = useState('')

    useEffect(() => { 
        modalRef.current?.scrollIntoView({block: 'center', behavior: 'smooth'})
    }, []);
    const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    };
    const handleDeleteImage = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

  return (
    <div onClick={e => e.stopPropagation()} ref={modalRef} className='bg-white w-[700px] p-4 flex flex-col gap-4 items-center justify-center font-main2'>
        <img src={logo} alt='logo' className='w-[300px] my-6 object-contain'></img>
        <h2 className='text-center text-medium text-lg'>
            {`Product reviews: ${nameProduct}`}
        </h2>
        <div className="w-full flex flex-col gap-2">
        <div className="relative w-full h-[80px] border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center">
          <input
            type="file"
            multiple
            accept="image/*"
            className="absolute w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <AiOutlineCloudUpload size={30} color="gray" />
          <span className="text-xs text-gray-500">Drag or Tap to upload images</span>
        </div>
        {files.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {files.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-md border border-gray-200"
                  />
                  <button 
                    type="button" 
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    <AiOutlineClose size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
        <textarea 
          className='form-textarea w-full placeholder:italic placeholder:text-xs placeholder:text-gray-500 text-sm' 
          placeholder='Type something'
          value = {comment}
          onChange={e => setComment(e.target.value)}
        >
        </textarea>
        <div className='w-full flex flex-col gap-4 items-center border-item'>
            <p>How do you feel about this product?</p>
            <div className='flex items-center justify-center gap-4'>
                {ratingOptions.map(el => (
                    <div key={el.id} onClick={() => setChosenScore(el.id)} className='flex items-center justify-center flex-col gap-2 p-4 cursor-pointer'>
                        {(Number(chosenScore)) && chosenScore >= el.id ? <AiFillStar color='orange' size={70}/> : <AiFillStar color='gray' size={70}/>}
                        <span>{el.text}</span>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <Button handleOnClick={() => handleSubmitVoteOption({comment, score: chosenScore, files})}>Submit</Button>
        </div>
    </div>
  )
}

export default memo(VoteOption)