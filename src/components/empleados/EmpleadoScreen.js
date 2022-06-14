//Third party 
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Avatar, Button, Card, Divider, Form, message, Modal, Rate, Select, Tabs, Tag } from 'antd';
import { useSelector } from 'react-redux';
//Mis importanciones
import { SocketContext } from '../../context/SocketContext';
import { ObrasTrabajadas } from './components/ObrasTrabajadas';
import { InformacionUsuario } from './components/InformacionUsuario';
import { EditarInformacionGeneral } from './components/EditarInformacionGeneral';
import { EditarImagenPrincipal } from './components/EditarImagenPrincipal';
import "./components/style.css";
const { TabPane } = Tabs;
const { Option } = Select;

export const EmpleadoScreen = () => {

	const { rol } = useSelector(store => store.auth);
	const { empleadoId:usuarioId } = useParams();
    const { socket } = useContext(SocketContext);
    const [form] = Form.useForm();
	const [usuarioInfo, setUsuarioInfo] = useState();
	//Obras en desarollo por si quieren agregar un usuario a una obra desde usuarios
	const [obrasDesarollo, setObrasDesarollo] = useState([]);
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
		socket.emit("obtener-obras-en-desarollo",{},(obras)=>{
			console.log(obras);
			setObrasDesarollo(obras);
		});
	}, []);

	useEffect(() => {
		socket.on("usuario-informacion-actualizada",(usuario)=>{
			console.log(usuario.uid);
			console.log(usuarioId);
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
        	key: 'tab2',
        	tab: 'Información del usuario',
        },

    ];

    const contentList = 
    	{
			tab1:<ObrasTrabajadas usuarioInfo={usuarioInfo} socket={socket}/>,
			tab2:<InformacionUsuario usuarioInfo={usuarioInfo} socket={socket}/>
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
							{rol === ("ADMIN_ROLE" || "ADMINISTRADOR_ROLE") && <Button type="primary" onClick={()=>{setIsModalVisibleEditInfo(true)}}>Editar información</Button>}
						</div>
						<p className="fw-bold text-primary mt-3 mt-lg-0">{usuarioInfo.rol}</p>
						<div className="row">
							<span className="col-12">Calificación media del trabajador en obras.</span>
							<Rate className="ms-2 col-12 mt-2" disabled defaultValue={5}>5</Rate>
						</div>
						<div className="d-flex justify-content-start gap-4 mt-4">
							{rol === ("ADMIN_ROLE" || "ADMINISTRADOR_ROLE") && <Button type="primary" onClick={()=>{setIsModalVisible(true)}}>Añadir a una obra</Button>}
							{rol === ("ADMIN_ROLE" || "ADMINISTRADOR_ROLE") && (usuarioInfo.estado) ? <Button type="primary" danger onClick={handledChangeUserState}>Desabilitar usuario</Button> : <Button type="primary" style={{backgroundColor:"green",border:"green"}} onClick={handledChangeUserState}>Activar usuario</Button>}
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
      					<Modal title="Agregar un empleado a una obra" visible={isModalVisible} onOk={()=>{setIsModalVisible(false)}} onCancel={()=>{setIsModalVisible(false)}} footer={null}>
						    <h1>Agregar un empleado a una obra en desarollo</h1>
							<p className="lead">Agregar un empleado a una obra en desarollo</p>
							<Form form={form} onFinish={handledAddEmployerObra} layout="vertical">
								<Form.Item
                            		label="Rol que empañara el empleado en la obra"
                            		name="rolEmpleado"
                            		tooltip="Especifica el rol que tendra el empleado en la obra..."
                            		rules={[
                                		{
                                    		required:true,
                                    		message:"Debes ingresar el rol del empleado en la obra!"
                                		}
                            		]}
								>
								    <Select
                                	 	placeholder="Rol del empleado..."
                                		allowClear
                            		>
                                		<Option value="encargado-rol" key={1}>Encarga de obra</Option>
                                		<Option value="maestro-obra-rol" key={2}>Maestro de obra</Option>
										<Option value="albañil-rol" key={3}>Albañil</Option>
                                		<Option value="jefe-piso-rol" key={4}>Jefe de piso</Option>
                            		</Select>
                        		</Form.Item>
								<Form.Item 
									label="Obra la cual el empleado sera añadido" 
									name="obraId" 
									tooltip="Especifica la obra"
									rules={[
										{
											required:true,
											message:"Debes ingresar la obra!"
										}
									]}
								>
									<Select placeholder ="Obra a agregar..."
										allowClear
									>
										{obrasDesarollo.map(element => {
											return <Option value={element._id} key={element._id}>{element.titulo}</Option>
										})}
									</Select>
								</Form.Item>
                        		<div className="d-flex justify-content-start gap-2">
                            		<Button type="primary" htmlType="submit">Registrar empleado en la obra!</Button>
									<Button className="mx-2" htmlType='button' onClick={()=>{form.resetFields()}}>Borrar información</Button>
                        		</div>
                   			</Form>
      					</Modal>
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
