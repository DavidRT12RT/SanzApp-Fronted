import { message,Modal } from 'antd';
import React from 'react'
import { ExclamationCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { FolderFill,FileEarmarkTextFill,FileArrowDownFill,TrashFill,Eye } from 'react-bootstrap-icons';
import { fetchConToken } from '../../../../../helpers/fetch';
const { confirm } = Modal;


export const Dirent = ({obraId,isDirectory,name,path,setSearchParams,socket}) => {

    const nameOriginal = name;
    if(name.length > 20 && (!isDirectory)) name = name.slice(0,18) + "..."; 

    if(name.length > 16 && isDirectory) name = name.slice(0,16) + "...";

    const descargarArchivo = async() => {
        let query = (path === null ) ? "/" : ("/"+path+"/") 
        const resp = await fetchConToken(`/obras/${obraId}/descargar-archivo/archivos${query}${nameOriginal}`);
        if(resp.status != 200) return message.error("Imposible descargar archivo del servidor! , contacta a David!");
        const bytes = await resp.blob();
        let element = document.createElement('a');
        element.href = URL.createObjectURL(bytes);
        element.setAttribute('download',nameOriginal);
        element.click();
    }

    const borrarArchivo = async() => {
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
                        const resp = await fetchConToken(`/obras/${obraId}/eliminar-archivo/archivos${query}${nameOriginal}`,{},"DELETE");
                        const body = await resp.json();
                        if(resp.status != 200) return message.error(body.msg);
                        //Archivo eliminando con exito!
                        message.success(body.msg);
                        socket.emit("actualizar-archivos-obra",({obraId,query}));
                    }
                });
            }
        });
    }
    return (
        <div className="card" style={{height:"70px",minWidth:"290px",maxWidth:"380px"}}>
            <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                    <span style={{color:"#61AFEF",fontSize:"24px",marginRight:"7px"}}>{isDirectory ? <FolderFill/> : <FileEarmarkTextFill/>}</span>
                    { 
                        isDirectory 
                        ? 
                            <a onClick={(e)=>{
                                e.preventDefault();
                                let query = (path === null ) ? nameOriginal : (path + `--${nameOriginal}`);
                                setSearchParams({path:query});
                            }} className="descripcion">{name}
                            </a> 
                        : 
                            <a className="descripcion">{name}</a>
                    }
                </div>

               {!isDirectory && (
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        {/* 
                            <spa style={{color:"",fontSize:"24px"}}><Eye/></spa>
                            <span style={{color:"#61AFEF",fontSize:"24px",cursor:"pointer"}} onClick={descargarArchivo}><FileArrowDownFill/></span>
                            <span style={{color:"#E06C75",fontSize:"24px",cursor:"pointer"}} onClick={borrarArchivo}><TrashFill/></span>
                        */}
                    </div>
               )}
            </div>
        </div>
    )
}
