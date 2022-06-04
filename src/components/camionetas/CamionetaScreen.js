import { Avatar, Button, Card, Divider } from 'antd';
import React, { useContext, useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../../context/SocketContext';

export const CamionetaScreen = () => {

    //Sockets events
    const { socket } = useContext(SocketContext);
    const { camionetaId } = useParams();
    const [camionetaInfo, setCamionetaInfo] = useState();
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');

    //Solicitando camioneta por id por sockets
    useEffect(() => {
        socket.emit("obtener-camioneta-por-id", { camionetaId }, (camioneta) => {
            setCamionetaInfo(camioneta);
        });
    }, []);

    //Escuchar si la información de la camioneta se actualiza
    useEffect(() => {
        socket.on("camioneta-actualizada", (camioneta) => {
            if (camioneta.uid === camionetaId) {
                setCamionetaInfo(camioneta);
            }
        });
    },[socket,setCamionetaInfo,camionetaId]);

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

    const onTab1Change = key => {
        setActiveTabKey1(key);
    };

    const contentList = 
    {
		tab1:"Facturas de gasolina",
		tab2:"Facturas de mantenimiento"
    };


    return (
            <div className="container p-lg-5" style={{height:"100vh"}}>
            <div className="d-flex justify-content-end">
                <Button type="primary m-4 m-lg-0">Editar información</Button>
            </div>
				<div className="row container" style={{margin:"auto"}}>
                    <div className="col-sm-12 col-lg-6 container mt-3 mt-lg-0"  style={{margin:0,padding:0}}>
                        <h1 className="display-6 fw-bold d-block">Chevrolet Leviatan</h1>
                        <span className="text-muted d-block">ID de la camioneta s23sad23w32</span>
                        <Divider/>
                        <div className="mt-3">
                            <h6 className="text-muted">Información general de la camioneta</h6>
                            <div className="row mt-3">
                                <h6 className="fw-bold col-6">Placa de la camioneta:</h6>
                                <p className="text-primary col-6">32232323</p>
                                <h6 className="fw-bold col-6">Modelo de la camioneta:</h6>
                                <p className="text-bold col-6">Leviatan HRN</p>
                                <h6 className="fw-bold col-6">Marca de la camioneta:</h6>
                                <p className="text-bold col-6">Chevrolet</p>
                                <h6 className="fw-bold col-6">Fecha de compra: </h6>
                                <p className="text-bold col-6">29 de diciembre de 2021</p>
                                <h6 className="fw-bold col-6">Fecha de registro en el sistema:</h6>
                                <p className="text-bold col-6">10 de enero de 2022</p>
                            </div>
                        </div>
                    </div>
 
                    <div className="col-sm-12 col-lg-6 mt-3 mt-lg-0 d-flex justify-content-center align-items-center flex-wrap gap-2" style={{margin:0,padding:0}}>
					    <Avatar shape="square" src={`https://www.chevrolet.com.mx/content/dam/chevrolet/na/mx/es/index/pickups-and-trucks/01-images/2022-pickups-colorado.jpg?imwidth=960`} style={{maxWidth:"350px",minWidth:"250px",maxHeight:"350px",minHeight:"250px",objectFit:"scale-down"}} className="d-block"/>
                        <span className="text-muted text-center">(Foto de la camioneta)</span>
                    </div>

                    <div className="col-12">
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
        </div>
    )
}
