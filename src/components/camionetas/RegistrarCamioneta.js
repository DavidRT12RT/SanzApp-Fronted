import { Button, DatePicker, Form, Input,message, Upload } from 'antd'
import React, { useState } from 'react'
import "./assets/style.css";
import { UploadOutlined } from "@ant-design/icons";
import { fetchConTokenSinJSON } from '../../helpers/fetch';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"

export const RegistrarCamioneta = () => {

    const [filesList, setFilesList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();



	const handledAddNewCamioneta = async (values) => {
        values.fechaCompra = values.fechaCompra.toDate();
        const formData = new FormData();
        formData.append("marca",values.marca);
        formData.append("modelo",values.modelo);
        formData.append("fechaCompra",values.fechaCompra);
        formData.append("placa",values.placa);
        filesList.forEach(file => {
            formData.append("archivo",file);
        });
        //Verificación que este el archivo de la imagen
        if(filesList.length < 1){
            return message.error("Se necesita el archivo PDF del abono!");
        }
        setUploading(true);
        try {
            const resp = await fetchConTokenSinJSON("/camionetas",formData,"POST")
            const body = await resp.json();
            //Quitando los archivos del filesList
            setFilesList([]);
            setUploading(false);
            if(resp.status === 200){
                message.success(body.msg);
                return navigate(`/aplicacion/camionetas/gestion/${body.camioneta.uid}`);
            }else{
                message.error(body.msg);
            }
        } catch (error) {
        }
	}

    const props = {
        multiple:true,
        onRemove : file => {
            setFilesList(files => {
                const index = files.indexOf(file);
                const newFileList = files.slice();
                newFileList.splice(index,1);
                setFilesList(newFileList);
            });
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma función*/
        },
        beforeUpload: file => {
            //Verificar que el fileList sea menos a 2 
            if(filesList.length < 2){
                setFilesList(files => [...files,file]);
            }else{
                message.error("Solo puedes subir 2 archivos en total");
            }
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            return false;
        },
        listType:"picture",
        maxCount:2,
        fileList : filesList
    };

	return (
		<div className="container shadow rounded mt-lg-5 especial">
				<div className="row">
   				{/*Imagen screen*/}
				<div className="col-6 bgRegistro">
				</div>
				{/*Formulario screen*/}
				<div className="col-sm-12 col-lg-12 p-5">
					<Form layout="vertical" onFinish={handledAddNewCamioneta}>
						<div className="d-flex justify-content-end">
                			<img src={require("../auth/assets/logo.png")} width="100" alt="logo"/>
            			</div>
                		<h2 className="fw-bold text-center py-5">Registrar nueva camioneta</h2>
						<Form.Item label="Marca de la camioneta" name="marca" style={{width:"100%"}}>
							<Input size="large"/>
						</Form.Item>
						<Form.Item label="Modelo de la camioneta" name="modelo" style={{width:"100%"}}>
							<Input size="large"/>
						</Form.Item>
                        <Form.Item label="Placa de la camioneta" name="placa" style={{width:"100%"}}>
                            <Input size="large"/>
                        </Form.Item>
						<Form.Item label="Fecha de compra de la camioneta" name="fechaCompra" style={{width:"100%"}}>
							<DatePicker style={{width:"100%"}} size="large" locale={locale}/>
						</Form.Item>
                        <Upload {...props} className="upload-list-inline" style={{width:"100%"}}>
							<div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
	                            <Button icon={<UploadOutlined/>} size="large">Selecciona la imagen de la camioneta</Button>
								<span className="text-muted">(Podras cambiar la imagen despues en los ajustes de la camioneta...)</span>
							</div>
                       	</Upload>
                        <Button 
                            type="primary" 
                            disabled={filesList.length === 0}
                            loading={uploading}
                            htmlType="submit"
							size="large"
							style={{width:"100%"}}
                        >
                            {uploading ? "Registrando..." : " Registrar nueva camioneta"}     
                        </Button>
					</Form>
				</div>
			</div>
		</div>		
  	)
}
