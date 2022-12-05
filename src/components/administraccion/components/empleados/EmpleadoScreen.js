//Third party 
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, Button, Card, Divider, Form, message, Modal, Rate, Select, Tabs, Tag } from 'antd';
import { useSelector } from 'react-redux';
//Mis importanciones
import { ObrasTrabajadas } from './components/ObrasTrabajadas';
import { InformacionUsuario } from './components/InformacionUsuario';
import { EditarInformacionGeneral } from './components/EditarInformacionGeneral';
import { EditarImagenPrincipal } from './components/EditarImagenPrincipal';
import "./components/style.css";
import { ResguardosUsuario } from './components/ResguardosUsuario';
import { SocketContext } from '../../../../context/SocketContext';
import { fetchConToken } from '../../../../helpers/fetch';
const { TabPane } = Tabs;
const { Option } = Select;

export const EmpleadoScreen = () => {

	const { rol } = useSelector(store => store.auth);
	const { empleadoId:usuarioId } = useParams();
    const { socket } = useContext(SocketContext);
    const [form] = Form.useForm();
	const [usuarioInfo, setUsuarioInfo] = useState(undefined);
  	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isModalVisibleEditInfo, setIsModalVisibleEditInfo] = useState(false);
	//Info general y obras trabajadas
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
	//Lista de editar información como foto y info general del usuario
    const [activeTabKey2, setActiveTabKey2 ] = useState('tab1');

	useEffect(() => {
		socket.emit("obtener-usuario-por-id",{usuarioId},(usuario)=>{
			setUsuarioInfo(usuario);
		});
		fetchConToken();
	}, []);

	useEffect(() => {
		socket.on("usuario-informacion-actualizada",(usuario)=>{
			if(usuario.uid === usuarioId){
				setUsuarioInfo(usuario);
			}
		});
	}, [socket,setUsuarioInfo]);
	
    const onTab1Change = key => {
        setActiveTabKey1(key);
    };

    const onTab2Change = key => {
        setActiveTabKey2(key);
    }
	const tabList = [

        {
        	key: 'tab1',
        	tab: 'Total de obras trabajadas',
        },
		{
			key:'tab2',
			tab:'Resguardos del usuario'
		},
        {
        	key: 'tab3',
        	tab: 'Información del usuario',
        },
    ];

    const contentList = 
    	{
			tab1:<ObrasTrabajadas usuarioInfo={usuarioInfo} socket={socket}/>,
			tab2:<ResguardosUsuario usuarioInfo={usuarioInfo} socket={socket}/>,
			tab3:<InformacionUsuario usuarioInfo={usuarioInfo} socket={socket}/>
    	};

	const tabListEditInfo = [
		{
			key:'tab1',
			tab:'Editar informacion general del usuario'
		},
		{
			key:'tab2',
			tab:'Editar imagen principal del usuario'
		}
	];
    const contentEditList = 
        {
            tab1:<EditarInformacionGeneral socket={socket} usuarioInfo={usuarioInfo} setIsModalVisibleEditInfo={setIsModalVisibleEditInfo}/>,
			tab2:<EditarImagenPrincipal socket={socket} usuarioInfo={usuarioInfo} setIsModalVisibleEditInfo={setIsModalVisibleEditInfo}/>
        };

	const renderizarTrabajos = () => {
		return usuarioInfo.obrasTrabajadas.registros.map(element => {
			return (
				<div className="mt-4 p-3 card" style={{maxWidth:"300px"}}>
					<div className="d-flex justify-content-center flex-wrap gap-2 text-center">
						<h5>{element.nombreObra}</h5>
						<Tag color="blue" key={element._id} style={{height:"30px"}}>{element.rol.toUpperCase()}</Tag>
					</div>
					<div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
						<p className="text-muted">{element.direccionRegionalObra}</p>
						<p className="text-muted">{element.fechaAgregado}</p>
					</div>
				</div>
			)
		});
	}
	
	const renderizarHabilidades = () =>{
		return usuarioInfo.habilidades.map(elemento=>{
			return <p className="fw-bold">{elemento}</p>
		})
	}
	
	const handledChangeUserState = () =>{

		if(usuarioInfo.rol === "ADMIN_ROLE") return message.error("No puedes desabilitar a un usuario ADMIN");
		socket.emit("cambiar-estado-usuario",usuarioInfo.uid,(confirmacion)=>{
			(confirmacion.ok) ? message.success(confirmacion.msg) : message.error(confirmacion.msg);
		});
	}

	const handledAddEmployerObra = (values) =>{
		values.empleadoID = usuarioId;
        socket.emit("agregar-empleado-obra",values,(confirmacion)=>{
            if(confirmacion.ok){
                message.success(confirmacion.msg);
        		form.resetFields();
				return setIsModalVisible(false);
            }else{
                message.error(confirmacion.msg);
            }
        });
	}
    //<Divider orientation="left" orientationMargin="0">Ultimas obras trabajadas</Divider>
	if(usuarioInfo == undefined){
		return <h5>Cargando información</h5>
	}else{
		return (
			<div className="container p-lg-5">
				<div className="row p-lg-5 container" style={{margin:"auto"}}>
					<div className="col-lg-4 col-sm-12 mt-3 mt-lg-0" style={{margin:0,padding:0}}>
						<Avatar shape="square" src={`http://localhost:4000/api/uploads/usuarios/${usuarioInfo.uid}`} style={{width:"250px",height:"250px"}}/>
						<h5 className="fw-bold mt-3">Ultimas obras trabajadas</h5>
						<h5 className="fw-bold mt-3">Habilidades</h5>
						<div className="d-flex flex-wrap gap-4 mt-4">
							{usuarioInfo.habilidades.length > 0 ? renderizarHabilidades() : <p>Ninguna habilidades registrar por el momento</p>}
						</div>
					</div>
					<div className="col-lg-8 col-sm-12" style={{margin:0,padding:0}} >
						<div className="d-flex justify-content-between align-items-center flex-wrap">
							<div className="d-flex justify-content-start align-items-center">
								<h1 className="display-6 fw-bold me-2">{usuarioInfo.nombre}</h1>
								{usuarioInfo.alias && <span>({usuarioInfo.alias})</span>}
							</div>
							{rol === ("ADMIN_ROLE" || "ADMINISTRADOR_ROLE") && <Button type="primary" onClick={()=>{setIsModalVisibleEditInfo(true)}}>Editar información</Button>}
						</div>
						<p className="fw-bold text-primary mt-3 mt-lg-0">{usuarioInfo.rol}</p>
						<div className="row">
							<span className="col-12">Calificación media del trabajador en obras.</span>
							<Rate className="ms-2 col-12 mt-2" disabled defaultValue={5}>5</Rate>
						</div>
						<div className="d-flex justify-content-start gap-4 mt-4">
							{rol === ("ADMIN_ROLE" || "ADMINISTRADOR_ROLE") && (usuarioInfo.estado) ? <Button type="primary" danger onClick={handledChangeUserState}>Desabilitar usuario</Button> : <Button type="primary" style={{backgroundColor:"green",border:"green"}} onClick={handledChangeUserState}>Activar usuario</Button>}
						</div>
						<Card
						 	title="Informacion extra del usuario"
							style={{margin:0,padding:0,width:"100%"}}
            				className="mt-4"
            				tabList={tabList}
            				activeTabKey={activeTabKey1}
            				onTabChange={key => {
            					onTab1Change(key);
            				}}
        				>
            				{contentList[activeTabKey1]}
        				</Card>
                    	<Modal visible={isModalVisibleEditInfo} footer={null} onOk={()=>{setIsModalVisibleEditInfo(false)}} onCancel={()=>{setIsModalVisibleEditInfo(false)}}>
                			<h2 className="fw-bold">Editar información</h2>
                        	<Card bordered={false} tabList={tabListEditInfo} activeTabKey={activeTabKey2} onTabChange={key => {onTab2Change(key)}}>
                            	{/*Acuerdate que podemos acceder a las propiedades de un objecto con . o [] pero la ultima forma se computa*/}
								{contentEditList[activeTabKey2]}
                        	</Card>
                    	</Modal>
					</div>
				</div>
			</div>
  		)
	}
}
