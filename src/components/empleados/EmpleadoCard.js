import { Image } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';

export const EmpleadoCard = ({empleado}) => {
  const imagePath = `http://localhost:4000/api/uploads/usuarios/${empleado.uid}`;
    
    return (
    <div className="card mb-3 shadow" >
    <div className="row g-0">
      <div className="col-md-4">
        <Image src={imagePath} className="img-fluid rounded-start" alt={empleado.uid} width={300} height={300} style={{objectFit:"cover"}}/>
      </div>
      <div className="col-md-8">
        <div className="card-body">
          <h1 className="card-title">{empleado.nombre}</h1>
          <p className="card-text">Telefono: {empleado.telefono}</p>
          <p className="card-text">Correo electronico: {empleado.correo}</p>
          <p className="card-text"><small className="text-muted">{empleado.rol}</small></p>
          <Link to={`/aplicacion/empleado/${empleado.uid}`} className='btn btn-outline border'>Ver datos completos del empleado</Link>
        </div>
      </div>
    </div>
  </div>     
  )
}
