import React, { memo, useState, useEffect } from 'react';
import { productInfoTabs } from 'utils/contants';
import Button from 'components/common/Button';
import Votebar from 'components/review/Votebar';
import VoteOption from 'components/review/VoteOption';
import Comment from 'components/review/Comment';
import { renderStarFromNumber } from 'utils/helpers';
import { apiRatings } from 'api';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from 'store/app/appSlice';
import Swal from 'sweetalert2'
import path from 'utils/path';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';


const ProductInformation = ({ totalRatings, ratings, nameProduct, pid, rerender, productInfo }) => {
    const [activedTab, setActivedTab] = useState(1);
    const [customTabs, setCustomTabs] = useState([]);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isLoggedIn } = useSelector(state => state.user)

    useEffect(() => {
        if (productInfo) {
            const tabs = [
                {
                    id: 1,
                    name: "Đánh giá",
                    content: productInfoTabs.find(tab => tab.id === 1)?.content || ""
                },
                {
                    id: 2,
                    name: "Mô tả",
                    content: productInfo?.describe || "Không có thông tin mô tả"
                }
            ];
            setCustomTabs(tabs);
        } else {
            setCustomTabs(productInfoTabs);
        }
    }, [productInfo]);


    const handleSubmitVoteOption = async ({ comment, score, files }) => {
        if (!comment || !pid || !score) {
            alert('Please rate the product before clicking submit.')
            return
        }
        const response = await apiRatings({ star: score, comment, pid, updatedAt: Date.now() })
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
            isShowModal: false, modalChildren: null
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
        <div className='font-main'>
            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {customTabs.map(e1 => (
                    <span
                        className={`py-2 px-4 cursor-pointer ${activedTab === e1.id ? 'bg-white border border-b-0' : 'bg-gray-200'}`}
                        key={e1.id}
                        onClick={() => setActivedTab(e1.id)}
                    >
                        {e1.name}
                    </span>
                ))}
            </div>
            <div className='w-full p-4 border overflow-hidden'>
                {activedTab === 1 && (
                    <div className='flex border-item py-4 overflow-hidden'>
                        <div className='flex-4 flex flex-col items-center justify-center'>
                            <span className='font-semibold text-3xl'>
                                {`${totalRatings}/5`}
                            </span>
                            <span className='flex items-center gap-1'>
                                {renderStarFromNumber(totalRatings)?.map((el, index) => (
                                    <span key={index}>{el}</span>
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
                                    number={el + 1}
                                    ratingTotal={ratings?.length}
                                    ratingCounts={ratings?.filter(i => i.star === el + 1)?.length}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {activedTab === 2 && (
                    <div className='whitespace-pre-wrap overflow-hidden break-words' style={{ textAlign: 'justify' }}>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(customTabs.find(tab => tab.id === 2)?.content || '')
                            }}
                        />
                    </div>
                )}
            </div>
            <div className='flex flex-col py-8 w-full'>
                <div className='flex flex-col p-4 items-center justify-center'>
                    <span>How do you rate this product?</span>
                    <Button handleOnClick={handleVoteNow}>Rate now!</Button>
                </div>
                <div>
                    {ratings?.map(el => (
                        <Comment
                            key={el._id}
                            star={el.star}
                            updatedAt={el.updatedAt}
                            comment={el.comment}
                            name={`${el.postedBy?.firstname} ${el.postedBy?.lastname}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(ProductInformation);