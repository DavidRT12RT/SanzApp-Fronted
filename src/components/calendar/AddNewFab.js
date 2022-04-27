import React from 'react'
import { useDispatch } from 'react-redux'
import { uiOpenModal } from '../../actions/uiActions';

export const AddNewFab = () => {

  const dispatch = useDispatch();

  const handleClick = (e) =>{
    dispatch(uiOpenModal());    
}

  return (
      <button className='btn btn-warning fab' onClick={handleClick} ><i className='fas fa-plus' ></i></button>
  )
}
