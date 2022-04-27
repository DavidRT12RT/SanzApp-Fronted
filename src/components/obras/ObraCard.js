import React from 'react'
import { Link } from 'react-router-dom';

export const ObraCard = ({titulo,situacionReporte,plaza,sucursal,tipoReporte,numeroTrack,observaciones,_id,fecha}) => {

    const imagePath = "https://sanzconstructora.com/SanzInicio/PROYECTOALFA/img/image1.png";
    
    return (
        <div className="card mb-3 shadow" >
        <div className="row g-0">
    <div className="col-md-4">
      <img src={imagePath} className="img-fluid rounded-start" alt={_id}/>
    </div>
    <div className="col-md-8">
      <div className="card-body">
        <h1 className="card-title">{titulo}</h1>
        <p className="card-text">Situación del reporte: {situacionReporte}</p>
        <p className="card-text">Numero track: {numeroTrack}</p>
        <p className="card-text">Plaza: {plaza}</p>
        <p className="card-text">Tipo reporte {tipoReporte}</p>
        <p className="card-text"><small className="text-muted">{fecha}</small></p>
        <Link to={`/aplicacion/obra/${_id}`} className='btn btn-warning'>Ver datos completos de la obra</Link>
      </div>
    </div>
  </div>
</div>     
  )
}
