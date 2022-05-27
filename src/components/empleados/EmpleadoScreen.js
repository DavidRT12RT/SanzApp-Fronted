import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { message, Tabs } from 'antd';
import { UserOutlined, CopyOutlined,SaveOutlined, FileImageOutlined } from '@ant-design/icons';
import { SocketContext } from '../../context/SocketContext';
import { InformacionUsuario } from './components/InformacionUsuario';
import { EditarImagenUsuario } from './components/EditarImagenUsuario';
import "./components/style.css";
import { ObrasTrabajadas } from './components/ObrasTrabajadas';
const { TabPane } = Tabs;

export const EmpleadoScreen = () => {
	const { empleadoId:usuarioId } = useParams();
    const { socket } = useContext(SocketContext);
	const [usuarioInfo, setUsuarioInfo] = useState();

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
	
	
	if(usuarioInfo == undefined){
		return <h5>Cargando información</h5>
	}else{
	return (
		<div className="container d-flex align-items-center p-5 rounded shadow">
			<Tabs tabPosition={"top"} size='large' type='card' className="Tabs">
        		<TabPane tab={
					<span>
						<UserOutlined />
						Información del usuario
					</span>
				} key="1">
						<InformacionUsuario usuarioInfo={usuarioInfo} socket={socket}/>
        		</TabPane>

        		<TabPane className="tab" tab={
					<span>
						<SaveOutlined/>
						Obras trabajadas
					</span>
				} key="3">
					     <ObrasTrabajadas usuarioInfo={usuarioInfo}/>
        		</TabPane>

        		<TabPane className="tab" tab={
					<span>
						<FileImageOutlined />
						Editar foto de perfil
					</span>
				} key="4">
					     <EditarImagenUsuario usuarioInfo={usuarioInfo} socket={socket}/>
        		</TabPane>
				
      		</Tabs>
		</div>
  	);
}

}
