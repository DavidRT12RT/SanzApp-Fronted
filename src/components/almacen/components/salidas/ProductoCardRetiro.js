import { Avatar, InputNumber, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { Loading } from '../../../obras/Loading';

export const ProductoCardRetiro = ({producto,socket,cambiarCantidadProducto,eliminarProducto}) => {

    const [productoInfo, setProductoInfo] = useState(null);

    //Cada vez que el componente se renderize mandaremos a llamar a la información del producto
    //Solo se hara la primera vez!
    useEffect(() => {
        socket.emit("obtener-producto-por-id",{productoId:producto.id},(producto)=>{
            setProductoInfo(producto); 
        });
    }, []);

    
    if(productoInfo === null){
        return <Loading/>
    }else{
        return (
            <div className="row p-5 border" style={{maxWidth:"600px",minWidth:"350px"}}>
                <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                    <Avatar shape="square" style={{height:"150px",width:"150px"}} src={`http://localhost:4000/api/uploads/productos/${productoInfo._id}`}/>
                </div>
                <div className="col-12 col-lg-6">
                    <h5 className="fw-bold">{productoInfo.nombre}</h5>
                    {productoInfo.estatus ? <p className="text-success">Disponible</p> : <p className="text-danger">No disponible</p>}
                    <p>Cantidad a retirar: <InputNumber bordered={false} size="small" min={1} value={producto.cantidad} onChange={(e)=>{cambiarCantidadProducto(productoInfo,e)}}/></p>
                    <p className="text-white bg-dark">(cantidad en bodega: {productoInfo.cantidad})</p>
                    <p className="text-muted">{productoInfo.descripcion}</p>
                    {producto.cantidad > 1 ? <a className="text-danger" onClick={()=>{eliminarProducto(producto.id)}}>Eliminar productos</a> : <a className="text-danger" onClick={()=>{eliminarProducto(producto.id)}}>Eliminar producto</a>}
                </div>
            </div>
        )
    }
}
