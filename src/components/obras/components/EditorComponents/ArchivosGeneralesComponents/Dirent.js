import { message } from 'antd';
import React from 'react'
import { FolderFill,FileEarmarkTextFill,FileArrowDownFill } from 'react-bootstrap-icons';
import { fetchConToken } from '../../../../../helpers/fetch';


export const Dirent = ({obraId,isDirectory,name,path,setSearchParams}) => {

    const nameOriginal = name;
    if(name.length > 18 && isDirectory == false){
        const nombreCortado = name.split('.');
        //const extension = nombreCortado[nombreCortado.length-1];
        name = name.slice(0,18) + "...";
    }else if(name.length > 15 && isDirectory == true){
        name = name.slice(0,15) + "...";
    }
    
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

    return (
        <div className="card" style={{height:"70px",width:"380px"}}>
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

               {!isDirectory && <span style={{color:"#61AFEF",fontSize:"24px",marginRight:"7px"}} onClick={descargarArchivo}><FileArrowDownFill/></span>}
            </div>
        </div>
    )
}
