import React from 'react'
import { useParams } from 'react-router-dom'

export const EmpleadoScreen = () => {
  const {empleadoId} = useParams();

  return (

    <div>{empleadoId}</div>
  )
}
