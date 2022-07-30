import { Button, DatePicker, Divider, Form, Input, message, Modal, Select, Table } from 'antd';
import { ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import locale from "antd/es/date-picker/locale/es_ES"
import "./assets/style.css";
import { useProductos } from '../../../../hooks/useProductos';
import { fetchConToken } from '../../../../helpers/fetch';
const { RangePicker } = DatePicker
const { confirm } = Modal;


export const RegistrarInventario = () => {
    const [form] = Form.useForm();
    const [isModalProductosVisible, setIsModalProductosVisible] = useState({estado:false,tipo:"null"});
    const { isLoading:isLoadingProductos,productos } = useProductos();    
    const [productosSelected, setProductosSelected] = useState([]);

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

    const renderizarOpcionesProducto = (e) => {
        setProductosSelected([]);
        //Renderizar modal con los productos
        switch (e) {
            case "Todos":
                //Poner todos los productos
                setProductosSelected(productos);
                return;
            case "seleccionarProducto":
                return setIsModalProductosVisible({estado:true,tipo:"seleccionarProducto"});
            case "seleccionarProductos":
                return setIsModalProductosVisible({estado:true,tipo:"seleccionarProductos"});
        }
    }

    const registrarInventario = (values) => {
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
            }
        });
    }

    //Objecto de configuracion de la tabla cuando el usuario eliga una fila de esta misma.
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setProductosSelected(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: isModalProductosVisible.tipo === "seleccionarProducto" &&  productosSelected.length === 1,
        }),
    };
   
    return (
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
                    <Form.Item name="tipo" initialValue={"Todos"} label={"Inventario de"}  rules={[{required: true,message: 'Ingresa el tipo de inventario que es',},]}>
                        <Select size="large" onChange={(e)=>{renderizarOpcionesProducto(e)}}>
                            <Select.Option value="Todos">Todos los productos</Select.Option>
                            <Select.Option value="seleccionarProductos">Seleccionar los productos</Select.Option>
                            <Select.Option value="seleccionarProducto">Solo un producto</Select.Option>
                        </Select>
                    </Form.Item>
                    {productosSelected.length > 0 && <p className="nota text-danger">Cantidad de productos a inventariar: {productosSelected.length}</p>}
                    <Button type="primary" className="mt-4" htmlType="submit">Comenzar inventario!</Button>
                </Form>
            </section>

            <Modal visible={isModalProductosVisible.estado} onOk={()=>{setIsModalProductosVisible({estado:false,tipo:"null"})}} onCancel={()=>{setIsModalProductosVisible({estado:false,tipo:"null"})}}>
                {isModalProductosVisible.tipo === "seleccionarProductos" ? <h1 className="titulo">Seleccionar productos</h1> : <h1 className="titulo">Seleccionar producto</h1>}
                {isModalProductosVisible.tipo === "seleccionarProductos" ? <p className="descripcion">Selecciona los productos que tendra el inventario.</p> :<p className="descripcion">Selecciona el producto que tendra el inventario.</p>}
                <Table rowSelection={rowSelection} columns={columns} dataSource={productos} />
            </Modal>
       </div>
    );
}
