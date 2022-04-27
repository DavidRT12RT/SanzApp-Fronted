import React from 'react'
import { useDispatch } from 'react-redux'
import { eventClearActiveEvent, eventDeleted } from '../../actions/eventsActions';

export const DeleteEventFab = () => {
  const dispatch = useDispatch();
  const handleDelete = () =>{
    dispatch(eventDeleted());
    dispatch(eventClearActiveEvent());
  }
  return (
    <button className="btn btn-danger fab-danger" onClick={handleDelete}>
        <i className='fas fa-trash'>
        </i>
    </button>
  )
}
