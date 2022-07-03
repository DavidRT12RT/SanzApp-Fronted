import { Avatar, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { Loading } from '../../../obras/Loading';

export const ProductoCardDevolucion = ({producto,listaProductosDevueltos}) => {

    const [cantidadDevuelta, setCantidadDevuelta] = useState(0);

    useEffect(() => {
        listaProductosDevueltos.map(productoADevolver => {
            if(productoADevolver.id === producto.id._id){
                setCantidadDevuelta(productoADevolver.cantidad);
            }
        });
    }, [listaProductosDevueltos]);
    
    const categoriaColor = (categoria) => {
        switch (categoria) {
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
                return <Tag color="gold" key="materialElectronico">{categoria.toUpperCase()}</Tag>
            default:
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
        }
    }

    if(producto === null){
        return <Loading/>
    }else{
        return (
            <div className="row p-5 border" style={{maxWidth:"600px",minWidth:"350px"}}>
                <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                    <Avatar shape="square" style={{height:"150px",width:"150px"}} src={`http://localhost:4000/api/uploads/productos/${producto.id._id}`}/>
                </div>
                <div className="col-12 col-lg-6">
                    <h5 className="fw-bold">{producto.id.nombre}</h5>
                    {producto.id.estatus ? <p className="text-success">Disponible</p> : <p className="text-danger">No disponible</p>}
                    <p className="text-white bg-success">Cantidad a devolver: {cantidadDevuelta}</p>
                    <p className="text-white bg-danger">(cantidad retirada del almacen: {producto.cantidad})</p>
                    <span>Categorias del producto:</span><br/>
                    <div className="d-flex justify-content-start gap-2 flex-wrap mt-3">
                        {producto.id.categorias.map(categoria => categoriaColor(categoria))}
                    </div>
                    <p className="text-muted mt-3">{producto.id.descripcion}</p>
                </div>
            </div>
        )
    }
}

