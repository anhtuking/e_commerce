import React, { memo, useState, useCallback } from 'react';
import { productInfoTabs } from '../utils/contants';
import {Button, Votebar, VoteOption, Comment} from './';
import { renderStarFromNumber } from '../utils/helpers';
import { apiRatings } from '../api';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '../store/app/appSlice';
import Swal from 'sweetalert2'
import path from '../utils/path';
import { useNavigate } from 'react-router-dom';


const ProductInformation = ({totalRatings, ratings, nameProduct, pid, rerender}) => {
    const [activedTab, setActivedTab] = useState(1);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {isLoggedIn} = useSelector(state => state.user)

    const handleSubmitVoteOption =  async ({comment, score, files}) => { 
        if (!comment || !pid || !score) {
            alert('Please rate the product before clicking submit.')
            return
        }
        const response = await apiRatings({ star: score,  comment, pid, updatedAt: Date.now() })
        if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Success assessment',
              text: 'Your rating has been submitted successfully',
              timer: 2000,
              showConfirmButton: false
            });
        }
        dispatch(showModal({
            isShowModal: false, modalChildren:null
        }))
        rerender()
    }

    const handleVoteNow = () => { 
        if (!isLoggedIn) {
          Swal.fire({
            text: 'Login to rating product.',
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Login now',
            title: 'Oops!',
            showCancelButton: true
          }).then((result) => { 
            if (result.isConfirmed) navigate(`/${path.LOGIN}`)
          });
        } else {
          dispatch(showModal({
            isShowModal: true,
            modalChildren: (
              <VoteOption 
                nameProduct={nameProduct} 
                pid={pid}  
                handleSubmitVoteOption={handleSubmitVoteOption}
              />
            )
          }));
        }
      }

    return (
        <div className='font-main2'>
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
            <div className='flex flex-col py-8 w-main'>
                <span className={`py-2 px-4 cursor-pointer bg-white border border-b-0 font-bold`}>
                    CUSTOMER REVIEW:
                </span>
                    <div className='flex border-item'>
                        <div className='flex-4 flex flex-col items-center justify-center'>
                            <span className='font-semibold text-3xl '>
                                {`${totalRatings}/5`}
                            </span>
                            <span className='flex items-center gap-1'>
                                {renderStarFromNumber(totalRatings)?.map((el, index) => (
                                    <span key={index}>
                                        {el}
                                    </span>
                                ))}
                            </span>
                            <span className='text-sm'>
                                {`${ratings?.length} Evaluate`}
                            </span>
                        </div>
                        <div className='flex-6 gap-2 p-4 flex flex-col'>
                            {Array.from(Array(5).keys()).reverse().map(el => (
                                <Votebar 
                                    key={el} 
                                    number={el+1} 
                                    ratingTotal={ratings?.length} 
                                    ratingCounts={ratings?.filter(i => i.star === el + 1)?.length}
                                />
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col p-4 items-center justify-center'>
                        <span>How do you rate this product?</span>
                        <Button handleOnClick={handleVoteNow}>
                            Rate now!
                        </Button>
                    </div>
                    <div>
                        {ratings?.map(el => (
                            <Comment 
                            key={el._id}
                            star={el.star}
                            updatedAt={el.updatedAt}
                            comment={el.comment}
                            name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
                            />
                        ))}
                    </div>
                </div>
        </div>
    );
};

export default memo(ProductInformation);