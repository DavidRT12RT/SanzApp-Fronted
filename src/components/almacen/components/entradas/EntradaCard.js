import React from 'react'

import { PeopleFill,ArrowRightSquareFill, Bank2, Clipboard2Fill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

import "./assets/styleEntradasAlmacen.css";

export const EntradaCard = ({entrada}) => {
    
    const renderizarIcono = (tipo) => {
        console.log(tipo);
        switch (tipo) {
            case "sobrante-obra":
                return <span style={{color:"#61AFEF",fontSize:"34px"}}><Bank2/></span>;
            
            case "devolucion-resguardo":
                return <span style={{color:"#61AFEF",fontSize:"34px"}}><PeopleFill/></span>;
            
            case "compra-directa":
                return <span style={{color:"#61AFEF",fontSize:"34px"}}><Clipboard2Fill/></span>;

            default:
                break;
        }
    }


    return (
        <>
            <div className="entradaCard">
                {renderizarIcono(entrada.tipo)}
                <div>
                    <h1 className="titulo-descripcion">BENEFICIARIO ALMACEN</h1>
                    <div className="d-flex justify-content-start align-items-center flex-wrap gap-lg-3">
                        <p className="nota text-muted text-start">Ingresados: {entrada.listaProductos.length}</p>
                        <p className="nota text-muted text-start">Fecha: {entrada.fecha}</p>
                    </div>
                </div>

               <Link to={`/almacen/entradas/${entrada._id}`}><span style={{color:"#61AFEF",fontSize:"34px"}}><ArrowRightSquareFill/></span></Link>

            </div>
        </>
    )
}
