import React,{ useState }from 'react'
import { Result, Button, Typography, Modal, message, Form, Input } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchConToken } from '../../../../helpers/fetch';
import Password from 'antd/lib/input/Password';
const { Paragraph, Text } = Typography;
const { confirm } = Modal;

export const FinalizarObra = ({obraInfo}) => {
    const {_id:obraId} = obraInfo;
    const { name,rol } = useSelector(store => store.auth);
    const [isModalVisible, setIsModalVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

	const handledEndObra = async (values) => {
		setIsLoading(true);
		//Make http request to the server
		try {
			const resp = await fetchConToken(`/obras/finalizar/${obraId}`,{correo:values.correo,password:values.password},"PUT");
			const body = await resp.json();
			if(resp.status === 200){
				//Make http request in order to known if the user is ok
				message.success(body.msg);
				navigate(`/aplicacion/obras`);
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
        <Result
            status="warning"
            title="Terminar una obra"
            subTitle="Porfavor lee los siguientes puntos necesarios antes de terminar una obra."
            extra={[
                <Button type="primary" key="console" onClick={()=>navigate("/aplicacion/obras/")}>
                    Ir atras
                </Button>,
                <Button key="buy" onClick={()=>{
                    if(rol != "ADMIN_ROLE") return message.error("Necesitas tener un rol Administrador!");
                    //if((obraInfo.gastos.totalGastosObra - obraInfo.abonos.cantidadTota) != 0) return message.error("Los abonos y gastos NO estan en 0!");
                    confirm({
            		    title:"¿Seguro quieres terminar la obra?",
            		    icon:<ExclamationCircleOutlined />,
            		    content:"Al desactivar la obra esta cambiara su estado a finalizada y nadie podra subir mas información a menos que un 'Administrador' la vuelva a activar",
					    okText:"Desactivar",
					    cancelText:"Volver atras",
            		    async onOk(){
						    //Sacar formulario con usuario y contraseña
						    setIsModalVisible(true);
           		        },
        		    });
			    }}>Terminar obra</Button>,
            ]}
        >
            <div>
                <Paragraph>
                    <Text
                        strong
                        style={{
                        fontSize: 16,
                        }}
                    >
                        Ten en cuenta las siguientes cosas antes de terminar la obra: 
                    </Text>
                </Paragraph>
                <Paragraph>
                    <ExclamationCircleOutlined style={{color:"#FFC300"}}/>  Tu cuenta necesita un rol con rango "Administrador"
                </Paragraph>
                <Paragraph>
                    <ExclamationCircleOutlined style={{color:"#FFC300"}}/>  Los gastos y facturas de la obra necesitan estar en 0
                </Paragraph>
                <Paragraph>
                    <ExclamationCircleOutlined style={{color:"#FFC300"}}/>  Una vez terminada la obra no podras añadir información extra a esta misma a menos que un usuario "Administrador la vuelva a activar"
                </Paragraph>
                <Paragraph>
                    <ExclamationCircleOutlined style={{color:"#FFC300"}}/> Solo un usuario "Administrador" podra volver a activar la obra
                </Paragraph>
            </div>
        </Result>
        <Modal title="Comprobar identidad" visible={isModalVisible} onOk={()=>setIsModalVisible(false)} onCancel={()=>setIsModalVisible(false)} footer={null}>
				<Form onFinish={handledEndObra} layout="vertical">
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
