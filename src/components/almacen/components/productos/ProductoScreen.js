import React, { useContext, useEffect, useState } from 'react';
import { Button, Divider, Tabs, Tag,} from 'antd';
import { Link, useParams } from 'react-router-dom';
//import { EditInfo } from './components/EditInfo';
import { SocketContext } from '../../../../context/SocketContext';
//import { RealizarRetiroAlmacen } from './components/RealizarRetiroAlmacen';
import { fetchConToken } from '../../../../helpers/fetch';
import { Loading } from '../../../obras/Loading';
import { SalidasProducto }  from './components/SalidasProducto';
import { EntradasProducto } from './components/EntradasProducto';
import "./components/assets/style.css";

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

    const categoriaColor = (categoria) => {
        switch (categoria.toLowerCase()) {
            case "ferreteria":
                return <Tag color="cyan" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag> 
            case "vinilos":
                return <Tag color="green" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag> 
            case "herramientas":
                return <Tag color="blue" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag>
            case "fontaneria":
                return <Tag color="red" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag>
            case "iluminacion":
                return <Tag color="yellow" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag>
            case "materialElectrico":
                return <Tag color="gold" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag>
            case "selladores":
                return <Tag color="gold" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag>
            default:
                return <Tag color="green" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag> 
        }
    }


    if( Object.keys(informacionProducto).length === 0){
        <Loading/>
    }else{
        return (
            <div className="container p-3 p-lg-5">
                <div className="d-flex justify-content-end gap-2 flex-wrap">
                    <Link to="/almacen/productos"><Button type="primary">Regresar a lista de productos</Button></Link>
                </div>
                 <div className="row mt-lg-5">
                    {/* Imagen del producto*/}
                    <div className="col-lg-6 col-12 d-flex justify-content-center align-items-start">
                        <img src={`http://localhost:4000/api/uploads/productos/${informacionProducto._id}`} className="imagen-producto"/>
                    </div>

                    {/* Informacion basica del producto*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <h1 className="nombre-producto">{informacionProducto.nombre}</h1>
                        {informacionProducto.estatus ? <h1 className="text-success estatus-producto">Disponible</h1> : <h1 className="text-danger descripcion">No disponible</h1>}
                        <div className="d-flex justify-content-start gap-2 flex-wrap mt-3 mb-3">
                            {informacionProducto?.categorias?.map(categoria => categoriaColor(categoria.nombre))}
                        </div>  
                        <h1 className="titulo-descripcion">Precio promedio X unidad:</h1>
                        <h1 className="precio-por-unidad-producto">$332.22</h1>
                        <div className="row mt-5">
                            <h1 className="titulo-descripcion col-6">Cantidad en bodega:</h1>
                            <h1 className="descripcion col-6">{informacionProducto.cantidad}</h1>
                            <h1 className="titulo-descripcion col-6">Marca:</h1>
                            <h1 className="descripcion col-6">{informacionProducto.marcaProducto}</h1>
                            <h1 className="titulo-descripcion col-6">Unidad: </h1>
                            <h1 className="descripcion col-6">{informacionProducto.unidad}</h1>
                            <h1 className="titulo-descripcion col-6">Estado del producto: </h1>
                            <h1 className="descripcion col-6">{informacionProducto.estadoProducto}</h1>
                            <h1 className="titulo-descripcion col-6 ">Fecha de registro: </h1>
                            <h1 className="descripcion col-6 text-danger">{informacionProducto.fechaRegistro}</h1>
                            <p className="mt-5 nota col-12 text-center">Para mas detalles del producto comunicate a almacen...</p>
                        </div>
                    </div>
                    
                    {/*Registros de el producto*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <Divider/>
                        <h1 className="nombre-producto">Registros de el producto</h1>
                        <Tabs defaultActiveKey='1' key="1" size="large">
                            <TabPane tab="Entradas del producto">
                                <EntradasProducto registros={informacionProducto.registrosEntradas}/>
                            </TabPane>
                            <TabPane tab="Salidas del producto" key="2">
                                <SalidasProducto registros={informacionProducto.registrosSalidas}/>
                            </TabPane>
                        </Tabs>
                    </div>

                    {/* Descripcion del producto y sus aplicaciones*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <Divider/>
                        <h1 className="nombre-producto">Descripcion del producto</h1>
                        <h1 className="descripcion-producto">{informacionProducto.descripcion}</h1>
                        <Divider/>
                        <h1 className="nombre-producto">Aplicaciones del producto</h1>
                        <h1 className="descripcion-producto">*Permite poner las paredes en un buen estado antees de la pintada</h1>
                        <h1 className="descripcion-producto">*Permite poner las paredes en un buen estado antees de la pintada</h1>
                        <h1 className="descripcion-producto">*Permite poner las paredes en un buen estado antees de la pintada</h1>
                    </div>
                 </div>
            </div>
        )
    }
};