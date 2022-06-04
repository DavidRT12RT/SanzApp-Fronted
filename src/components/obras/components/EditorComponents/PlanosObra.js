import { Upload, message, Modal, Button, Divider, Input, Card, Avatar, Form } from "antd";
import { InboxOutlined, CaretUpOutlined , EditOutlined, UploadOutlined, DownloadOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from 'react'
import "./../../assets/stylePlanosComponent.css";
import { fetchConToken, fetchConTokenSinJSON } from "../../../../helpers/fetch";
import { useSelector } from "react-redux";
const { Meta } = Card;

export const PlanosObra = ({obraInfo,socket}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dataPlanos, setDataPlanos] = useState([]);

    const {_id:obraId} = obraInfo;
    const { uid,name } = useSelector(store => store.auth);

    const showModal = () => {
        setIsModalVisible(true);
        setIsLoading(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        setIsLoading(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsLoading(false);
    };

    useEffect(() => {
        setDataPlanos(obraInfo.planos.registros);
    }, [obraInfo]);
    
    const handleSearch = (value) => {
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setDataPlanos(obraInfo.planos.registros);

        }

        const resultadosBusqueda = obraInfo.planos.registros.filter((elemento)=>{
            if(elemento.titulo.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setDataPlanos(resultadosBusqueda);
    }


    const handleUpload =  async (values) =>{
        const formData = new FormData();
        formData.append("titulo",values.titulo);
        formData.append("descripcion",values.descripcion);
        formData.append("uidUsuario",uid);
        formData.append("nombreUsuario",name);
        filesList.forEach(file => {
            formData.append("archivo",file);
        });

        //Verificación que este por lo menos 2 archivos!
        if(filesList.length < 1){
            return message.error("Se necesita el archivo PDF del abono!");
        }
        setUploading(true);
        try {
            const resp = await fetchConTokenSinJSON(`/uploads/obras/obra/${obraId}/planos`,formData,"POST")
            const body = await resp.json();
            if(resp.status === 200){
                message.success(body.msg);
            }else{
                message.error(body.msg);
            }
        } catch (error) {
            
        }
        handleCancel();
        //Quitando los archivos del filesList
        setFilesList([]);
        setUploading(false);
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

    const handleDownloadPlano = async (record) => {
        const { nombreArchivo }  = record;
        try {
            const resp = await fetchConToken(`/uploads/obras/obra/${obraId}/planos/${nombreArchivo}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',nombreArchivo);
            element.click();
        } catch (error) {
            message.error("Error a la hora de descargar el archivo");
        }
    }
    return (
        <>
            <h1>Planos de la obra</h1>
            <p className="lead">En esta sección se deben de subir los archivos de los planos de la obra.</p>

            <div className="d-flex justify-content-start gap-2">
                <Input.Search 
                    size="large" 
                    placeholder="Busca un archivo por su nombre..." 
                    enterButton
                    onSearch={handleSearch}
                    className="search-bar-class"
                />
                <Button
                    type="primary"
                    loading={isLoading}
                    onClick={showModal}
                    icon={<CaretUpOutlined />}
                    size="large"
                >
                        Subir un nuevo plano!
                </Button>
            </div>
            <Modal title="Agregar factura" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                    <h1>Subir un plano a la obra</h1>
                    <p className="lead">Sube aqui los archivos digitales de los planos de la obra y manten todo mas organizado!</p>
                    <Form layout="vertical" onFinish={handleUpload}>
                        <Form.Item label="Titulo del plano" name="titulo">
                            <Input/>
                        </Form.Item>
                        <Form.Item label="Descripción del plano" name="descripcion">
                            <Input.TextArea/>
                        </Form.Item>
                        <Upload {...props} className="upload-list-inline" >
                            <Button icon={<UploadOutlined/>}>Selecciona el archivo del abono</Button>
                        </Upload>
                        <Button 
                            type="primary" 
                            disabled={filesList.length === 0}
                            loading={uploading}
                            htmlType="submit"
                        >
                            {uploading ? "Subiendo..." : "Comienza a subir!"}     
                        </Button>
                    </Form>
                </Modal>

            {/*Tarjetas*/}
            <div className="site-card-border-less-wrapper">
                {dataPlanos.map(element=>{
                    return (
                        <Card size="large" key={element.uidUsuario} hoverable bordered={false} className="card" actions={[<DownloadOutlined key="Descargar" onClick={()=>{handleDownloadPlano(element)}}/>,<EditOutlined key="Editar" />,<DeleteOutlined key="Eliminar"/>,]}>
                            <Meta avatar={<Avatar src={`http://localhost:4000/api/uploads/usuarios/${element.uidUsuario}`}/>} title={element.titulo} description={element.descripcion} />
                            <div className="text-center mt-3">
                                <span>Fecha de registro: {element.fechaRegistro}</span>
                            </div>
                        </Card>
                    )
                })}
           </div>


        </>
    )
}
