import { Avatar, Tag } from 'antd';
import React from 'react'
import { Loading } from '../../../../obras/Loading';
import { Link, useLocation, useParams } from 'react-router-dom';

export const ProductoCard = ({producto,rol}) => {


    //Ruta sera igual a la asignacion de esto
    //const ruta = (rol === ( "ENCARGADO_ALMACEN_ROL"  || "ADMIN_ROLE" ) ? `/almacen/productos/${producto._id}/` : `/aplicacion/almacen/${producto._id}`)
    const { pathname } = useLocation();
    const ruta = (pathname != "/aplicacion/almacen") ? `/almacen/productos/${producto._id}/` : `/aplicacion/almacen/${producto._id}`;


    const categoriaColor = (categoria) => {
        switch (categoria.toLowerCase()) {
            case "ferreteria":
                return <Tag color="cyan" key="ferreteria">{categoria.toUpperCase()}</Tag> 
            case "vinilos":
                return <Tag color="green" key="vinilos">{categoria.toUpperCase()}</Tag> 
            case "herramientas":
                return <Tag color="blue" key="herramientas">{categoria.toUpperCase()}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" key="pisosAzulejos">{categoria.toUpperCase()}</Tag>
            case "fontaneria":
                return <Tag color="red" key="fontaneria">{categoria.toUpperCase()}</Tag>
            case "iluminacion":
                return <Tag color="yellow" key="iluminacion">{categoria.toUpperCase()}</Tag>
            case "materialElectrico":
                return <Tag color="gold" key="materialElectrico">{categoria.toUpperCase()}</Tag>
            default:
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
        }
    }

    if(producto === null){
        return <Loading/>
    }else{
        return (
            <div className="row p-3 border" style={{maxWidth:"300px",minWidth:"150px",maxHeight:"400px"}}>
                <div className="col-12  mb-3 mb-lg-0">
                    <Avatar shape="square" style={{height:"100px",width:"100px"}} src={`http://localhost:4000/api/uploads/productos/${producto._id}`}/>
                </div>
                <div className="col-12 mt-3">
                    <h6 className="fw-bold">{producto.nombre}</h6>
                    {producto.estatus ? <p className="text-success">Disponible</p> : <p className="text-danger">No disponible</p>}
                    <span>Categorias del producto:</span><br/>
                    <div className="d-flex justify-content-start gap-2 flex-wrap my-3">
                        {producto.categorias.map(categoria => categoriaColor(categoria.nombre))}
                    </div>
                    <Link to={ruta}>Ver información del producto</Link>
                </div>
            </div>
        )
    }
}
