import { Button, DatePicker, Divider, Form, Input, message, Modal, Select, Table,Typography, Upload } from 'antd';
import { ExclamationCircleOutlined, UploadOutlined} from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import locale from "antd/es/date-picker/locale/es_ES"
import { SanzSpinner } from '../../../helpers/spinner/SanzSpinner';
import "../assets/style.css";
import { useSelector } from 'react-redux';
import { fetchConToken, fetchConTokenSinJSON } from '../../../helpers/fetch';
const { RangePicker } = DatePicker
const { confirm } = Modal;
const { Paragraph, Text } = Typography;


export const RegistrarEmpresa = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
	const [filesList, setFilesList] = useState([]);
    const uid = useSelector(store => store.auth.uid);

    const props = {
        onRemove : file => {
            setFilesList([]);
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma función*/
        },
        beforeUpload: file => {
            //Verificar que el fileList sea menos a 2 
            if(filesList.length < 1){
                setFilesList(files => [...files,file]);
            }else{
                message.error("Solo puedes subir 1 archivo en total");
            }
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            return false;
        },
        listType:"picture",
        maxCount:1,
        fileList : filesList
    };


    const registrarEmpresa = (values) => {
        //Ponemos los productos en la informacion que enviaremos
		confirm({
            title:"Registrar empresa al sistema",
            icon:<ExclamationCircleOutlined />,
            content:"Una vez que se haya registrado solamente una persona con el rango de ADMINISTRADOR podra eliminarla",
			okText:"Registrar empresa",
			cancelText:"Volver atras",
            async onOk(){
                setIsLoading(true);
        		const formData = new FormData();
                formData.append("nombre",values.nombre);
                formData.append("descripcion",values.descripcion);
                formData.append("usuarioRegistrador",uid);
        		filesList.forEach(file => {
            		formData.append("archivo",file);
        		});
                //Emitir
                const resp = await fetchConTokenSinJSON("/empresas",formData,"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                message.success(body.msg);
                setIsLoading(false);
            }
        });
    }

    return (
        <>
            <div className="container p-5">
                <section className="text-center">
                    <h1 className="titulo" style={{fontSize:"32px"}}>Registrar empresa</h1>
                    <h1 className="descripcion">Registrar una nueva empresa al sistema donde podras llevar el control de todas las sucursales y obras que hay en ella.</h1>
                    <Divider/>
                </section>

                <section className="formulario-registro-input-content">
                    <Form layout="vertical" form={form} onFinish={registrarEmpresa}>
                        <Form.Item name="nombre" label={"Nombre de la empresa"} rules={[{required: true,message: 'Ingresa el nombre de la empresa',},]}>
                            <Input size="large"/>
                        </Form.Item>
                        <Form.Item name="descripcion" label={"Descripcion breve de la empresa"} rules={[{required: true,message: 'Ingresa una descripcion breve acerca de la empresa',},]}>
                            <Input.TextArea rows={5} size="large" />
                        </Form.Item>
                        <Form.Item name="imagen" label={"Imagen de la empresa"} rules={[{required:true,message:"La imagen de la empresa es requerida!"}]}>
    					    <Upload {...props}>
	                            <Button icon={<UploadOutlined/>} size="large">Selecciona la imagen de la empresa</Button>
                            </Upload>
                        </Form.Item>
                        <Button type="primary" className="mt-4" htmlType="submit">Registrar empresa!</Button>
                    </Form>
                </section>
            </div>

            <div className="container mt-5 p-5">
                <Paragraph>
                    <Text strong style={{fontSize: 16,}}>
                        Ten en cuenta las siguientes cosas antes de registrar una empresa:
                    </Text>
                </Paragraph>
                <Paragraph>
                    <ExclamationCircleOutlined style={{color:"#FFC300"}}/> Al momento de registrar la empresa podras empezar a anadir sucursales a esta y agregar obras a las sucursales.
                </Paragraph>
                <Paragraph>
                    <ExclamationCircleOutlined style={{color:"#FFC300"}}/> Una vez registrada la empresa solo podra ser eliminada por personas con rango "Administrador" 
                </Paragraph>
            </div>
        </>
    );
}
