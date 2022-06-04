import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { message, Modal, Form, Input, Button, Card, Avatar } from 'antd';
import { useSelector } from 'react-redux';
import { fetchConToken } from "../../helpers/fetch";
import { EditOutlined, EllipsisOutlined, ExclamationCircleOutlined, EyeOutlined,SettingOutlined  } from '@ant-design/icons';

import Password from 'antd/lib/input/Password';
const { Meta } = Card;
const { confirm } = Modal;


export const ObraCard = ({obraInfo}) => {
	const {rol} = useSelector(store => store.auth);
	const [estadoObra, setEstadoObra] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const { _id:obraId } = obraInfo;
	useEffect(() => {
		setEstadoObra(obraInfo.estadoReporte);
	}, [obraInfo]);

	const renderizarBoton = () => {
		const rolesPermitidos = ["ADMIN_ROLE","INGE_ROLE"];
		if(obraInfo.estado && rolesPermitidos.includes(rol)){
			return <Link to={`/aplicacion/obra/editor/${obraInfo._id}`} className="btn btn-primary ms-2">Editar obra</Link>
		}
	}

	const activarObraBoton = () =>{
		if(rol === "ADMIN_ROLE" && obraInfo.estado === false){
			return <button className="btn btn-primary ms-2" onClick={ async()=>{
				confirm({
            		title:"¿Seguro quieres volver a activar la obra?",
            		icon:<ExclamationCircleOutlined />,
            		content:"Al activarla denuevo los usuarios podran añadir información de nuevo a la obra y se marcara como en desarollo",
					okText:"Activar",
					cancelText:"Volver atras",
            		async onOk(){
						//Sacar formulario con usuario y contraseña
						setIsModalVisible(true);
           			},
        		});
			}}>Activar obra</button>
		}
	}

	const handledActivateObra = async (values) =>{
		setIsLoading(true);
		//Make http request to the server
		try {
			const resp = await fetchConToken(`/obras/activar/${obraId}`,{correo:values.correo,password:values.password},"PUT");
			const body = await resp.json();
			if(resp.status === 200){
				//Make http request in order to known if the user is ok
				message.success(body.msg);
				navigate(`/aplicacion/obra/editor/${obraId}`);
			}else{
				message.error(body.msg);
			}
		} catch (error) {
			message.error("Hubo un error a la hora de hacer la petición al servidor!");	
		}

		setIsLoading(false);

	}

    return (
		<>

            <Modal title="Comprobar identidad" visible={isModalVisible} onOk={()=>setIsModalVisible(false)} onCancel={()=>setIsModalVisible(false)} footer={null}>
				<Form onFinish={handledActivateObra} layout="vertical">
					<Form.Item label="Correo" name="correo">
						<Input/>
					</Form.Item>
					<Form.Item label="Contraseña" name="password">
						<Password/>
					</Form.Item>
					<Button type="primary" htmlType="submit" loading={isLoading}>Comprobar</Button>
				</Form>
			</Modal>
          </>
    ) 
}
