import { Upload, message, Modal, Button, Divider } from "antd";
import { InboxOutlined, CaretUpOutlined } from "@ant-design/icons";
import ImagenesObra from "./ImagenesObra";
import { fetchConToken } from "../../../../helpers/fetch";
import { useState, useEffect } from "react";

export const Imagenes = ({ obraInfo, socket }) => {
    const [activeButton, setActiveButton] = useState(1);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [categoria, setCategoria] = useState("Todas");

    const [fileList, setFileList] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const handleChangeCategoria = (e) => {
        setCategoria(e.target.value);
    };

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

    const DataFiltrada = (categoria = "Todas") => {
        let newData = [];
        obraInfo.fotosObra.forEach((element) => {
            if (element.categoria === categoria || categoria === "Todas") {
                newData.push({
                    name: element.imagen,
                    status: "done",
                    url: `http://localhost:4000/api/uploads/obras/obra/${obraId}/${element.imagen}`,
                    categoria: element.categoria,
                });
            }
        });

        return newData;
    };

    useEffect(() => {
        switch (activeButton) {
            case 1:
                //Categoria : Todas
                setFileList(DataFiltrada());
                break;

            case 2:
                //Categorias material

                setFileList(DataFiltrada("Material"));
                break;

            case 3:
                //Categoria resultados
                setFileList(DataFiltrada("Resultados"));
                break;

            case 4:
                //Categorias en proceso
                setFileList(DataFiltrada("En proceso"));
                break;

            default:
                setFileList(DataFiltrada());
                break;
        }
    }, [activeButton]);

    const asignarClase = (value) => {
        if (value === activeButton) {
            return "primary";
        }
    };

    const { Dragger } = Upload;
    const props = {
        name: "file",
        multiple: true,
        onChange(info) {
            const { status } = info.file;
            if (status !== "uploading") {
                //console.log(info.file, info.fileList);
                 message.loading("Subiendo imagen...");
            }

            if (status === "done") {
                message.success(
                    `El archivo con nombre "${info.file.name}" se ha subido con exito con la categoria de ${categoria} al servidor!`
                );
                //TODO : Mandar la señal al socket del server
                socket.emit("actualizar-imagenes", { obraId });
            } else if (status === "error") {
                message.error(
                    `${info.file.name} Error en la subidad de archivos!`
                );
            }
        },
        onDrop(e) {
            //console.log('Dropped files', e.dataTransfer.files);
        },
        beforeUpload: (file) => {
            if (!categoria) {
                message.error("La categoria de la imagen NO esta definidad!");
                return false;
            }
            return file;
        },
    };

    const { _id: obraId } = obraInfo;

    const formatearArchivo = (file) => {
        return {
            archivo: file,
            categoria: categoria,
        };
    };

    useEffect(() => {
        //Obtener path imagenes que estan en el backend por medio de los sockets
        const newData = [];
        obraInfo.fotosObra.forEach((element) => {
            newData.push({
                name: element.imagen,
                status: "done",
                url: `http://localhost:4000/api/uploads/obras/obra/${obraId}/${element.imagen}`,
                categoria: element.categoria,
            });
        });
        setFileList(newData);

        return () => {
            setFileList([]);
        };
    }, [obraInfo, obraId]);

    const onRemove = async (values) => {
        const { name } = values;
        try {
            const resp = await fetchConToken(
                `/uploads/obras/obra/${obraId}/${name}`,
                undefined,
                "DELETE"
            );
            const body = await resp.json();
            if (resp.status === 200) {
                //La imagen se borro con exito!
                //TODO : Mandar al server
                socket.emit("actualizar-imagenes", { obraId });
                message.success(body.msg);
            } else {
                message.error(body.msg);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="p-lg-2">
                <div>
                    <h2>Galeria de imagenes</h2>
                    <p className="lead">
                        Sección para la subidad de imagenes acerca de la obra
                        como trabajos,resultados,etc.
                    </p>
                    <Divider />
                    <div className="d-flex justify-content-start gap-2 mb-3">
                        <Button
                            type={asignarClase(1)}
                            onClick={() => setActiveButton(1)}
                        >
                            Todas
                        </Button>
                        <Button
                            type={asignarClase(2)}
                            onClick={() => setActiveButton(2)}
                        >
                            Material
                        </Button>
                        <Button
                            type={asignarClase(3)}
                            onClick={() => setActiveButton(3)}
                        >
                            En proceso
                        </Button>
                        <Button
                            type={asignarClase(4)}
                            onClick={() => setActiveButton(4)}
                        >
                            Resultados
                        </Button>
                    </div>
                    {/*<Button type="primary" onClick={showModal}>Agregar una nueva imagen!</Button>*/}
                    <Button
                        type="primary"
                        loading={isLoading}
                        onClick={showModal}
                        icon={<CaretUpOutlined />}
                        size="large"
                    >
                        Agregar una nueva imagen!
                    </Button>
                </div>

                {fileList.length > 0 && (
                    <ImagenesObra fileList={fileList} onRemove={onRemove} />
                )}
                <Modal
                    visible={isModalVisible}
                    onOk={handleOk}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <h1>Agregar una nueva imagen!</h1>
                    <p className="lead">
                        Selecciona la nueva imagen que quieras agregas a la
                        galeria de la obra y despues agrega la categoria a la
                        que esta pertenece.
                    </p>

                    <div className="form-group">
                        <label>Categoria de la imagen</label>

                        <select
                            defaultValue={categoria}
                            className="form-control mt-2"
                            value={categoria}
                            onChange={handleChangeCategoria}
                        >
                            <option>Todas</option>
                            <option>Material</option>
                            <option>En proceso</option>
                            <option>Resultados</option>
                        </select>
                    </div>
                    <Dragger
                        {...props}
                        action={`http://localhost:4000/api/uploads/obras/obra/${obraId}`}
                        method="PUT"
                        data={formatearArchivo}
                        style={{ width: "100%" }}
                        className="mx-auto mt-5"
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click o arrastra tus imagenes!
                        </p>
                        <p className="ant-upload-hint">
                            Soporte para una o varias imagenes con extension
                            ".PNG" ".JPG" ".GIF"
                        </p>
                    </Dragger>
                </Modal>
            </div>
        </>
    );
};
