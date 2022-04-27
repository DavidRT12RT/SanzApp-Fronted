import React from 'react'
import { useParams } from 'react-router-dom'

export const ObraScreen = () => {
  const {obraId} = useParams();
  return (
    <div>{obraId}</div>
  )
}
