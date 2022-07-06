import { Avatar, Tag } from 'antd';
import React from 'react'
import { Loading } from '../../../../obras/Loading';
import { Link } from 'react-router-dom';

export const ProductoCard = ({producto}) => {

    const categoriaColor = (categoria) => {
        switch (categoria) {
            case "ferreteria":
                return <Tag color="cyan" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "vinilos":
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "herramientas":
                return <Tag color="blue" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" key="categoria">{categoria.toUpperCase()}</Tag>
            case "fontaneria":
                return <Tag color="red" key="categoria">{categoria.toUpperCase()}</Tag>
            case "iluminacion":
                return <Tag color="yellow" key="categoria">{categoria.toUpperCase()}</Tag>
            case "materialElectrico":
                return <Tag color="gold" key="categoria">{categoria.toUpperCase()}</Tag>
            default:
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
        }
    }

    if(producto === null){
        return <Loading/>
    }else{
        return (
            <div className="row p-5 border" style={{maxWidth:"500px",minWidth:"150px"}}>
                <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                    <Avatar shape="square" style={{height:"150px",width:"150px"}} src={`http://localhost:4000/api/uploads/productos/${producto._id}`}/>
                </div>
                <div className="col-12 col-lg-6">
                    <h5 className="fw-bold">{producto.nombre}</h5>
                    {producto.estatus ? <p className="text-success">Disponible</p> : <p className="text-danger">No disponible</p>}
                    <p>Cantidad disponible en bodega: {producto.cantidad}</p>
                    <span>Categorias del producto:</span><br/>
                    <div className="d-flex justify-content-start gap-2 flex-wrap mt-3">
                        {producto.categorias.map(categoria => categoriaColor(categoria))}
                    </div>
                    <p className="text-muted mt-3">{producto.descripcion}</p>
                    <Link to={`/almacen/productos/${producto._id}/`}>Ver información del producto</Link>
                </div>
            </div>
        )
    }
}

