import { Button, DatePicker, Divider, Form, Input, message, Modal, Select, Table,Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import locale from "antd/es/date-picker/locale/es_ES"
import "./assets/style.css";
import { useProductos } from '../../../../hooks/useProductos';
import { fetchConToken } from '../../../../helpers/fetch';
import { useCategorias } from '../../../../hooks/useCategorias';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
const { RangePicker } = DatePicker
const { confirm } = Modal;
const { Paragraph, Text } = Typography;


export const RegistrarInventario = () => {
    const [form] = Form.useForm();
    const [isModalProductosVisible, setIsModalProductosVisible] = useState({estado:false,tipo:"null"});
    const { isLoading:isLoadingCategorias, categorias } = useCategorias();
    const [isModalCategorias, setIsModalCategorias] = useState(false);
    const { isLoading:isLoadingProductos,productos } = useProductos();    
    const [productosSelected, setProductosSelected] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        productos.map(producto=> producto.key = producto._id);
        setProductosSelected(productos);
    }, [productos]);
    

    //Datos de la tabla de productos por si el usuario elege productos manualmente

    const columns = [
        {
            title:"Nombre",
            dataIndex:"nombre"
        },
        {
            title:"Marca",
            dataIndex:"marca"
        },
        {
            title:"Unidad",
            dataIndex:"unidad"
        },
        {
            title:"Detalles",
            render:(text,record)=>{
                return (
                    <a href={`/almacen/productos/${record._id}`} target="blank">Ver detalles</a>
                )
            }
        }
    ];

    const renderizarOpcionesInventario = (e) => {
        setProductosSelected([]);
        //Renderizar modal con los productos
        switch (e) {
            case "TODOS":
                //Poner todos los productos
                setProductosSelected(productos);
                return;
            case "VARIOS-PRODUCTOS":
                return setIsModalProductosVisible({estado:true,tipo:"seleccionarProductos"});
            case "UN-PRODUCTO":
                return setIsModalProductosVisible({estado:true,tipo:"seleccionarProducto"});
            case "POR-CATEGORIA":
                return setIsModalCategorias(true);
        }
    }

    const registrarInventario = (values) => {
        if(productosSelected.length === 0) return message.error("Ningun producto seleccionado para inventariar");
        //Ponemos los productos en la informacion que enviaremos
        values.productosInventariados = productosSelected.map(producto => ({id:producto._id,cantidadTeorica:producto.cantidad,cantidadContada:producto.cantidad}));
        values.intervaloFecha = [values.intervaloFecha[0].format("YYYY-MM-DD"),values.intervaloFecha[1].format("YYYY-MM-DD")];
		confirm({
            title:"¿Iniciar conteo de inventario ciclico?",
            icon:<ExclamationCircleOutlined />,
            content:"Iniciar un conteo de inventario ciclico con los productos ya seleccionados anteriormente...",
			okText:"Iniciar inventario",
			cancelText:"Volver atras",
            async onOk(){
                const resp = await fetchConToken("/inventarios/crear-inventario",values,"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                message.success(body.msg);
                navigate(`/almacen/inventarios/${body.inventario._id}`);
            }
        });
    }

    //Objecto de configuracion de la tabla cuando el usuario eliga una fila de esta misma.
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setProductosSelected(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: isModalProductosVisible.tipo === "seleccionarProducto" &&  productosSelected.length === 1,
        }),
    };
   
    
    if(isLoadingCategorias){
        return <SanzSpinner/>
    }else{
        console.log(categorias);
        return (
            <>
                <div className="container p-5">
                    <section className="text-center">
                        <h1 className="titulo" style={{fontSize:"32px"}}>Realizar un conteo de inventario</h1>
                        <h1 className="descripcion">Registrar un nuevo conteo de inventario ciclico para poder tener en regla el sistema y saber cuanta cantidad hay de cada producto registrado.</h1>
                        <Divider/>
                    </section>

                    <section className="formulario-registro-input-content">
                        <Form layout="vertical" form={form} onFinish={registrarInventario}>
                            <Form.Item name="titulo" label={"Titulo o referencia del reporte"} rules={[{required: true,message: 'Ingresa el titulo del reporte',},]}>
                                <Input size="large"/>
                            </Form.Item>
                            <Form.Item name="descripcion" label={"Descripcion del reporte de inventario"} rules={[{required: true,message: 'Ingresa la descripcion del reporte',},]}>
                                <Input.TextArea rows={5} size="large" />
                            </Form.Item>
                            <Form.Item name="intervaloFecha" label={"Intervalo fecha del inventario"} rules={[{required: true,message: 'Ingresa el intervalo de fecha del reporte',},]}>
                                <RangePicker size="large" locale={locale} style={{width:"100%"}}/>
                            </Form.Item>
                            <Form.Item name="tipo" initialValue={"TODOS"} label={"Inventario de"}  rules={[{required: true,message: 'Ingresa el tipo de inventario que es',},]}>
                                <Select size="large" onChange={(e)=>{renderizarOpcionesInventario(e)}}>
                                    <Select.Option value="TODOS">Todos los productos</Select.Option>
                                    <Select.Option value="VARIOS-PRODUCTOS">Varios productos</Select.Option>
                                    <Select.Option value="UN-PRODUCTO">Solo un producto</Select.Option>
                                    <Select.Option value="POR-CATEGORIA">Por categoria</Select.Option>
                                </Select>
                            </Form.Item>
                            {productosSelected.length > 0 && <p className="nota text-danger">Cantidad de productos a inventariar: {productosSelected.length}</p>}
                            <Button type="primary" className="mt-4" htmlType="submit">Comenzar inventario!</Button>
                        </Form>
                    </section>
                </div>

                <Modal visible={isModalProductosVisible.estado} onOk={()=>{setIsModalProductosVisible({estado:false,tipo:"null"})}} onCancel={()=>{setIsModalProductosVisible({estado:false,tipo:"null"})}}>
                    {isModalProductosVisible.tipo === "seleccionarProductos" ? <h1 className="titulo">Seleccionar productos</h1> : <h1 className="titulo">Seleccionar producto</h1>}
                    {isModalProductosVisible.tipo === "seleccionarProductos" ? <p className="descripcion">Selecciona los productos que tendra el inventario.</p> :<p className="descripcion">Selecciona el producto que tendra el inventario.</p>}
                    <Table rowSelection={rowSelection} columns={columns} dataSource={productos} />
                </Modal>

                <Modal visible={isModalCategorias} onOk={()=> {setIsModalCategorias(false)}} onCancel={()=> {setIsModalCategorias(false)}}>
                    <h1 className="titulo">Selecciona la categoria</h1>
                    <p className="descripcion">Selecciona la categorias de los productos a inventariar</p>
                    <Form form={form} layout={"vertical"}>
                        <Form.Item name="categoria" label="Categoria de los productos" rules={[{required: true,message: 'Ingresa la categoria de los productos',},]}>
                            <Select style={{width:"100%"}} onChange={(e)=>{
                                const categoria = categorias.filter(categoria => {
                                    if(categoria._id == e) return categoria;
                                })
                                setProductosSelected(categoria[0].productosRegistrados);
                            }}>
                                {categorias.map(categoria => {
                                    return (
                                        <Select.Option value={categoria._id}>{categoria.nombre}</Select.Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>
                    </Form>
               </Modal>

                <div className="container mt-5 p-5">
                    <Paragraph>
                        <Text strong style={{fontSize: 16,}}>
                            Ten en cuenta las siguientes cosas antes de registrar un inventario:
                        </Text>
                    </Paragraph>
                    <Paragraph>
                        <ExclamationCircleOutlined style={{color:"#FFC300"}}/> Por defecto TODOS los productos del almacen sera inventariados, 
                        puedes elegir cambiando en la casilla el tipo de inventario cuales seran los productos a inventariar.
                    </Paragraph>
                    <Paragraph>
                        <ExclamationCircleOutlined style={{color:"#FFC300"}}/> Una vez iniciado el inventario este solo se podra borrar por una cuenta con rango de "Administrador" .
                    </Paragraph>
                    <Paragraph>
                        <ExclamationCircleOutlined style={{color:"#FFC300"}}/> Para poder iniciar un inventario se necesita de que no haya otro con el estado "En progreso".
                    </Paragraph>
                </div>
            </>
        );
    }
}
