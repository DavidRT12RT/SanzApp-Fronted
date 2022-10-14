import React from 'react'
import "./assets/styleInventariosAlmacen.css";
import { ArrowRightSquareFill, Box2Fill,Box2HeartFill,Boxes,BracesAsterisk } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

export const InventarioCard = ({inventario}) => {
    
    const renderizarIcono = (categoria) => {
        switch (categoria) {
            case "TODOS":
                return <BracesAsterisk/> 

            case "VARIOS-PRODUCTOS":
                return <Boxes/>

            case "UN-PRODUCTO":
                return <Box2Fill/> 

            case "POR-CATEGORIA":
                return <Box2HeartFill/>
        }
    }


    return (
        <div className="inventarioCard">
            <div>
                <h1 className="titulo-descripcion">{inventario.titulo}</h1>
                <div className="d-flex justify-content-start align-items-center flex-wrap gap-lg-3">
                    <p className="nota text-muted text-start">Inventariados: {inventario.productosInventariados.length}</p>
                    <p className="nota text-muted text-start">Fecha: {inventario.fechaRegistro}</p>
                    <p className="nota text-muted text-start">Tipo: {inventario.tipo}</p>
                </div>
            </div>
            
            <Link to={`/almacen/inventarios/${inventario._id}`}><span style={{color:"#61AFEF",fontSize:"34px"}}><ArrowRightSquareFill/></span></Link>

        </div>
    )
}
