import { Avatar, Button, Card, DatePicker, Divider, Form, Input, message, Modal } from 'antd';
import React, { useContext, useState,useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { SocketContext } from '../../context/SocketContext';
import { fetchConToken } from '../../helpers/fetch';
import { EditarImagenPrincipal } from './EditarImagenPrincipal';
import { EditarInformacionGeneral } from './EditarInformacionGeneral';
import { FacturasGasolina } from './FacturasGasolina';
import { FacturasMantenimiento } from './FacturasMantenimiento';

export const CamionetaScreen = () => {

    //Sockets events
    const { socket } = useContext(SocketContext);
    const { camionetaId } = useParams();
    const [camionetaInfo, setCamionetaInfo] = useState();
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const [activeTabKey2, setActiveTabKey2 ] = useState('tab1');
    const [isEditing, setIsEditing] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const { rol } = useSelector(store => store.auth);

    //Solicitando camioneta por id por sockets

    useEffect(() => {
        const fetchData = async() => {
            const resp = await fetchConToken(`/camionetas/${camionetaId}`);
            const body = await resp.json();
            if(resp.status === 200){
                setCamionetaInfo(body); 
            }else{
                message.error(body.msg);
                return navigate(-1);
            }
        }
        fetchData();
    }, []);


    useEffect(() => {
        socket.on("camioneta-actualizada",(camioneta)=>{
            if(camioneta.uid === camionetaId){
                setCamionetaInfo(camioneta);
            }
        });
    }, [socket,setCamionetaInfo,camionetaId]);
    

	const tabList = [

        {
        	key: 'tab1',
        	tab: 'Facturas de gasolina',
        },
        {
        	key: 'tab2',
        	tab: 'Facturas de mantenimiento',
        },

    ];

    const EditList = [
        {
            key:"tab1",
            tab:"Editar información general de la camioneta"
        },
        {
            key:"tab2",
            tab:"Editar imagen principal de la camioneta"
        }
    ];

    const onTab1Change = key => {
        setActiveTabKey1(key);
    };

    const onTab2Change = key => {
        setActiveTabKey2(key);
    }

    const contentList = 
        {
		    tab1:<FacturasGasolina camionetaInfo={camionetaInfo} socket={socket}/>,
		    tab2:<FacturasMantenimiento camionetaInfo={camionetaInfo} socket={socket}/>
        };

    const contentEditList = 
        {
            tab1:<EditarInformacionGeneral socket={socket} camionetaInfo={camionetaInfo} setIsModalVisible={setIsModalVisible}/>,
            tab2:<EditarImagenPrincipal socket={socket} camionetaInfo={camionetaInfo} setIsModalVisible={setIsModalVisible}/>
        };

    if(camionetaInfo === undefined) {
        return <h1>Cargando...</h1>
    }else{
        return (
            <>
                <div className="container p-lg-5" style={{height:"100%"}}>
                    <div className="d-flex justify-content-end align-items-center">
                        {rol === ("ADMIN_ROLE" || "ADMINISTRADOR_ROLE") && <Button type="primary" className="mt-4 mt-lg-0" onClick={()=>{setIsModalVisible(true)}}>Editar información</Button>}
                    </div>
				    <div className="row container" style={{margin:"auto"}}>
                        <div className="col-sm-12 col-lg-6 container mt-3 mt-lg-0"  style={{margin:0,padding:0}}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h1 className="display-6 fw-bold d-block">{camionetaInfo.marca} {camionetaInfo.modelo}</h1>
                            </div>                           
                            <span className="text-muted d-block">ID de la camioneta {camionetaInfo.uid}</span>
                            <Divider/>
                            <h6 className="text-muted">Información general de la camioneta</h6>
                            <div className="row mt-3">
                                    <h6 className="fw-bold col-6">Placa de la camioneta:</h6>
                                    <p className="text-primary col-6">{camionetaInfo.placa}</p>
                                    <h6 className="fw-bold col-6">Modelo de la camioneta:</h6>
                                    <p className="text-bold col-6">{camionetaInfo.modelo}</p>
                                    <h6 className="fw-bold col-6">Marca de la camioneta:</h6>
                                    <p className="text-bold col-6">{camionetaInfo.marca}</p>
                                    <h6 className="fw-bold col-6">Fecha de compra: </h6>
                                    <p className="text-bold col-6">{camionetaInfo.fechaCompra}</p>
                                    <h6 className="fw-bold col-6">Fecha de registro en el sistema:</h6>
                                    <p className="text-bold col-6">{camionetaInfo.fechaRegistroSistema}</p>
                                </div>
                            </div>
                            <div className="col-lg-6 col-sm-12 d-flex justify-content-center align-items-center">
					            <Avatar shape="square" src={`http://localhost:4000/api/uploads/camionetas/camioneta/${camionetaInfo.uid}`} style={{maxWidth:"350px",minWidth:"250px",maxHeight:"350px",minHeight:"250px",objectFit:"scale-down"}} className="d-block"/>
                            </div>
                        </div> 
                        <div className="col-12 mt-3">
                            <Card
                                className="col-12 mt-3 mt-lg-0"
						        bordered={false}
            				    tabList={tabList}
            				    activeTabKey={activeTabKey1}
            				    onTabChange={key => {
            					    onTab1Change(key);
            				    }}
        				    >
            				    {contentList[activeTabKey1]}
        				    </Card>
                        </div>
                    </div>
                    <Modal visible={isModalVisible} footer={null} onCancel={()=>{setIsModalVisible(false)}} onOk={()=>{setIsModalVisible(false)}}>
                		<h2 className="fw-bold">Editar información</h2>
                        <Card bordered={false} tabList={EditList} activeTabKey={activeTabKey2} onTabChange={key => {onTab2Change(key)}}>
                            {/*Acuerdate que podemos acceder a las propiedades de un objecto con . o [] pero la ultima forma se computa*/}
                            {contentEditList[activeTabKey2]}
                        </Card>
                    </Modal>
            </>
        )
    }
}