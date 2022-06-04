import { Upload, message, Modal, Button, Divider, Input } from "antd";
import { InboxOutlined, CaretUpOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from 'react'

export const ArchivosGenerales = ({obraInfo,socket}) => {

    const [fileList, setFileList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const { Dragger } = Upload;

    const {_id:obraId} = obraInfo;

    useEffect(() => {
        //Obtener path imagenes que estan en el backend por medio de los sockets
        const newData = [];
        obraInfo.planos.registros.forEach((element) => {
            newData.push({
                name: element.nombreArchivo,
                status: "done",
                url: `http://localhost:4000/api/uploads/obras/obra/${obraId}/planos/${element.nombreArchivo}`,
            });
        });
        setFileList(newData);
        return () => {
            setFileList([]);
        };
    }, [obraInfo, obraId]);

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

    const handleSearch = (value) => {

    }

    const formatearArchivo = (file) => {
        return {
            archivo: file,
        };
    };

    const props = {
        name: "file",
        multiple: true,
        onChange(info) {
            const { status } = info.file;
            if (status === "done") {
                message.success(
                    `El archivo con nombre ${info.file.name} se ha subido con exito!`
                );
            } else if (status === "error") {
                message.error(
                    `${info.file.name} Error en la subidad de archivos!`
                );
            }
        },
    };

    return (
        <>
            <h1>Archivos generales</h1>
            <p className="lead">En esta sección se puede subir documentos generales como archivos Excel,Word,Power Point,PDF,etc.</p>
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
                    Subir un nuevo archivo
                </Button>
            </div>
            <Modal
                visible={isModalVisible}
                onOk={handleOk}
                footer={null}
                onCancel={handleCancel}
            >                    
                <h1>Subir un archivo</h1>
                <p className="lead">
                    El documento sera guardado con el nombre del archivo actual asi que si existe otro con el mismo nombre este se eliminara!.
                </p>

                <Dragger
                    {...props}
                    action={`http://localhost:4000/api/uploads/obras/obra/${obraId}/archivos`}
                    method="POST"
                    data={formatearArchivo}
                    style={{ width: "100%" }}
                    className="mx-auto mt-5"
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click o arrastra el archivo!
                    </p>
                    <p className="ant-upload-hint">
                        Soporte para archivo de todo tipo
                    </p>
                </Dragger>
            </Modal>


            
        </>
    )
}


