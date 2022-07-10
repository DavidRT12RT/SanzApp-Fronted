import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Badge, Button, Card, Descriptions, Divider, Image, List, Modal, Tabs, Tag, Typography } from 'antd';
import { Link, useParams } from 'react-router-dom';
//import { EditInfo } from './components/EditInfo';
import { SocketContext } from '../../../../context/SocketContext';
//import { RealizarRetiroAlmacen } from './components/RealizarRetiroAlmacen';
import { fetchConToken } from '../../../../helpers/fetch';
import { Loading } from '../../../obras/Loading';
import { CodigoBarrasProducto } from './components/CodigoBarrasProducto';
import { SalidasProducto }  from './components/SalidasProducto';
import { EntradasProducto } from './components/EntradasProducto';
const { TabPane } = Tabs;

export const ProductoScreen = () => {

    const {productoId} = useParams();
    const [informacionProducto, setInformacionProducto] = useState({});
	const [isModalVisibleEditInfo, setIsModalVisibleEditInfo] = useState(false);
    const [activeTabKey2, setActiveTabKey2 ] = useState('tab1');
    const {socket} = useContext(SocketContext);

    useEffect(()=>{

        socket.emit("obtener-producto-por-id",{productoId},(producto)=>{
            setInformacionProducto(producto);
        });

        fetchConToken(`/uploads/productos/${productoId}`).then(resp => {
        });

    },[]);

    useEffect(() => {

        socket.on("producto-actualizado",(producto)=>{
            if(producto._id === informacionProducto._id){
                setInformacionProducto(producto);
            }
        });


    }, [socket,setInformacionProducto,informacionProducto,fetchConToken,,productoId]);

	const tabListEditInfo = [
		{
			key:'tab1',
			tab:'Editar informacion general del producto'
		},
		{
			key:'tab2',
			tab:'Editar imagen principal del producto'
		}
	];

    const contentEditList = 
    {
        tab1:"Editar información del producto",
		tab2:"Editar imagen del producto"
    };

    const onTab2Change = key => {
        setActiveTabKey2(key);
    }

    const registrosColors = (item = "") =>{
        if(item.startsWith("[ENTRADA]") || item.startsWith("[REGISTRO]")){
                return  <List.Item><Typography.Text type="success">{item}</Typography.Text></List.Item>
        }else if(item.startsWith("[ACTUALIZADO]")){
            return  <List.Item><Typography.Text type="warning">{item}</Typography.Text></List.Item>
        }else if(item.startsWith("[ACTUALIZADO-IMAGEN]")){
            return  <List.Item><Typography.Text type="warning">{item}</Typography.Text></List.Item>
        }else if(item.startsWith("[ELIMINADO]")){
                return  <List.Item><Typography.Text type="danger">{item}</Typography.Text></List.Item>
        }else if(item.startsWith("[SALIDA-POR-OBRA]")){
                return  <List.Item><Typography.Text mark>{item}</Typography.Text></List.Item>
        }else if(item.startsWith("[SALIDA-DIRECTA]")){
                return  <List.Item><Typography.Text mark>{item}</Typography.Text></List.Item>
        }else{
            return  <List.Item><Typography.Text type="secondary">{item}</Typography.Text></List.Item>
        }
    }

    const categoriaColor = (categoria) => {
        switch (categoria.toLowerCase()) {
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


    if( Object.keys(informacionProducto).length === 0){
        <Loading/>
    }else{
        return (
            <div className="container p-5">
                <div className="d-flex justify-content-end gap-2 flex-wrap">
                    <Link to="/almacen/productos"><Button type="primary">Regresar a lista de productos</Button></Link>
                </div>
                <div className="row mt-5">
                    <div className="col-lg-6 col-sm-12">
                        {/*Información del producto*/}
						<h1 className="display-6 fw-bold">{informacionProducto.nombre}</h1>
                        <div className="d-flex justify-content-start gap-2 flex-wrap mt-3 mb-3">
                            {informacionProducto?.categorias?.map(categoria => categoriaColor(categoria.nombre))}
                        </div>                            
                        <p className="fw-bold">Informacion detallada del producto</p>
                        <Descriptions layout="vertical" bordered className="mt-3">
                            <Descriptions.Item label="Nombre del producto">{informacionProducto.nombre}</Descriptions.Item>
                            <Descriptions.Item label="Cantidad">{informacionProducto.cantidad}</Descriptions.Item>
                            <Descriptions.Item label="Estado">{informacionProducto.estadoProducto}</Descriptions.Item>
                            <Descriptions.Item label="Marca del producto">{informacionProducto.marcaProducto}</Descriptions.Item>
                            <Descriptions.Item label="Costo del producto">{informacionProducto.costo}</Descriptions.Item>
                            <Descriptions.Item label="Unidad">{informacionProducto.unidad}</Descriptions.Item>
                            <Descriptions.Item label="Producto registrado por">{informacionProducto?.usuarioCreador?.nombre}</Descriptions.Item>
                            <Descriptions.Item label="Estatus" span={3}>
                                <Badge status={informacionProducto.estatus ? "processing" : "error"} text={informacionProducto.estatus ? "Disponible en almacen" : "NO disponible en almacen"}/>
                            </Descriptions.Item>
                            <Descriptions.Item label="Fecha de ingreso al sistema">{informacionProducto.fechaRegistro}</Descriptions.Item>
                            <Descriptions.Item label="Ultima revisión en bodega" span={2}>
                                {informacionProducto.fechaRegistro}
                            </Descriptions.Item>
                            <Descriptions.Item label="Descripción del producto">
                                {informacionProducto.descripcion}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                    <div className="col-lg-6 col-sm-12 mt-3 mt-lg-0">
                        <Avatar shape="square" src={`http://localhost:4000/api/uploads/productos/${informacionProducto._id}`} style={{width:"250px",height:"250px"}}/>
                        <p className="text-muted">(Imagen principal del producto)</p>
                        <div className="d-flex justify-content-start gap-2 flex-wrap mt-3">
                            <Button type="primary" danger>Desabilitar producto</Button>
                            <Button type="primary" onClick={()=>{setIsModalVisibleEditInfo(true)}}>Editar información</Button>
                        </div>
                        <Tabs defaultActiveKey='1' key="1" size="large" className="mt-3">
                            <TabPane tab="Entradas del producto">
                                <EntradasProducto registros={informacionProducto.registrosEntradas}/>
                            </TabPane>
                            <TabPane tab="Salidas del producto" key="2">
                                <SalidasProducto registros={informacionProducto.registrosSalidas}/>
                            </TabPane>
                            <TabPane tab="Codigo de barras del producto" key="3">
                                <CodigoBarrasProducto  informacionProducto={informacionProducto}/>
                            </TabPane>
                        </Tabs>
                    </div>
                    {/*Modal para editar información del producto*/}
                    <Modal visible={isModalVisibleEditInfo} footer={null} onOk={()=>{setIsModalVisibleEditInfo(false)}} onCancel={()=>{setIsModalVisibleEditInfo(false)}}>
                		<h2 className="fw-bold">Editar información</h2>
                        <Card bordered={false} tabList={tabListEditInfo} activeTabKey={activeTabKey2} onTabChange={key => {onTab2Change(key)}}>
                            {/*Acuerdate que podemos acceder a las propiedades de un objecto con . o [] pero la ultima forma se computa*/}
							{contentEditList[activeTabKey2]}
                        </Card>
                    </Modal>
                </div>
            </div>
        )
    }
};