import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar, Button, Card, Divider, message, Rate, Tabs, Tag } from 'antd';
import { UserOutlined, CopyOutlined,SaveOutlined, FileImageOutlined } from '@ant-design/icons';
import { SocketContext } from '../../context/SocketContext';
import { EditarInformacionUsuario } from './components/EditarInformacionUsuario';
import { EditarImagenUsuario } from './components/EditarImagenUsuario';
import "./components/style.css";
import { ObrasTrabajadas } from './components/ObrasTrabajadas';
import { InformacionUsuario } from './components/InformacionUsuario';
const { TabPane } = Tabs;

export const EmpleadoScreen = () => {
	const { empleadoId:usuarioId } = useParams();
    const { socket } = useContext(SocketContext);
	const [usuarioInfo, setUsuarioInfo] = useState();
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');

	useEffect(() => {
		socket.emit("obtener-usuario-por-id",{usuarioId},(usuario)=>{
			setUsuarioInfo(usuario);
		});
	}, []);

	useEffect(() => {
		socket.on("usuario-informacion-actualizada",(usuario)=>{
			if(usuario.uid === usuarioId){
				setUsuarioInfo(usuario);
			}
		});
	}, [socket,setUsuarioInfo]);
	
	const tabList = [

        {
        	key: 'tab1',
        	tab: 'Total de obras trabajadas',
        },
        {
        	key: 'tab2',
        	tab: 'Información del usuario',
        },

    ];

    const onTab1Change = key => {
        setActiveTabKey1(key);
    };

    const contentList = 
    {
		tab1:<ObrasTrabajadas usuarioInfo={usuarioInfo} socket={socket}/>,
		tab2:<InformacionUsuario usuarioInfo={usuarioInfo} socket={socket}/>
    };

	const renderizarTrabajos = () => {
		return usuarioInfo.obrasTrabajadas.registros.map(element => {
			return (
				<div className="mt-4" style={{maxWidth:"400px"}}>
					<div className="d-flex justify-content-between">
						<h5>{element.nombreObra}</h5>
						<Tag color="blue" style={{padding:"6px"}}>{element.rol.toUpperCase()}</Tag>
					</div>
					<p className="text-muted">{element.direccionRegionalObra}</p>
					<p className="text-muted">{element.fechaAgregado}</p>
				</div>
			)
		});
	}
	
	const renderizarHabilidades = () =>{
		return usuarioInfo.habilidades.map(elemento=>{
			return <p className="fw-bold">{elemento}</p>
		})
	}
	
	if(usuarioInfo == undefined){
		return <h5>Cargando información</h5>
	}else{
		return (
			<div className="container p-lg-5">
				<div className="row p-lg-5 container" style={{margin:"auto"}}>
					<div className="col-lg-6 col-sm-12 mt-3 mt-lg-0" style={{margin:0,padding:0}}>
						<Avatar shape="square" src={`http://localhost:4000/api/uploads/usuarios/${usuarioInfo.uid}`} style={{width:"250px",height:"250px"}}/>
    					<Divider orientation="left" orientationMargin="0">Ultimas obras trabajadas</Divider>
						{usuarioInfo.obrasTrabajadas.registros.length > 0 ? renderizarTrabajos() : <p>Ninguna obra trabajada por el momento</p>}
    					<Divider orientation="left" orientationMargin="0">Habilidades</Divider>
						<div className="d-flex flex-wrap gap-4 mt-4">
							{usuarioInfo.habilidades.length > 0 ? renderizarHabilidades() : <p>Ninguna habilidades registrar por el momento</p>}
						</div>
					</div>
					<div className="col-lg-6 col-sm-12" style={{margin:0,padding:0}} >
						<div className="d-flex justify-content-between align-items-center flex-wrap">
							<div className="d-flex justify-content-start align-items-center">
								<h1 className="display-6 fw-bold me-2">{usuarioInfo.nombre}</h1>
								{usuarioInfo.alias && <span>({usuarioInfo.alias})</span>}
							</div>
							<Button type="primary">Editar información</Button>
						</div>
						<p className="fw-bold text-primary mt-3 mt-lg-0">{usuarioInfo.rol}</p>
						<div className="row">
							<span className="col-12">Calificación media del trabajador en obras.</span>
							<Rate className="ms-2 col-12 mt-2" disabled defaultValue={5}>5</Rate>
						</div>
						<div className="d-flex justify-content-start gap-4 mt-4">
							<Button type="primary">Añadir a una obra</Button>
							<Button type="primary" danger>Desabilitar usuario</Button>
						</div>
						<Card
						    bordered={false}
							style={{margin:0,padding:0}}
            				className="mt-4"
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
}
