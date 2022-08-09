import { Avatar, Button, Tag } from 'antd';
import React from 'react'
import { Loading } from '../../../../obras/Loading';
import { Link, useLocation, useParams } from 'react-router-dom';

export const ProductoCard = ({producto,rol}) => {


    //Ruta sera igual a la asignacion de esto
    //const ruta = (rol === ( "ENCARGADO_ALMACEN_ROL"  || "ADMIN_ROLE" ) ? `/almacen/productos/${producto._id}/` : `/aplicacion/almacen/${producto._id}`)
    const { pathname } = useLocation();
    const ruta = pathname.startsWith("/almacen") ? `/almacen/productos/${producto._id}/`: `/aplicacion/almacen/${producto._id}/`; 


    if(producto === null){
        return <Loading/>
    }else{
        return (
            <div className="row p-4 border" style={{width:"300px"}}>
                <div className="col-12 mb-3 mb-lg-0 d-flex justify-content-center align-items-center">
                    <Avatar shape="square" style={{height:"100px",width:"100px"}} src={`http://localhost:4000/api/uploads/productos/${producto._id}`}/>
                </div>
                <div className="col-12 mt-3 text-center">
                    <h6 className="fw-bold">{producto.nombre}</h6>
                    {producto.estatus ? <p className="text-success">Disponible</p> : <p className="text-danger">No disponible</p>}
                    <p>Cantidad en stock: <span className="bg-info">{producto.cantidad}</span></p>
                    <p>Categoria del producto:</p>
                    <Tag className="mb-3" style={{backgroundColor:producto.categoria.color,borderColor:producto.categoria.color,fontSize:"13px",padding:"13px",maxWidth:"fit-content"}}>{producto.categoria.nombre}</Tag>
                    <Link to={ruta}><Button type="primary">Ver información del producto</Button></Link>
                </div>
            </div>
        )
    }
}
