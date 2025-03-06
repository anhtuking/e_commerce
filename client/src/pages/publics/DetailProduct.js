import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetProduct } from '../../api/product';
import { Breadcrumb } from '../../components';

const DetailProduct = () => {
    const {pid, title} = useParams()
    // console.log(pid, title);
    const fetchProductData = async () => {
        const response = await apiGetProduct(pid)
        console.log(response);
    } 
    useEffect(() => {
        if(pid)  fetchProductData()
    }, [pid])
    return (
        <div className='w-full'>
            <div className='h-[81px] flex justify-center items-center bg-gray-100'>
                <div className='w-main'>
                    <h3>{title}</h3>
                    <Breadcrumb/>
                </div>
            </div>
        </div>
    )
}

export default DetailProduct