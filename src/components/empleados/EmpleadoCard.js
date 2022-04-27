import React from 'react'
import { Link } from 'react-router-dom';

export const EmpleadoCard = ({
    uid,
    nombre,
    telefono,
    correo,
    rol,
    estado,
    RFC,
    CURP,
    NSS,
    fechaRegistro
}) => {
    const imagePath = "https://pbs.twimg.com/media/BN6AcjXCUAAgXbD.jpg";
    
    return (
        <div className="card mb-3 shadow" >
  <div className="row g-0">
    <div className="col-md-4">
      <img src={imagePath} className="img-fluid rounded-start" alt={uid}/>
    </div>
    <div className="col-md-8">
      <div className="card-body">
        <h1 className="card-title">{nombre}</h1>
        <p className="card-text">Telefono: {telefono}</p>
        <p className="card-text">Correo electronico: {correo}</p>
        <p className="card-text"><small className="text-muted">{rol}</small></p>
        <Link to={`/aplicacion/empleado/${uid}`} className='btn btn-warning'>Ver datos completos del empleado</Link>
      </div>
    </div>
  </div>
</div>     
  )
}
