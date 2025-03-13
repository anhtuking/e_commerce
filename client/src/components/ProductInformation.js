import React, { memo, useState, useCallback } from 'react';
import { productInfoTabs } from '../utils/contants';
import {Button, Votebar, VoteOption} from './';
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
        const response = await apiRatings({ star: score,  comment, pid })
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
                <span
                        className={`py-2 px-4 cursor-pointer ${activedTab === 5 ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        onClick={() => setActivedTab(5)}
                    >
                        CUSTOMER REVIEW
                    </span>
            </div>
            <div className='w-full p-4 border'>
                {productInfoTabs.some(el => el.id === activedTab) && productInfoTabs.find(el => el.id === activedTab)?.content}
                {activedTab === 5 && <div className='flex flex-col p-4'>
                    <div className='flex'>
                        <div className='flex-4 border-item flex flex-col items-center justify-center'>
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
                        <div className='flex-6 border-item gap-2 p-4 flex flex-col'>
                            {Array.from(Array(5).keys()).reverse().map(el => (
                                <Votebar 
                                    key={el} 
                                    number={el+1} 
                                    ratingTotal={ratings?.length} 
                                    ratingCounts={ratings.filter(i => i.star === el + 1)?.length}
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
                </div>
                }
            </div>
        </div>
    );
};

export default memo(ProductInformation);