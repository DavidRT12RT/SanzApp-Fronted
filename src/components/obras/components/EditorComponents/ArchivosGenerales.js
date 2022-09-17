import { Upload, message, Modal, Button, Divider, Input, Form } from "antd";
import { InboxOutlined,UploadOutlined,ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate,useSearchParams } from 'react-router-dom';
import { CloudArrowUpFill, FolderPlus,Arrow90degUp } from 'react-bootstrap-icons';
import React, { useEffect, useMemo, useState } from 'react'
import { fetchConToken, fetchConTokenSinJSON } from "../../../../helpers/fetch";
import { Dirent } from "./ArchivosGeneralesComponents/Dirent";
const { Dragger } = Upload;
const { confirm } = Modal;

export const ArchivosGenerales = ({obraInfo,socket}) => {
    const obraId = obraInfo._id;

    //Hooks
    const [isModalVisible, setIsModalVisible] = useState({estado:false,tipo:null});
    const [filesList, setFilesList] = useState([]);
    const [filesListDragger, setFilesListDragger] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [archivos, setArchivos] = useState({
        files:[],
        directories:[]
    });
    const navigate = useNavigate();
    const path = searchParams.get("path");
    


    useEffect(() => {
        let query = (path === null ) ? "" : path
        const fetchData = async() => {
            const resp = await fetchConToken(`/obras/${obraId}/archivos/${query}`);
            const body = await resp.json();
            if(resp.status != 200) return navigate(-1);
            //Peticion con exito 
            setArchivos({
                files:body.content.files,
                directories:body.content.directories
            });
        }
        fetchData();
    }, [path]);
 
    const props = {
        multiple:true,
        onRemove : file => {
            const newFiles = filesList.filter(fileOnState => fileOnState.name != file.name);
            setFilesList(newFiles);
        },
        beforeUpload: file => {
            //Checar si el archivo es PDF O XML
            setFilesList(files => [...files,file]);
            return false;
        },
        listType:"picture",
        fileList : filesList
    };

    const propsDragger = {
        multiple:true,
        onRemove : file => {
            const newFiles = filesListDragger.filter(fileOnState => fileOnState.name != file.name);
            setFilesListDragger(newFiles);
        },
        headers: {
            "x-token":localStorage.getItem("token")
        },
        action:`http://localhost:4000/api/obras/${obraId}/archivos/${(path === null ) ? "" : path}`,
        beforeUpload: file => {
            //Checar si el archivo es PDF O XML
            setFilesListDragger(files => [...files,file]);
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') return message.success(`${info.file.name} Archivo subido exitosamente al servidor!.`);
            if (status === 'error') return message.error(`${info.file.name} Error al subir archivo al servidor,contacta a David!.`);
        },

        listType:"picture",
        fileList : filesListDragger
    }

    const crearDirectory = async(values) => {
        confirm({
            title:"¿Seguro quieres crear el directorio en el sistema?",
            icon:<ExclamationCircleOutlined />,
            content:"El directorio se creara y podras guardar archivos en el.",
			okText:"Crear directorio",
			cancelText:"Volver atras",
            async onOk(){
                let query = (path === null ) ? "" : path
                console.log(query);
                const resp = await fetchConToken(`/obras/${obraId}/crear-directorio/archivos/${query}`,{name:values.nombre},"POST");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);
                //Directorio creado con exito!
                message.success(body.msg);
            }
        });
    }

    const subirArchivos = async() => {

        let query = (path === null ) ? "" : path
        confirm({
            title:`Seguro quieres subir estos archivos a el path "${query}"`,
            icon:<ExclamationCircleOutlined />,
            content:"Los archivos sera subidos al servidor y podran ser consumidos por los demas con acceso a la obra...",
			okText:"Subir archivos",
			cancelText:"Volver atras",
            async onOk(){
                let query = (path === null ) ? "" : path
                const formData = new FormData();
                for(let i = 0; i < filesList.length; i++) formData.append(`archivo ${i}`,filesList[i]);
                const resp = await fetchConTokenSinJSON(`/obras/${obraId}/archivos/${query}`,formData,"POST");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);
                //Archivo subido con exito al servidor
                message.success(body.msg);
            }
        });
 
    }

    return (
        <div className="p-5 container" style={{minHeight:"100vh"}}>
            <div className="container">
                <h1 className="titulo text-center" style={{fontSize:""}}>Archivos Generales</h1>
                <Divider/>
                <Dragger {...propsDragger} style={{borderStyle:"dashed",borderWidth:"medium"}} height="150px">
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text descripcion">Arrastra archivo(s) aqui para subir</p>
                </Dragger>
                <button className="btn btn-primary d-block w-100 descripcion" style={{color:"#fff",backgroundColor:"#2b4764",borderColor:"#28415b",padding:"8px 16px",fontSize:"18px",borderRadius:"0.3rem"}} onClick={()=>{setIsModalVisible({estado:true,tipo:"subir-archivos"})}}>Subir archivo(s) <span style={{fontSize:"25px"}}><CloudArrowUpFill/></span></button>
                <button type="primary" className="d-block w-100 mt-3 descripcion" style={{color:"#fff",backgroundColor:"#00bc8c",borderColor:"#00bc8c",padding:"8px 16px",fontSize:"18px",borderRadius:"0.3rem"}} onClick={()=>{setIsModalVisible({estado:true,tipo:"crear-directorio"})}}> Crear directorio <span style={{fontSize:"25px"}}><FolderPlus/></span></button>
                
               <div className="mt-4 d-flex justify-content-start align-items-center flex-wrap gap-2">
                    {
                        path != null && (
                            <div className="card">
                                <div className="card-body">
                                    <span style={{color:"#61AFEF",fontSize:"24px",marginRight:"7px"}}><Arrow90degUp/></span>
                                    <a className="descripcion" onClick={()=>{
                                        /*
                                        Eliminar todos los query params de una
                                        searchParams.delete("path");
                                        setSearchParams(searchParams);
                                        */
                                        navigate(-1);
                                    }}>Subir un nivel...</a>
                                </div>
                            </div>
                        )        
                    }

                    <p className="titulo-descripcion" style={{width:"100%"}}>Carpetas</p>
                    {archivos.directories.map(directory => (
                        <Dirent key={directory} obraId={obraId} isDirectory={true} name={directory} path={path} setSearchParams={setSearchParams}/>
                    ))}

                    <p className="titulo-descripcion mt-3" style={{width:"100%"}}>Archivos</p>
                    {archivos.files.map(file => (
                        <Dirent key={file} obraId={obraId} isDirectory={false} name={file} path={path} setSearchParams={setSearchParams}/>
                    ))}

                </div>
            </div>
            <Modal visible={isModalVisible.estado} onOk={()=>{setIsModalVisible({estado:false,tipo:null})}} onCancel={()=>{setIsModalVisible({estado:false,tipo:null})}} footer={null}>
                <h1 className="titulo">{isModalVisible.tipo ==="crear-directorio" ? "Crear directorio" : "Subir archivos"}</h1>
                {
                    isModalVisible.tipo == "subir-archivos"
                    ? <><Upload {...props}><Button icon={<UploadOutlined/>}>Selecciona el archivo(s)</Button></Upload><Button type="primary" onClick={subirArchivos}>Subir archivo(s)</Button></>
                    : <Form layout="vertical" onFinish={crearDirectory}><Form.Item label="Nombre del directorio" name="nombre" rules={[{required:"true",message:"El nombre del directorio es requerido!"}]}><Input/></Form.Item><Button type="primary">Crear directorio</Button></Form>
                }
            </Modal>
      </div>
    )
}


