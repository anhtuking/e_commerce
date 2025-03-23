import React from 'react'
import { useSelector } from 'react-redux';

const DetailCart = () => {
    const { current } = useSelector(state => state.user);
  return (
    <div>DetailCart</div>
  )
}

export default DetailCart