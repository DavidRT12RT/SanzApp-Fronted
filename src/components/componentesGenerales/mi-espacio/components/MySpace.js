import { Upload, message, Modal, Button, Divider, Input, Form, Checkbox } from "antd";
import { InboxOutlined,UploadOutlined,ExclamationCircleOutlined,WarningOutlined } from "@ant-design/icons";
import { useNavigate,useSearchParams } from 'react-router-dom';
import { CloudArrowUpFill,FileArrowDownFill,TrashFill,FolderPlus,Arrow90degUp } from 'react-bootstrap-icons';
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

import { fetchConToken, fetchConTokenSinJSON } from "../../../../helpers/fetch";
import { SocketContext } from "../../../../context/SocketContext";
import moment from "moment";
import { Dirent } from "../../../application/components/obras/components/EditorComponents/ArchivosGeneralesComponents/Dirent";

//Estilos CSS 
import "../assets/styleMySpace.css";

const { Dragger } = Upload;
const { confirm } = Modal;



export const MySpace = () => {
    
    //uid usuario y permisos de este
    const { uid,name } = useSelector(store => store.auth);
    //Hooks
    const [isModalVisible, setIsModalVisible] = useState({estado:false,tipo:null});
    const [isDirectory, setIsDirectory] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [filesListDragger, setFilesListDragger] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [archivos, setArchivos] = useState({
        files:[],
        directories:[]
    });
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();
    const path = searchParams.get("path");
    const [mensajeBienvenida, setMensajeBienvenida] = useState("");

    
    useEffect(() => {

        //Obtener hora actual para mandar mensaje al usuario
        const time = moment().hour();
        //Noche 
        if(time >= 19) setMensajeBienvenida(`Buenas noches`);
        //Tarde
        if(time >= 12 && time < 19) setMensajeBienvenida(`Buenas tardes`);
        //Dia o madrugada
        if(time >= 0 && time < 12) setMensajeBienvenida(`Buenos dias`);
    },[]);
    

    useEffect(() => {
        let query = (path === null ) ? "" : path
        const fetchData = async() => {
            const resp = await fetchConToken(`/usuarios/${uid}/archivos/${query}`);
            const body = await resp.json();
            if(resp.status != 200) {
                console.log(body.msg);
                message.error("Carpeta NO encontrada en el servidor,contacta a David!");
                return navigate(-1);
            }
            //Peticion con exito 
            setArchivos({
                files:body.content.files,
                directories:body.content.directories
            });
        }
        fetchData();
    }, [path]);

    useEffect(() => {
        socket.on("actualizar-archivos-usuario",(values) => {
            let query;
            if(values.query.startsWith("/")){
                query = (path === null ) ? "/" : `/${path}/`
            }else{
                query = (path === null ) ? "/" : path 
            }
            /*
            console.log("Nuestro path",query);
            console.log("Path que llega",values.query);
            */
            //Checamos si el path es el mismo en el que estamos
            if(query === values.query){
                const fetchData = async() => {
                    const resp = await fetchConToken(`/usuarios/${uid}/archivos${query}`);
                    const body = await resp.json();
                    if(resp.status != 200) {
                        message.error("Carpeta NO encontrada en el servidor,contacta a David!");
                        return navigate(-1);
                    }
                    //Peticion con exito 
                    setArchivos({
                        files:body.content.files,
                        directories:body.content.directories
                    });
                }
                fetchData();               
            }

        });
    }, [socket,path]);


    const propsDragger = {
        multiple:true,
        onRemove : file => {
            const newFiles = filesListDragger.filter(fileOnState => fileOnState.name != file.name);
            setFilesListDragger(newFiles);
        },
        headers: {
            "x-token":localStorage.getItem("token")
        },
        action:async(file) => {
            let query = (path === null ) ? "/" : `/${path}/` 
            const formData = new FormData();
            for(let i = 0; i < filesListDragger.length; i++) formData.append(`archivo ${i}`,filesListDragger[i]);
            const resp = await fetchConTokenSinJSON(`/usuarios/${uid}/archivos${query}`,formData,"POST");
            const body = await resp.json();
            if(resp.status != 200) return message.error(body.msg);
            //Archivo subido con exito al servidor
            message.success(body.msg);
            socket.emit("actualizar-archivos-usuario",({uid,query}));
            setFilesListDragger([]);
        },
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
        confirm({
            title:"¿Seguro quieres crear el directorio en el sistema?",
            icon:<ExclamationCircleOutlined />,
            content:"El directorio se creara y podras guardar archivos en el.",
			okText:"Crear directorio",
			cancelText:"Volver atras",
            async onOk(){
                let query = (path === null ) ? "/" : `/${path}/` 
                //const resp = await fetchConToken(`/obras/${obraId}/crear-directorio/archivos${query}`,{name:values.nombre},"POST");
                const resp = await fetchConToken(`/usuarios/${uid}/crear-directorio/archivos${query}`,{name:values.nombre},"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Directorio creado con exito!
                message.success(body.msg);
                //avisando a mi mismo y a los demas que se crea una carpeta en el servidor para que actualizen al igual que yo
                //socket.emit("actualizar-archivos-obra",({obraId,query}));
                socket.emit("actualizar-archivos-usuario",({uid,query}));
                setIsModalVisible({estado:false});
            } 
        });
    }

    const subirArchivos = async() => {
        let query = (path === null ) ? "/" : `/${path}/` 
        confirm({
            title:`Seguro quieres subir estos archivos a el path "${query}"`,
            icon:<ExclamationCircleOutlined />,
            content:"Los archivos sera subidos al servidor y podran ser consumidos por los demas con acceso a la obra...",
			okText:"Subir archivos",
			cancelText:"Volver atras",
            async onOk(){
                const formData = new FormData();
                for(let i = 0; i < filesList.length; i++) formData.append(`archivo ${i}`,filesList[i]);
                const resp = await fetchConTokenSinJSON(`/usuarios/${uid}/archivos${query}`,formData,"POST");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);
                //Archivo subido con exito al servidor
                message.success(body.msg);
                socket.emit("actualizar-archivos-usuario",({uid,query}));
                setIsModalVisible({estado:false});
                setFilesList([]);
            }
        });
 
    }

    const descargarArchivo = async(file) => {
        let query = (path === null ) ? "/" : ("/"+path+"/") 
        const resp = await fetchConToken(`/usuarios/${uid}/descargar-archivo/archivos${query}${file}`);
        if(resp.status != 200) return message.error("Imposible descargar archivo del servidor! , contacta a David!");
        const bytes = await resp.blob();
        let element = document.createElement('a');
        element.href = URL.createObjectURL(bytes);
        element.setAttribute('download',file);
        element.click();
    }

    const descargarCarpeta = async(directory) => {
        let query = (path === null ) ? "/" : ("/"+path+"/") 
        const resp = await fetchConToken(`/usuarios/${uid}/descargar-carpeta/archivos${query}${directory}`);
        if(resp.status != 200) return message.error("Imposible descargar archivo del servidor! , contacta a David!");
        const bytes = await resp.blob();
        let element = document.createElement('a');
        element.href = URL.createObjectURL(bytes);
        element.setAttribute('download',directory);
        element.click();
    }

    const eliminarCarpeta = async(directory) => {
        confirm({
            title:"Seguro quieres ELIMINAR esta carpeta del servidor?",
            icon:<ExclamationCircleOutlined />,
            content:"Se eliminaran todos los archivos que esten dentro de esta y una vez eliminado no podra ser recuperado de ninguna forma.",
			okText:"ELIMINAR",
			cancelText:"Volver atras",
            async onOk(){
                confirm({
                    title:"REALMENTE SEGURO?",
                    icon:<WarningOutlined />,
                    content:"Ultima advertencia",
			        okText:"ELIMINAR DEL SERVIDOR",
                    cancelText:"Volver atras",
                    async onOk(){
                        let query = (path === null ) ? "/" : ("/"+path+"/") 
                        const resp = await fetchConToken(`/usuarios/${uid}/eliminar-carpeta/archivos${query}${directory}`,{},"DELETE");
                        const body = await resp.json();
                        if(resp.status != 200) return message.error("Imposible eliminar carpeta del servidor! , contacta a David!");
                        //Se borro la carpeta con exito!
                        socket.emit("actualizar-archivos-usuario",({uid,query}));
                        message.success(body.msg);
                    }
                })
            }
        });
    }

    const borrarArchivo = async(file) => {
        confirm({
            title:"Seguro quieres ELIMINAR este archivo del servidor?",
            icon:<ExclamationCircleOutlined />,
            content:"Una vez ELIMINADO no podra ser recuperado de ninguna forma.",
			okText:"ELIMINAR",
			cancelText:"Volver atras",
            async onOk(){
                confirm({
                    title:"REALMENTE SEGURO?",
                    icon:<WarningOutlined />,
                    content:"Ultima advertencia",
			        okText:"ELIMINAR DEL SERVIDOR",
                    cancelText:"Volver atras",
                    async onOk(){
                        let query = (path === null ) ? "/" : ("/"+path+"/") 
                        const resp = await fetchConToken(`/usuarios/${uid}/eliminar-archivo/archivos${query}${file}`,{},"DELETE");
                        const body = await resp.json();
                        if(resp.status != 200) return message.error(body.msg);
                        //Archivo eliminando con exito!
                        message.success(body.msg);
                        socket.emit("actualizar-archivos-usuario",({uid,query}));
                    }
                });
            }
        });
    }

    return (
        <>
            <div className="container p-5" style={{minHeight:"100vh"}}>
                <h1 className="titulo text-center">{mensajeBienvenida} <span className="text-primary">{name}</span> 😀👋</h1>
                <Divider/>
                <Dragger {...propsDragger} style={{borderStyle:"dashed",borderWidth:"medium"}} height="150px" directory={isDirectory}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text descripcion">Arrastra archivo(s) aqui para subir</p>
                </Dragger>
                <Checkbox checked={isDirectory} onChange={(e) => setIsDirectory(e.target.checked)}>Subir directorio</Checkbox>
                <button className="btn btn-primary d-block w-100 descripcion mt-4" style={{color:"#fff",backgroundColor:"#2b4764",borderColor:"#28415b",padding:"8px 16px",fontSize:"18px",borderRadius:"0.3rem"}} onClick={()=>{setIsModalVisible({estado:true,tipo:"subir-archivos"})}}>Subir archivo(s) <span style={{fontSize:"25px"}}><CloudArrowUpFill/></span></button>
                <button type="primary" className="d-block w-100 mt-3 descripcion" style={{color:"#fff",backgroundColor:"#00bc8c",borderColor:"#00bc8c",padding:"8px 16px",fontSize:"18px",borderRadius:"0.3rem"}} onClick={()=>{setIsModalVisible({estado:true,tipo:"crear-directorio"})}}> Crear directorio <span style={{fontSize:"25px"}}><FolderPlus/></span></button>
                <Divider/>
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
                        <>
                            <ContextMenuTrigger id={directory}>
                                <Dirent id={directory} key={directory} isDirectory={true} name={directory} path={path} setSearchParams={setSearchParams} socket={socket}/>
                            </ContextMenuTrigger>

                            <ContextMenu id={directory} className="contextMenu">
                                <MenuItem onClick={() => {descargarCarpeta(directory)}} className="mt-3">
                                    <p><span style={{color:"#61AFEF",fontSize:"22px",cursor:"pointer"}}><FileArrowDownFill/></span> Descargar carpeta</p>
                                </MenuItem>
                                <MenuItem onClick={() => {eliminarCarpeta(directory)}} className="mb-3">
                                    <p><span style={{color:"#E06C75",fontSize:"22px",cursor:"pointer"}}><TrashFill/></span> Borrar carpeta</p>
                                </MenuItem>
                            </ContextMenu>
                        </>
                       )
                   )}

                    <p className="titulo-descripcion mt-3" style={{width:"100%"}}>Archivos</p>
                    {archivos.files.map(file => (
                        <>
                            <ContextMenuTrigger id={file}>
                                <Dirent id={file} key={file} isDirectory={false} name={file} path={path} setSearchParams={setSearchParams} socket={socket}/>
                            </ContextMenuTrigger>

                            <ContextMenu id={file} className="contextMenu">

                                <MenuItem onClick={() => {descargarArchivo(file)}} className="mt-3">
                                    <p><span style={{color:"#61AFEF",fontSize:"22px",cursor:"pointer"}}><FileArrowDownFill/></span> Descargar archivo</p>
                                </MenuItem>

                                <MenuItem onClick={() => {borrarArchivo(file)}} className="mb-3">
                                    <p><span style={{color:"#E06C75",fontSize:"22px",cursor:"pointer"}}><TrashFill/></span> Borrar archivo</p>
                                </MenuItem>

                            </ContextMenu>
                        </>
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
        </>
    )
}
