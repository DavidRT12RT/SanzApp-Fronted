import React from 'react'

import { PeopleFill,ArrowRightSquareFill, Bank2, Clipboard2Fill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import "./assets/styleSalidasAlmacen.css";



export const SalidaCard = ({salida}) => {

    const renderizarIcono = (tipo) => {
        switch (tipo) {
            case "obra":
                return <span style={{color:"#61AFEF",fontSize:"34px"}}><Bank2/></span>;
            
            case "resguardo":
                return <span style={{color:"#61AFEF",fontSize:"34px"}}><PeopleFill/></span>;
            
            case "merma":
                return <span style={{color:"#61AFEF",fontSize:"34px"}}><Clipboard2Fill/></span>;

            default:
                break;
        }
    }

    const renderizarTitulo = (tipo,salida) => {
        switch (tipo) {
            case "merma":
                return <h1 className="titulo-descripcion">Ningun beneficiario...</h1>
            case "obra":
                return <h1 className="titulo-descripcion">{salida.beneficiarioObra.titulo}</h1>
            case "resguardo":
                return <h1 className="titulo-descripcion">{salida.beneficiarioResguardo.nombre}</h1>
            default:
                break;
        }
    }

    return (
        <>
            <div className="salidaCard">
                {renderizarIcono(salida.tipo)}
                <div>
                    {renderizarTitulo(salida.tipo,salida)}
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
