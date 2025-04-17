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


    const handleSubmitVoteOption = async ({ comment, score }) => {
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
            {/* Tabs navigation */}
            <div className='flex items-center gap-2 relative bottom-[-1px]'>
                {customTabs.map(e1 => (
                    <span
                        className={`py-3 px-6 cursor-pointer rounded-t-lg transition-all duration-200 font-medium ${
                            activedTab === e1.id 
                            ? 'bg-white border border-b-0 border-gray-300 text-blue-600' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        key={e1.id}
                        onClick={() => setActivedTab(e1.id)}
                    >
                        {e1.name}
                    </span>
                ))}
            </div>
            
            {/* Tab content */}
            <div className='w-full p-6 border border-gray-300 rounded-b-lg rounded-tr-lg shadow-sm bg-white overflow-hidden'>
                {/* Ratings tab */}
                {activedTab === 1 && (
                    <div className='flex flex-col md:flex-row border-item py-6 overflow-hidden'>
                        {/* Rating summary */}
                        <div className='md:flex-4 flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg'>
                            <span className='font-bold text-4xl text-red-600 mb-2'>
                                {`${totalRatings}/5`}
                            </span>
                            <span className='flex items-center gap-1 mb-2'>
                                {renderStarFromNumber(totalRatings)?.map((el, index) => (
                                    <span key={index}>{el}</span>
                                ))}
                            </span>
                            <span className='text-sm bg-blue-100 text-gray-800 px-3 py-1 rounded-full font-medium'>
                                {`${ratings?.length} Đánh giá`}
                            </span>
                        </div>
                        
                        {/* Rating bars */}
                        <div className='md:flex-6 gap-3 p-6 flex flex-col'>
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
                
                {/* Description tab */}
                {activedTab === 2 && (
                    <div className='whitespace-pre-wrap overflow-hidden break-words p-4 bg-white rounded-lg' style={{ textAlign: 'justify' }}>
                        <div
                            className='product-description prose prose-blue max-w-none'
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(customTabs.find(tab => tab.id === 2)?.content || '')
                            }}
                        />
                    </div>
                )}
            </div>
            
            {/* Rate now section */}
            <div className='flex flex-col py-8 w-full'>
                <div className='flex flex-col p-6 items-center justify-center bg-gray-50 rounded-lg my-4'>
                    <span className='text-lg font-medium mb-3'>Bạn nghĩ gì về sản phẩm này?</span>
                    <Button 
                        handleOnClick={handleVoteNow}
                        className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all'
                    >
                        Đánh giá ngay
                    </Button>
                </div>
                
                {/* Comments section */}
                <div className='space-y-4 mt-4'>
                    <h3 className='font-medium text-lg border-b border-gray-200 pb-3 mb-4'>
                        <span className="text-red-600 mr-2">❝</span>
                        Nhận xét từ khách hàng
                        <span className="text-red-600 ml-2">❞</span>
                    </h3>
                    {ratings?.length > 0 ? (
                        ratings.map(el => (
                            <Comment
                                key={el._id}
                                star={el.star}
                                updatedAt={el.updatedAt}
                                comment={el.comment}
                                name={`${el.postedBy?.firstname} ${el.postedBy?.lastname}`}
                                postedBy={el.postedBy}
                            />
                        ))
                    ) : (
                        <div className='text-gray-500 italic text-center py-8 bg-gray-50 rounded-lg'>
                            <p>Chưa có đánh giá nào cho sản phẩm này</p>
                            <p className='text-sm mt-2'>Hãy là người đầu tiên đánh giá!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(ProductInformation);