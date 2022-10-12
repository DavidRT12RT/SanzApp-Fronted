import React from 'react'

import { PeopleFill,ArrowRightSquareFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import "./assets/styleSalidasAlmacen.css";

export const SalidaCard = ({salida}) => {
    const colors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
    ];

    return (
        <>
            <div className="salidaCard">

                <span style={{color:"#61AFEF",fontSize:"34px"}}><PeopleFill/></span>

                <div>
                    <p className="titulo-descripcion">{salida.beneficiarioObra.titulo}</p>
                    <div className="d-flex justify-content-start align-items-center flex-wrap gap-lg-3">
                        <p className="nota text-muted text-start">Retirados: {salida.listaProductos.length}</p>
                        <p className="nota text-muted text-start">Fecha: {salida.fechaCreacion}</p>
                        <p className="nota text-muted text-start">Total: <span className="text-success">${salida.costoTotal}</span></p>
                    </div>
                </div>

               <Link to={`/almacen/salidas/${salida._id}`}><span style={{color:"#61AFEF",fontSize:"34px"}}><ArrowRightSquareFill/></span></Link>

            </div>
        </>
    )
}
