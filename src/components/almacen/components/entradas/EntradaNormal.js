import { Button, Divider, Form, Input, message, Modal, Result, Select, Typography } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { SocketContext } from '../../../../context/SocketContext';
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { fetchConToken } from '../../../../helpers/fetch';
import { ProductoCardRetiroEntrada } from '../salidas/ProductoCardRetiroEntrada';
import { useSelector } from 'react-redux';
const { Search } = Input;
const { confirm } = Modal;
const { Paragraph, Text } = Typography;

export const EntradaNormal = () => {

    const {socket} = useContext(SocketContext);
    const [listaProductos, setListaProductos] = useState([]);
    const [valueSearch, setValueSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const { uid } = useSelector(store => store.auth);
    //Marcador que nos ayudara a saber si se termino el proceso y mostrar la pantalla de success
    const [finishEntrada, setFinishEntrada] = useState({estatus:false,entrada:{}});

    const agregarProducto = async(id) => {

        //Primera verificamos que el producto exista!
        const resp = await fetchConToken(`/productos/${id}`);
        const body = await resp.json();
        if(resp.status != 200) return message.error("No existe ningun producto por ese ID!");
        let bandera = false;
        const nuevaListaProductos = listaProductos.map(producto => {
            if(producto.id === id){
                bandera = true; 
                (body.cantidad - producto.cantidad) === 0 ? message.error("No puedes agregar mas de lo que hay en bodega registrado!") : producto.cantidad += 1;
            }
            return producto;
        });
        bandera ? setListaProductos(nuevaListaProductos) : setListaProductos(productos => [...productos,{id,cantidad:1,}]);
        setValueSearch("");
    }


    //Función para cambiar la cantida de un producto sea sumar o restar
    const cambiarCantidadProducto = (producto,cantidad) => {
        //Buscando el producto
        const nuevaListaProductos = listaProductos.map(item => {
            if(item.id === producto._id) (producto.cantidad - cantidad) < 0 ? message.error("No puedes agregar mas de lo que hay en bodega registrado!") : item.cantidad = cantidad;
            return item; 
        });
        setListaProductos(nuevaListaProductos);
    }

    //Función para eliminar un producto de la lista de productos a retirar
    const eliminarProducto = (id) => {
        const nuevaListaProductos = listaProductos.filter(producto => producto.id != id);
        setListaProductos(nuevaListaProductos);
    }
    
    //Función para mandar a hacer el retiro de los productos por socket.io
    const realizarIngresoAlmacen = () => {
        confirm({
            title:"¿Seguro quieres ingresar estos productos al almacen?",
            icon:<ExclamationCircleOutlined />,
            content:"La cantidad sera aumentada sobre los productos ingresados y un registro se creara y NO habra forma de borrarlo.",
			okText:"Realizar ingreso",
			cancelText:"Volver atras",
            async onOk(){
                const values = { uid };
                setLoading(true);
                const resp = await fetchConToken(`/entradas/ingresar-almacen`,{values,listaProductos},"POST");
                const body = await resp.json();
                if(resp.status != 200 ) return message.error(body.msg);//Si hay un error haciendo la peticion
                message.success(body.msg);
                setFinishEntrada({estatus:true});
                setLoading(false);
           	},
        });
    }


    useEffect(() => {
        console.log(listaProductos);
    }, [listaProductos]);
    
    
    const handleDownloadEvidencia = async () => {
        try {
            const resp = await fetchConToken("/entrada/documento-pdf",{},"POST");
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',`${"algo"}.pdf`);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    if(finishEntrada.estatus){
        return (
            <>
                <Result
                    status="success"
                    title="Ingreso de productos con exito!"
                    subTitle={`La entrada de producto(s) al almacen a sido completada con exito!, a continuacion se podra descargar el PDF de evidencia`}
                    extra={[
                        <Link to={`/almacen/productos/`}><Button type="primary" key="console">Regresar a almacen</Button></Link>,
                        <Button key="console" onClick={()=>{setListaProductos([]);setFinishEntrada({estatus:false,entrada:{}})}} className="mt-3 mt-lg-0">Realizar mas ingreso de productos</Button>,
                    ]}
                >
                </Result>
            </>
        );

    }else{
        return (
            <div className="d-flex mt-5 align-items-center flex-column gap-2" style={{height:"100vh",width:"100vw"}}>				
                <h1 className="display-6 fw-bold">Comienza a escanear</h1>
                <span className="d-block text-center">Ten seleccionado la barra de busqueda y escanea los codigos de los productos ,<br/>
                    al terminar solo da click en el boton de "Realizar ingreso a almacen" y listo!
                </span>
                <Search
                    placeholder="Ingresa un codigo de barras..."
                    allowClear
                    autoFocus
                    enterButton="Agregar"
                    size="large"
                    style={{width:"500px"}}
                    value={valueSearch}
                    onChange={(e)=>{setValueSearch(e.target.value)}}
                    onSearch={agregarProducto}
                /> 
                {listaProductos.length > 0 ? (
                    <>
                        <div className="d-flex justify-content-center align-items-center container p-5 gap-2 flex-column">
                            <Divider/>
                            {
                                listaProductos.map(producto => {
                                    return <ProductoCardRetiroEntrada key={producto.id} producto={producto} socket={socket} cambiarCantidadProducto={cambiarCantidadProducto} eliminarProducto={eliminarProducto} tipo={"entrada"}/>
                                })
                            }                               
                            </div>
                        <div className="container p-5 d-flex gap-2 justify-content-center align-items-center mt-3 flex-column">
                            <Button type="primary" disabled={loading} onClick={realizarIngresoAlmacen}>{loading ? "Realizando ingreso a almacen..." : "Realizar ingreso a almacen"}</Button>
                        </div>
                    </>
                )
                : (
                    <div className="container p-5 mt-3">
                        <Paragraph>
                            <Text strong style={{fontSize: 16,}}>
                                Ten en cuenta las siguientes pautas antes de empezar a escanear el codigo de barra de algun producto
                            </Text>
                        </Paragraph>
                        <Paragraph>
                                <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                                Asegurate que el codigo de barras del producto sea visible y este en buen estado, de lo contrario sera imposible encontrar el producto.
                        </Paragraph>
                    </div>)
                }

            </div>
        )
    }
}