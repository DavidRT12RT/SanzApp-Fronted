import React from "react";

import { Button, message, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

export const ProductoImage = ({
    isProductoEditing,
    informacionProducto,
    filesList,
    setFilesList,
    setIsModalVisible,
}) => {
    const props = {
        onRemove: (file) => {
            setFilesList([]);
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma función*/
        },
        beforeUpload: (file) => {
            //Verificar que el fileList sea menos a 2
            if (filesList.length < 1) {
                setFilesList((files) => [...files, file]);
            } else {
                message.error("Solo puedes subir 1 archivo en total");
            }
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            return false;
        },
        maxCount: 1,
        fileList: filesList,
    };

    return (
        <>
            {isProductoEditing ? (
                <Dragger {...props} height="300px" className="p-5">
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                        Click o arrastra la nueva foto de el producto
                    </p>
                    <p className="ant-upload-hint">
                        Soporte solo para una imagen ya sea de tipo PNG o JPG.
                    </p>
                </Dragger>
            ) : (
                <div className="d-flex justify-content-center align-items-center flex-column">
                    {/*<PDFDownloadLink document={<DocumentoPDF/>} fileName={`${productoId}.pdf`}></PDFDownloadLink>*/}
                    <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/productos/${informacionProducto._id}`}
                        className="imagen-producto"
                        key={informacionProducto._id}
                    />
                    <Button
                        type="primary"
                        className="mt-3"
                        onClick={() => {
                            setIsModalVisible(true);
                        }}
                    >
                        Descargar reporte general del producto
                    </Button>
                    <p className="text-muted text-center mt-2 w-100">
                        (Entradas y salidas del producto)
                    </p>
                </div>
            )}
        </>
    );
};
