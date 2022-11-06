import { Avatar, Button, Tag } from 'antd';
import React from 'react'
import { Loading } from '../../../../obras/Loading';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import "./assets/styleProductoCard.css";

export const ProductoCard = ({producto,rol}) => {


    //Ruta sera igual a la asignacion de esto
    //const ruta = (rol === ( "ENCARGADO_ALMACEN_ROL"  || "ADMIN_ROLE" ) ? `/almacen/productos/${producto._id}/` : `/aplicacion/almacen/${producto._id}`)
    const { pathname } = useLocation();
    const ruta = pathname.startsWith("/almacen") ? `/almacen/productos/${producto._id}/`: `/aplicacion/almacen/${producto._id}/`; 
    const navigate = useNavigate();


    if(producto === null){
        return <Loading/>
    }else{
        return (
            <div className="row p-4 producto-card-container border" style={{width:"300px"}} onClick={() => {
                navigate(ruta);
            }}>
                <div className="col-12 mb-3 mb-lg-0 d-flex justify-content-center align-items-center">
                    <img style={{height:"186.67px",width:"186.67px"}} src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/productos/${producto._id}`}/>
                </div>
                <div className="col-12 mt-3">
                    <p className="titulo-descripcion text-success">${producto.costo}</p>
                    <h6 className="fw-bold">{producto.nombre}</h6>
                    {producto.estatus ? <p className="text-success">Disponible</p> : <p className="text-danger">No disponible</p>}
                </div>
            </div>
        )
    }
}
