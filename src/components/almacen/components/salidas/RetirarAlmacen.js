import { Button, Divider, Form, Input, message, Modal, Result, Select, Typography } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { SocketContext } from '../../../../context/SocketContext';
import { ProductoCardRetiroEntrada } from './ProductoCardRetiroEntrada';
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { fetchConToken } from '../../../../helpers/fetch';
const { Search } = Input;
const { confirm } = Modal;
const { Paragraph, Text } = Typography;

export const RetirarAlmacen = () => {

    const {socket} = useContext(SocketContext);
    const [listaProductos, setListaProductos] = useState([]);
    const [valueSearch, setValueSearch] = useState("");
    //Modal para rellenar información
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tipoSalida, setTipoSalida] = useState(null);
    const [obrasDesarollo, setObrasDesarollo] = useState([]);
    const [empleadosActivos, setEmpleadosActivos] = useState([]);
    const [loading, setLoading] = useState(false);
    //Marcador que nos ayudara a saber si se termino el proceso y mostrar la pantalla de success
    const [finishRetiro, setFinishRetiro] = useState({estatus:false,salida:{}});

    const agregarProducto = async(id) => {

        const resp = await fetchConToken(`/productos/${id}`);
        const body = await resp.json();

        if(resp.status != 200) {
            setValueSearch("");
            return message.error("No existe ningun producto por ese ID!");
        }

        if(body.estatus === false ) {
            setValueSearch("");
            return message.error("Producto con estatus NO DISPONIBLE");
        }

        if(body.cantidad === 0){
            setValueSearch();
            return message.error("Producto sin cantidad en stock registrado!");
        }

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
    const realizarRetiroAlmacen = (values) => {
        confirm({
            title:"¿Seguro quieres retirar estos productos del almacen?",
            icon:<ExclamationCircleOutlined />,
            content:"La cantidad sera restada de el almacen y un registro se creara y NO habra forma de borrarlo.",
			okText:"Realizar retiro",
			cancelText:"Volver atras",
            async onOk(){
                setLoading(true);
                const resp = await fetchConToken("/salidas/retiro-productos-almacen",{listaProductos,values},"POST");
                const body = await resp.json();
                if(resp.status === 200){
                    message.success(body.msg);
                    setIsModalVisible(false);
                    setFinishRetiro({estatus:true,salida:body.salida});
                }else{
                    message.error(body.msg);
                }
                setLoading(false);
           	},
        });
    }

    const renderizarOpciones = () => {
        //TODO : Comprobar que haya obras o empleados
        switch (tipoSalida) {
            case "obra":
                return (
                    obrasDesarollo.map(obra => {
                        return <Select.Option value={obra._id} key={obra._id}>{obra.titulo}</Select.Option>
                    })
                )
            case "resguardo":
                return (
                    empleadosActivos.map(empleado => {
                        return <Select.Option value={empleado.uid} key={empleado.uid}>{empleado.nombre}</Select.Option>
                    })
                )
        }
    }

    useEffect(() => {
        console.log(listaProductos);
    }, [listaProductos]);
    

    //Buscar información de las obras y empleados
    useEffect(() => {
        socket.emit("obtener-obras-en-desarollo",{},(obras)=>{setObrasDesarollo(obras)});
        socket.emit("obtener-empleados-activos",{},(empleados)=>{setEmpleadosActivos(empleados)});
    }, []);
    
    const handleDownloadEvidencia = async () => {
        try {
            console.log(finishRetiro.salida);
            const resp = await fetchConToken("/salidas/documento-pdf",{salidaId:finishRetiro.salida._id},"POST");
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',`${finishRetiro.salida._id}.pdf`);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    if(finishRetiro.estatus){
        return (
            <>
                <Result
                    status="success"
                    title="Retiro de productos de almacen con exito!"
                    subTitle={`La saida del producto o productos ha sido completada con exito, a continuacion se podra descargar el PDF de evidencia`}
                    extra={[
                        <Link to={`/almacen/productos/`}><Button type="primary" key="console">Regresar a almacen</Button></Link>,
                        <Button key="console" onClick={()=>{setListaProductos([]);setFinishRetiro(false)}} className="mt-3 mt-lg-0">Realizar mas retiro de productos</Button>,
                    ]}
                >
                    <div className="desc">
                        <Paragraph>
                            <Text strong style={{fontSize: 16,}}>
                                Haz retirado producto(s) del almacen, lee las siguientes pautas importantes para el correcto seguimiento del proceso
                            </Text>
                        </Paragraph>
                        <Paragraph>
                                <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                                Descargar el documento de evidencia de la salida &gt; <a href="#" onClick={handleDownloadEvidencia}>Click aqui!</a>
                        </Paragraph>
                        <Paragraph>
                                <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                                Guarda el documento PDF para si en el caso de que el producto o productos se han devueltos al almacen , 
                                estos puedan llevar un registro <br/> y la salida se ha actualizada en la Obra en sus materiales sacados de almacen o en los resguardos en el caso de los usuarios.
                        </Paragraph>
                    </div>
                </Result>
            </>
        );

    }else{
        return (
            <div className="d-flex mt-5 align-items-center flex-column gap-2" style={{height:"100vh",width:"100vw"}}>				
                <h1 className="display-6 fw-bold">Comienza a escanear</h1>
                <span className="d-block text-center">Ten seleccionado la barra de busqueda y escanea los codigos de los productos ,<br/>
                    al tener todos los productos escaneados llena el formulario final y listo!
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
                            <p className="text-muted text-center">Ten en cuenta que todos los productos a retirar tienen que estar marcados como "Disponibles" en caso contrario no podras realizar retiro de nada</p>
                            <Divider/>
                            {
                                listaProductos.map(producto => {
                                    return <ProductoCardRetiroEntrada key={producto.id} producto={producto} socket={socket} cambiarCantidadProducto={cambiarCantidadProducto} eliminarProducto={eliminarProducto}/>
                                })
                            }                               
                            </div>
                        <div className="container p-5 d-flex gap-2 justify-content-center align-items-center mt-3 flex-column">
                            <Button type="primary" onClick={()=>{setIsModalVisible(true)}}>Realizar retiro de almacen</Button>
                            <p className="text-muted text-center">Tendras que rellenar un formulario explicando el motivo y el beneficiario de todos estos productos</p>
                        </div>
                        <Modal footer={null} visible={isModalVisible} onCancel={()=>{setIsModalVisible(false)}} onOk={()=>{setIsModalVisible(false)}}>
                            <h2 className="fw-bold text-center">Realizar retiro de almacen</h2>
                            <p className="text-muted">A continuación marca que tipo de salida sera el producto o los productos.</p>
                            <Form onFinish={realizarRetiroAlmacen} layout="vertical">
                                <Form.Item label="Tipo de salida" name="tipoSalida" rules={[{ required: true, message: 'Debes seleccionar el tipo de salida!'}]}>
                                    <Select placeholder="Selecciona el tipo de salida del producto o productos" onChange={(value)=>{setTipoSalida(value)}}>
                                        <Select.Option value="obra">Salida a una obra</Select.Option>
                                        <Select.Option value="resguardo">Salida por resguardo</Select.Option>
                                        <Select.Option value="merma">Salida por merma</Select.Option>
                                    </Select>
                                </Form.Item>
                                {tipoSalida != null && tipoSalida != "merma" && 
                                    //Renderizaremos las obras o personas disponibles
                                    <Form.Item label="Beneficiario del producto o los productos" name="beneficiario" rules={[{ required: true, message: 'Debes seleccionar un beneficiario!'}]}>
                                        <Select placeholder="Selecciona el beneficiario">
                                            {renderizarOpciones()}
                                        </Select>
                                    </Form.Item>
                                }

                                <Form.Item label="Motivo de la salida" name="motivo" rules={[{ required: true, message: 'Debes seleccionar un beneficiario!'}]}>
                                    <Input.TextArea/>
                                </Form.Item>

                                <Button type="primary" htmlType="submit" loading={loading}>Realizar retiro de almacen</Button>
                            </Form>
                        </Modal>
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
                        <Paragraph>
                                <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                                Ten en cuenta que el producto tiene que aparecer como "disponible" en el almacen para poder ser añadido a la lista de productos que se retiraran
                        </Paragraph>
                    </div>)
                }

            </div>
        )
    }
}
