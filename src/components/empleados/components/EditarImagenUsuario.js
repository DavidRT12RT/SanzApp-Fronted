import React from 'react'
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
const { Dragger } = Upload;

export const EditarImagenUsuario = ({usuarioInfo,socket}) => {
    
    const {uid:usuarioId} = usuarioInfo;
    const usuarioActualizador = useSelector(store => store.auth.name);

    const formatearArchivo = (file) =>{
        return {archivo:file}
    }

    const props = {
        name: 'archivo',
        multiple: false,
        maxCount:1,
        action: `http://localhost:4000/api/uploads/usuarios/${usuarioId}`,
        data : formatearArchivo(),
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} se ha subido correctamente!`);
            } else if (status === 'error') {
                message.error(`${info.file.name} fallo a la hora de subir al servidor!`);
            }
        },

        method:"PUT",
        beforeUpload:(file) =>{
            const extensionesPermitidas = ["image/jpg","image/jpeg","image/png"];
            if(!extensionesPermitidas.includes(file.type)){
                message.error(`Solo se acepta archivos tipos PNG y JPG, NO ${file.type}`);
                return false
            }
        }
    };


    return (
        <div className='mt-3'>
            <h1>Editar imagen del usuario</h1>
            <p className="lead">Arrastra la imagen y esta se subira automaticamente!</p>
            <span>NOTA: Si ya existe una imagen registrada esta sera eliminada y reemplazada.</span>
            <Dragger {...props} className="mt-3">
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click o arrastra las imagenes a esta area</p>
                <p className="ant-upload-hint">
                    Soporte para solo una imagen de tipo PNG o JPG. 
                </p>
            </Dragger>
        </div>
    )
}
