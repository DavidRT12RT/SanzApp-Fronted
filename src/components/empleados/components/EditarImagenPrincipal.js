import { InboxOutlined } from '@ant-design/icons';
import { message, Upload,Button } from 'antd';
import React, { useState } from 'react';
import { fetchConTokenSinJSON } from '../../../helpers/fetch';
const { Dragger } = Upload;

export const EditarImagenPrincipal = ({usuarioInfo,socket,setIsModalVisibleEditInfo}) => {


    const [filesList, setFilesList] = useState([]);
    const [uploading, setUploading] = useState(false);

    const handleUpdateImageCamioneta = async() => {
        const formData = new FormData();
        filesList.forEach(file => {
            formData.append("archivo",file);
        });
        setUploading(true);
        try {
            const resp = await fetchConTokenSinJSON(`/uploads/usuarios/${usuarioInfo.uid}`,formData,"PUT");
            const body = await resp.json();
            //Quitando los archivos del filesList
            setFilesList([]);
            setUploading(false);
            if(resp.status === 200){
                console.log(body);
                message.success(body);
                setIsModalVisibleEditInfo(false);
                return;
            }
            message.error(body);
        } catch (error) {
            message.error(error);
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
            if(filesList.length < 1){
                setFilesList(files => [...files,file]);
            }else{
                message.error("Solo puedes subir 1 una imagen");
            }
            return false;
        },
        listType:"picture",
        maxCount:2,
        fileList : filesList
    };

    return (
        <>
            <span className="text-muted">La imagen se principal actual se vera reemplazada por la nueva
                y NO se podra recuperar de ninguna forma.
            </span>
            <Dragger {...props} className="mt-3">
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click o arrastra el archivo para subirlo</p>
                <p className="ant-upload-hint">
                    Soporte solo para imagenes de tipo JPG,PNG,JPEG
                </p>
            </Dragger>
            <Button
                type="primary" 
                disabled={filesList.length === 0}
                loading={uploading}
				size="large"
				style={{width:"100%"}}
                onClick={handleUpdateImageCamioneta}
            >Subir imagen</Button>
        </>
    )
}
