import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Form, Modal, message } from "antd";

//Context's
import { useSelector } from "react-redux";
import { SocketContext } from "../context/SocketContext";

//Icon's
import { ExclamationCircleOutlined } from "@ant-design/icons";

//Helper's
import { fetchConToken, fetchConTokenSinJSON } from "../helpers/fetch";

//Custom hook's
import { useCategorias } from "./useCategorias";
import { useForm } from "./useForm";

//PDF
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

//Date's
import moment from "moment";

//Report's
import { ReporteGeneral } from "../reportes/Productos/ReporteGeneral";

const { confirm } = Modal;

export const useProducto = () => {
    const { productoId } = useParams();
    const navigate = useNavigate();
    const [filesList, setFilesList] = useState([]);
    const [informacionProducto, setInformacionProducto] = useState({});
    const [uploading, setUploading] = useState(false);
    const { isLoading: isLoadingCategorias, categorias } = useCategorias();
    const { socket } = useContext(SocketContext);
    const [isProductoEditing, setIsProductoEditing] = useState(false);
    const [formValues, handleInputChange, setValues] = useForm({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const auth = useSelector((store) => store.auth);

    //Formulario para editar informacion del producto

    useEffect(() => {
        const fetchDataProducto = async () => {
            const resp = await fetchConToken(`/productos/${productoId}`);
            const body = await resp.json();
            if (resp.status === 200) {
                body.registrosEntradas.sobranteObra.map((registro) => {
                    registro.tipo = "sobranteObra";
                    registro.key = registro._id;
                });
                body.registrosEntradas.devolucionResguardo.map((registro) => {
                    registro.tipo = "devolucionResguardo";
                    registro.key = registro._id;
                });
                body.registrosEntradas.compraDirecta.map((registro) => {
                    registro.tipo = "compraDirecta";
                    registro.key = registro._id;
                });
                body.registrosSalidas.obra.map((registro) => {
                    registro.tipo = "obra";
                    registro.key = registro._id;
                });
                body.registrosSalidas.merma.map((registro) => {
                    registro.tipo = "merma";
                    registro.key = registro._id;
                });
                body.registrosSalidas.resguardo.map((registro) => {
                    registro.tipo = "resguardo";
                    registro.key = registro._id;
                });
                setInformacionProducto(body);
            } else {
                message.error("El ID del producto NO existe");
                return navigate(-1);
            }
        };
        fetchDataProducto();
        //Setear el tipo de cada salida
    }, []);

    useEffect(() => {
        socket?.on("actualizar-producto", (producto) => {
            if (productoId === producto._id) {
                producto.registrosEntradas.sobranteObra.map((registro) => {
                    registro.tipo = "sobranteObra";
                    registro.key = registro._id;
                });
                producto.registrosEntradas.devolucionResguardo.map(
                    (registro) => {
                        registro.tipo = "devolucionResguardo";
                        registro.key = registro._id;
                    }
                );
                producto.registrosEntradas.compraDirecta.map((registro) => {
                    registro.tipo = "compraDirecta";
                    registro.key = registro._id;
                });
                producto.registrosSalidas.obra.map((registro) => {
                    registro.tipo = "obra";
                    registro.key = registro._id;
                });
                producto.registrosSalidas.merma.map((registro) => {
                    registro.tipo = "merma";
                    registro.key = registro._id;
                });
                producto.registrosSalidas.resguardo.map((registro) => {
                    registro.tipo = "resguardo";
                    registro.key = registro._id;
                });
                setInformacionProducto(producto);
            }
        });
    }, [socket, setInformacionProducto, productoId]);

    useEffect(() => {
        if (Object.keys(informacionProducto).length != 0) {
            //Seteamos la informacion por si el usuario quisiera editar esta
            setValues({
                nombre: informacionProducto.nombre,
                marca: informacionProducto.marca,
                categoria: informacionProducto.categoria._id,
                inventariable: informacionProducto.inventariable,
                estado: informacionProducto.estado,
                estatus: informacionProducto.estatus,
                costo: informacionProducto.costo,
                descripcion: informacionProducto.descripcion,
                aplicaciones: informacionProducto.aplicaciones,
                unidad: informacionProducto.unidad,
                cantidad: informacionProducto.cantidad,
            });
        }
    }, [informacionProducto]);

    const onFinishEditingProduct = () => {
        for (const property in formValues) {
            if (formValues[property] === "")
                return message.error("Faltan registros por completar!");
        }
        confirm({
            title: "¿Seguro quieres editar la informacion del producto?",
            icon: <ExclamationCircleOutlined />,
            content:
                "La informacion del producto se vera cambiada y se anadira un registro de la accion.",
            okText: "Editar",
            cancelText: "Volver atras",
            async onOk() {
                setUploading(true);
                const formData = new FormData();

                for (const property in formValues) {
                    formData.append(property, formValues[property]);
                }

                if (filesList.length != 0) {
                    filesList.forEach((file) => {
                        formData.append("archivo", file);
                    });
                }

                const resp = await fetchConTokenSinJSON(
                    `/productos/${productoId}`,
                    formData,
                    "PUT"
                );
                const body = await resp.json();

                if (resp.status === 200) {
                    message.success(body.msg);
                    setIsProductoEditing(false);
                    setInformacionProducto(body.producto);
                    setFilesList([]);
                    //Mandar a actualizar el producto
                    socket.emit("actualizar-producto", { id: productoId });
                } else {
                    message.error(body.msg);
                    setIsProductoEditing(false);
                }
                setUploading(false);
            },
        });
    };
    const crearReporteGeneral = async (values) => {
        //Sacar entradas del producto
        const entradas = [
            ...informacionProducto.registrosEntradas.sobranteObra,
            ...informacionProducto.registrosEntradas.devolucionResguardo,
            ...informacionProducto.registrosEntradas.compraDirecta,
        ];
        const entradasFiltradas = entradas.filter((entrada) => {
            if (
                values.tipoEntrada.includes(entrada.tipo) &&
                moment(entrada.fecha).isBetween(
                    values.intervaloFecha[0].format("YYYY-MM-DD"),
                    values.intervaloFecha[1].format("YYYY-MM-DD")
                )
            )
                return entrada;
        });

        //Sacar salidas del producto
        const salidas = [
            ...informacionProducto.registrosSalidas.obra,
            ...informacionProducto.registrosSalidas.merma,
            ...informacionProducto.registrosSalidas.resguardo,
        ];
        const salidasFiltradas = salidas.filter((salida) => {
            if (
                values.tipoSalida.includes(salida.tipo) &&
                moment(salida.fecha).isBetween(
                    values.intervaloFecha[0].format("YYYY-MM-DD"),
                    values.intervaloFecha[1].format("YYYY-MM-DD")
                )
            )
                return salida;
        });

        const blob = await pdf(
            <ReporteGeneral
                informacionProducto={informacionProducto}
                productoId={productoId}
                intervaloFecha={[
                    values.intervaloFecha[0].format("YYYY-MM-DD"),
                    values.intervaloFecha[1].format("YYYY-MM-DD"),
                ]}
                entradas={entradasFiltradas}
                salidas={salidasFiltradas}
                entradasCategorias={values.tipoEntrada}
                salidasCategorias={values.tipoSalida}
            />
        ).toBlob();
        saveAs(blob, "reporte_general.pdf");
    };

    return {
        crearReporteGeneral,
        isModalVisible,
        setIsModalVisible,
        form,
        informacionProducto,
        isLoadingCategorias,
        isProductoEditing,
        setIsProductoEditing,
        onFinishEditingProduct,
        auth,
        filesList,
        setFilesList,
        formValues,
        handleInputChange,
        categorias,
    };
};
