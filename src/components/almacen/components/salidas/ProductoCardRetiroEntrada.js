import { Avatar, InputNumber, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { fetchConToken } from '../../../../helpers/fetch';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';

export const ProductoCardRetiroEntrada = ({producto,socket,cambiarCantidadProducto,eliminarProducto,tipo=""}) => {

    console.log("PRODUCTO",producto);
    const [productoInfo, setProductoInfo] = useState(null);

    //Cada vez que el componente se renderize mandaremos a llamar a la información del producto
    //Solo se hara la primera vez!
    useEffect(() => {
        const fetchData = async() => {
            const resp = await fetchConToken(`/productos/${producto.id}`);
            const body = await resp.json();
            if(resp.status === 200) return setProductoInfo(body);
            message.error("Producto No encontrado!");
        }
        fetchData();
    }, []);
    

    //Escuchar en la targeta del producto por si este se actualiza 
    useEffect(() => {
        socket.on("actualizar-producto",(productoActualizado)=>{
            if( producto._id === productoActualizado._id) setProductoInfo(producto); 
        });
    }, [socket,productoInfo,setProductoInfo]);

    if(productoInfo === null) return <SanzSpinner/>
    else return (
        <div className="row p-5 border" style={{maxWidth:"600px",minWidth:"350px"}}>
            <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                <Avatar shape="square" style={{height:"150px",width:"150px"}} src={`http://localhost:4000/api/uploads/productos/${productoInfo._id}`}/>
            </div>
            <div className="col-12 col-lg-6">
                <h5 className="fw-bold">{productoInfo.nombre}</h5>
                {productoInfo.estatus ? <p className="text-success">Disponible</p> : <p className="text-danger">No disponible</p>}
                {
                    tipo === "" 
                        ? <p className="text-danger">Cantidad a retirar: <InputNumber className="text-danger" bordered={false} size="small" min={1} value={producto.cantidad} onChange={(e)=>{cambiarCantidadProducto(productoInfo,e)}}/></p>
                        : <p className="text-success">Cantidad a ingresar: <InputNumber className="text-success" bordered={false} size="small" min={1} value={producto.cantidad} onChange={(e)=>{cambiarCantidadProducto(productoInfo,e)}}/></p>
                }
                <p className="text-white bg-dark">(cantidad en bodega: {productoInfo.cantidad})</p>
                <p className="text-muted mt-3">{productoInfo.descripcion.slice(0,130)}...</p>
                {producto.cantidad > 1 ? <a className="text-danger" onClick={()=>{eliminarProducto(producto.id)}}>Eliminar productos</a> : <a className="text-danger" onClick={()=>{eliminarProducto(producto.id)}}>Eliminar producto</a>}
            </div>
        </div>
    )
}
