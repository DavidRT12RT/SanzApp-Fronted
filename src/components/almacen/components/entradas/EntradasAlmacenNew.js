import {
    Checkbox,
    Divider,
    message,
    Modal,
    Form,
    Select,
    Button,
    DatePicker,
    Input,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";

//Components y hooks
import { useEntradas } from "../../../../hooks/useEntradas";
import { fetchConToken } from "../../../../helpers/fetch";
import { EntradaCard } from "./EntradaCard";

//Tiempo
import moment from "moment";
import locale from "antd/es/date-picker/locale/es_ES";

//Reporte PDF
import { ReporteEntradasAlmacen } from "../../../../reportes/Almacen/ReporteEntradasAlmacen";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

//Estilos CSS
import "./assets/styleEntradasAlmacen.css";

import imagenEntradas from "./assets/imgs/juicy-girl-and-guy-preparing-start-up-rocket-to-launch-with-ideas.png";

const { RangePicker } = DatePicker;

export const EntradasAlmacenNew = () => {
    const { isLoading, entradas, setEntradas } = useEntradas();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [entradasRegistros, setEntradasRegistros] = useState([]);
    const [parametrosBusqueda, setParametrosBusqueda] = useState({});
    const { search } = useLocation();

    useEffect(() => {
        entradas.map((registro) => (registro.key = registro._id));
        setEntradasRegistros(entradas);
    }, [entradas]);

    useEffect(() => {
        //Hacer una peticion a el servidor de obras y pasarle el parametro de busqueda
        let query = {};
        for (const property in parametrosBusqueda) {
            query = { ...query, [property]: parametrosBusqueda[property] };
        }
        setSearchParams(query);
    }, [parametrosBusqueda]);

    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetchConToken(`/entradas/${search}`);
            const body = await resp.json();
            if (resp.status != 200) return message.error(body.msg);
            //Busqueda con exito!
            setEntradas(body.entradas);
        };
        fetchData();
    }, [search]);

    const generarReporte = async (values) => {
        const entradasFiltradas = entradasRegistros.filter((entrada) => {
            if (
                moment(entrada.fecha).isBetween(
                    values.intervaloFecha[0].format("YYYY-MM-DD"),
                    values.intervaloFecha[1].format("YYYY-MM-DD")
                ) &&
                values.tipo.includes(entrada.tipo)
            )
                return entrada;
        });

        const blob = await pdf(
            <ReporteEntradasAlmacen
                intervaloFecha={[
                    values.intervaloFecha[0].format("YYYY-MM-DD"),
                    values.intervaloFecha[1].format("YYYY-MM-DD"),
                ]}
                entradas={entradasFiltradas}
                categorias={values.tipo}
            />
        ).toBlob();
        saveAs(blob, "reporte_entradas.pdf");
        setIsModalVisible(false);
    };

    return (
        <div className="containerEntradas">
            <div className="containerRegister row mt-3">
                <div className="col-12 col-lg-9">
                    <h1 className="titulo text-warning">Entradas almacen</h1>
                    <p className="descripcion">
                        Crea una nueva entrada en el almacen o genera un{" "}
                        <b>reporte</b> sobre las entradas que ha tenido el
                        sistema.
                    </p>

                    <div className="d-flex justify-content-start align-items-center flex-wrap gap-2 mt-4">
                        {/*                        <Input.Search size="large" enterButton className="descripcion barraBusquedaSalidas" placeholder="Buscar una entrada por su numero de barras..."/> */}
                        <Link to={`/almacen/ingresar/`}>
                            <button type="button" className="btn btn-warning">
                                Ingresar almacen
                            </button>
                        </Link>
                        <button
                            type="primary"
                            className="btn btn-primary"
                            onClick={() => {
                                setIsModalVisible(true);
                            }}
                        >
                            Generar reporte
                        </button>
                    </div>
                </div>
                <div className="col-lg-3 d-none d-lg-block">
                    {/* <img src={imagenEntradas} className="imagenRegister" /> */}
                </div>
            </div>

            <div className="row mt-3 containerBusquedaEntradas">
                <div className="col-12">
                    <h1 className="sub-titulo">FILTROS</h1>
                    <Divider />

                    <h1 className="titulo-descripcion text-muted mb-3">
                        Tipo de entrada 
                    </h1>
                    <Checkbox.Group
                        onChange={(valores) => {
                            setParametrosBusqueda({
                                ...parametrosBusqueda,
                                tipo: valores,
                            });
                        }}
                        className="d-flex flex-column"
                    >
                        <Checkbox
                            value={"sobrante-obra"}
                            key={"obra"}
                            className="ms-2"
                        >
                            SOBRANTE DE OBRA
                        </Checkbox>
                        <Checkbox value={"compra-directa"} key={"resguardo"}>
                            COMPRA DIRECTA
                        </Checkbox>
                        <Checkbox value={"devolucion-resguardo"} key={""}>
                            DEVOLUCION RESGUARDO
                        </Checkbox>
                    </Checkbox.Group>
                </div>
                <div className="col-12 mt-3">
                    <h1 className="sub-titulo">ENTRADAS ENCONTRADAS</h1>
                    <Divider />
                    {entradasRegistros.length === 0 && (
                        <p className="titulo-descripcion text-danger">
                            Ninguna entrada encontrada...
                        </p>
                    )}
                    <div className="containerEntradasCards">
                        <Input.Search size="large" enterButton placeholder="Busca una entrada por su codigo de barras..."/>
                        {entradasRegistros.map((entrada) => (
                            <EntradaCard entrada={entrada} key={entrada.key} />
                        ))}
                    </div>
                </div>
            </div>
            <Modal
                visible={isModalVisible}
                footer={null}
                onCancel={() => {
                    setIsModalVisible(false);
                }}
                onOk={() => {
                    setIsModalVisible(false);
                }}
            >
                <h1 className="titulo" style={{ fontSize: "30px" }}>
                    Filtrar registros del reporte
                </h1>
                <p className="descripcion">
                    Filtrar los registros de las entradas que tendra el reporte.
                </p>
                <Form onFinish={generarReporte} layout={"vertical"}>
                    <Form.Item
                        label="Intervalo de fecha"
                        name="intervaloFecha"
                        rules={[
                            {
                                required: true,
                                message: "Ingresa un intervalo de fecha!",
                            },
                        ]}
                    >
                        <RangePicker
                            locale={locale}
                            size="large"
                            style={{ width: "100%" }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Tipo de entrada"
                        name="tipo"
                        rules={[
                            {
                                required: true,
                                message: "Ingresa un tipo de entrada!",
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Tipo de entrada..."
                            size="large"
                        >
                            <Select.Option value="sobrante-obra">
                                Sobrante de obra
                            </Select.Option>
                            <Select.Option value="devolucion-resguardo">
                                Devolucion resguardo
                            </Select.Option>
                            <Select.Option value="compra-directa">
                                Compra directa
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Descargar PDF
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};
