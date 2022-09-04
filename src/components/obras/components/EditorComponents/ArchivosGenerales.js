import { Upload, message, Modal, Button, Divider, Input, Form } from "antd";
import { InboxOutlined, CaretUpOutlined,UploadOutlined } from "@ant-design/icons";
import { useLocation, useNavigate,useSearchParams } from 'react-router-dom';
import { CloudArrowUpFill, FolderPlus,Arrow90degUp } from 'react-bootstrap-icons';
import queryString from 'query-string'
import React, { useEffect, useMemo, useState } from 'react'
import { fetchConToken } from "../../../../helpers/fetch";
import { Dirent } from "./ArchivosGeneralesComponents/Dirent";
const { Dragger } = Upload;

export const ArchivosGenerales = ({obraInfo,socket}) => {
    const obraId = obraInfo._id;

    //Hooks
    const [isModalVisible, setIsModalVisible] = useState({estado:false,tipo:null});
    const [filesList, setFilesList] = useState([]);
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

    const crearDirectory = async(values) => {
        console.log(values);
    }

    console.log(isModalVisible);
    return (
        <div className="p-5 container" style={{minHeight:"100vh"}}>
            <div className="container">
                <h1 className="titulo text-center" style={{fontSize:""}}>Archivos Generales</h1>
                <Dragger {...props} style={{borderStyle:"dashed",borderWidth:"medium"}} height="150px">
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text descripcion">Arrastra archivo(s) aqui para subir</p>
                </Dragger>
                <button className="btn btn-primary d-block w-100 descripcion" style={{color:"#fff",backgroundColor:"#2b4764",borderColor:"#28415b",padding:"8px 16px",fontSize:"18px",borderRadius:"0.3rem"}} onClick={()=>{setIsModalVisible({estado:true,tipo:"subir-archivos"})}}>Subir archivo(s) <span style={{fontSize:"25px"}}><CloudArrowUpFill/></span></button>
                <button type="primary" className="d-block w-100 mt-3 descripcion" style={{color:"#fff",backgroundColor:"#00bc8c",borderColor:"#00bc8c",padding:"8px 16px",fontSize:"18px",borderRadius:"0.3rem"}} onClick={()=>{setIsModalVisible({estado:true,tipo:"crear-directorio"})}}> Crear directorio <span style={{fontSize:"25px"}}><FolderPlus/></span></button>
                
               <div className="mt-4 d-flex justify-content-center align-items-center flex-wrap gap-2">
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

                    {archivos.directories.map(directory => (
                        <Dirent key={directory} obraId={obraId} isDirectory={true} name={directory} path={path} setSearchParams={setSearchParams}/>
                    ))}

                    {archivos.files.map(file => (
                        <Dirent key={file} obraId={obraId} isDirectory={false} name={file} path={path} setSearchParams={setSearchParams}/>
                    ))}

                </div>
            </div>
            <Modal visible={isModalVisible.estado} onOk={()=>{setIsModalVisible({estado:false,tipo:null})}} onCancel={()=>{setIsModalVisible({estado:false,tipo:null})}} footer={null}>
                <h1 className="titulo">{isModalVisible.tipo ==="crear-directorio" ? "Crear directorio" : "Subir archivos"}</h1>
                {
                    isModalVisible.tipo == "subir-archivos"
                    ? <><Upload {...props}><Button icon={<UploadOutlined/>}>Selecciona el archivo(s)</Button></Upload><Button type="primary">Subir archivo(s)</Button></>
                    : <Form layout="vertical" onFinish={crearDirectory}><Form.Item label="Nombre del directorio" name="nombre" rules={[{required:"true",message:"El nombre del directorio es requerido!"}]}><Input/></Form.Item><Button type="primary">Crear directorio</Button></Form>
                }
            </Modal>
      </div>
    )
}


