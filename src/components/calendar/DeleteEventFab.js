import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { eventClearActiveEvent,startEventDeleted } from '../../actions/eventsActions';

export const DeleteEventFab = () => {
  const dispatch = useDispatch();
  const { activeEvent } = useSelector(store => store.calendar);

  const handleDelete = () =>{
    dispatch(startEventDeleted(activeEvent.id));
  }
  return (
    <button className="btn btn-danger fab-danger" onClick={handleDelete}>
        <i className='fas fa-trash'>
        </i>
    </button>
  )
}
