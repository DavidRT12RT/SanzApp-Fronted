import {
    Button,
    Checkbox,
    DatePicker,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Select,
    Table,
    Tag,
} from "antd";
import React, { useEffect, useState } from "react";

import { SalidaCard } from "./SalidaCard";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { fetchConToken } from "../../../../helpers/fetch";
import { ReporteSalidasAlmacen } from "../../../../reportes/Almacen/ReporteSalidasAlmacen";

import { useSalidas } from "../../../../hooks/useSalidas";
import { useObras } from "../../../../hooks/useObras";
import { useEmpleados } from "../../../../hooks/useEmpleados";

import moment from "moment";
import locale from "antd/es/date-picker/locale/es_ES";

//PDF REPORTE
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

//Estilos CSS
import "./assets/styleSalidasAlmacen.css";
import imagenSalidas from "./assets/imgs/juicy-boy-with-open-laptop.png";

const { RangePicker } = DatePicker;

export const SalidasAlmacenNew = () => {
    const { isLoading, salidas, setSalidas } = useSalidas();
    const { isLoading: isLoadingObras, obras } = useObras();
    const { isLoading: isLoadingEmpleados, empleados } = useEmpleados();

    const [registrosSalidas, setRegistrosSalidas] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [parametrosBusqueda, setParametrosBusqueda] = useState({});
    const { search } = useLocation();
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        salidas.map((registro) => (registro.key = registro._id));
        setRegistrosSalidas(salidas);
    }, [salidas]);

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
            const resp = await fetchConToken(`/salidas/${search}`);
            const body = await resp.json();
            if (resp.status != 200) return message.error(body.msg);
            //Busqueda con exito!
            setSalidas(body.salidas);
        };
        fetchData();
    }, [search]);

    const filtrarSalidaPorCodigo = (values) => {
        if (values.length == 0) return setRegistrosSalidas(salidas);
        const salidaFiltrada = salidas.filter(
            (salida) => salida._id === values
        );
        setRegistrosSalidas(salidaFiltrada);
    };

    const renderizarOpcionesBeneficiario = () => {
        if (categorias.includes("resguardo") && categorias.includes("obra")) {
            return (
                <>
                    <Form.Item
                        label="Selecciona el empleado"
                        name="beneficiarioResguardo"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Selecciona el empleado"
                            size="large"
                        >
                            {empleados.map((empleado) => {
                                return (
                                    <Select.Option
                                        key={empleado.uid}
                                        value={empleado.uid}
                                    >
                                        {empleado.nombre}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Selecciona la obra"
                        name="beneficiarioObra"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Selecciona la obra"
                            size="large"
                        >
                            {obras.map((obra) => {
                                return (
                                    <Select.Option
                                        key={obra._id}
                                        value={obra._id}
                                    >
                                        {obra.titulo}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    </Form.Item>
                </>
            );
        }
        if (categorias.includes("obra")) {
            return (
                <Form.Item label="Selecciona la obra" name="beneficiarioObra">
                    <Select placeholder="Selecciona la obra" size="large">
                        {obras.map((obra) => {
                            return (
                                <Select.Option key={obra._id} value={obra._id}>
                                    {obra.titulo}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
            );
        }
        if (categorias.includes("resguardo")) {
            return (
                <Form.Item
                    label="Selecciona el empleado"
                    name="beneficiarioResguardo"
                >
                    <Select placeholder="Selecciona el empleado" size="large">
                        {empleados.map((empleado) => {
                            return (
                                <Select.Option
                                    key={empleado.uid}
                                    value={empleado.uid}
                                >
                                    {empleado.nombre}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
            );
        }
    };

    const generarReporte = async (values) => {
        let salidasFiltradas = [];

        if (
            (values.beneficiarioObra === undefined ||
                values.beneficiarioObra.length === 0) &&
            values.tipo.includes("obra")
        ) {
            //Buscara por todas las obras
            values.beneficiarioObra = obras.map((obra) => obra._id);
        }

        if (
            (values.beneficiarioResguardo === undefined ||
                values.beneficiarioResguardo.length === 0) &&
            values.tipo.includes("resguardo")
        ) {
            //Buscara por todos los empleados
            values.beneficiarioResguardo = empleados.map(
                (empleado) => empleado.uid
            );
        }

        salidasFiltradas = registrosSalidas.filter((salida) => {
            if (
                moment(salida.fechaCreacion).isBetween(
                    values.intervaloFecha[0].format("YYYY-MM-DD"),
                    values.intervaloFecha[1].format("YYYY-MM-DD")
                ) &&
                values.tipo.includes(salida.tipo)
            ) {
                if (
                    salida.tipo === "obra" &&
                    values.beneficiarioObra.includes(
                        salida.beneficiarioObra._id
                    )
                )
                    return salida;
                if (
                    salida.tipo === "resguardo" &&
                    values.beneficiarioResguardo.includes(
                        salida.beneficiarioResguardo._id
                    )
                )
                    return salida;
            }
        });
        const blob = await pdf(
            <ReporteSalidasAlmacen
                intervaloFecha={[
                    values.intervaloFecha[0].format("YYYY-MM-DD"),
                    values.intervaloFecha[1].format("YYYY-MM-DD"),
                ]}
                categorias={values.tipo}
                salidas={salidasFiltradas}
            />
        ).toBlob();
        saveAs(blob, "reporte_salidas.pdf");
        setIsModalVisible(false);
    };

    return (
        <div className="containerSalidas">
            <div className="containerRegister">
                <div>
                    <h1 className="titulo text-warning">Salidas almacen</h1>
                    <p className="descripcion">
                        Crea una nueva salida en el almacen o genera un{" "}
                        <b>reporte</b> sobre las salidas que ha tenido el
                        sistema.
                    </p>
                    <div className="mt-3">
                        <Link to={`/almacen/retirar/`}>
                            <button type="button" className="btn btn-warning">
                                Retirar almacen
                            </button>
                        </Link>
                        <button
                            type="primary"
                            className="btn btn-primary ms-2"
                            onClick={() => {
                                setIsModalVisible(true);
                            }}
                        >
                            Generar reporte
                        </button>
                    </div>
                </div>
                <img src={imagenSalidas} className="imagenRegister" />
            </div>

            <div className="row mt-5 containerBusquedaSalidas">
                <div className="col-12">
                    <h1 className="sub-titulo">FILTROS</h1>
                    <Divider />
                    <h1 className="titulo-descripcion text-muted">
                        Tipo de salida
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
                        <Checkbox value={"obra"} key={"obra"} className="ms-2">
                            OBRA
                        </Checkbox>
                        <Checkbox value={"resguardo"} key={"resguardo"}>
                            RESGUARDO
                        </Checkbox>
                        <Checkbox value={"merma"} key={"merma"}>
                            MERMA
                        </Checkbox>
                    </Checkbox.Group>
                </div>
                <div className="col-12 mt-3">
                    <h1
                        className="titulo-descripcion"
                        style={{ fontSize: "20px" }}
                    >
                        SALIDAS ENCONTRADAS
                    </h1>
                    <Divider />
                    <Input.Search
                        size="large"
                        onSearch={filtrarSalidaPorCodigo}
                        enterButton
                        className="descripcion barraBusquedaSalidas"
                        placeholder="Buscar una salida por su numero de barras..."
                    />
                    {registrosSalidas.length === 0 && (
                        <p className="titulo-descripcion text-danger mt-4">
                            Ninguna salida encontrada en el sistema aun...
                        </p>
                    )}
                    <div className="containerSalidasCardsAlmacen mt-3">
                        {registrosSalidas.map((salida) => (
                            <SalidaCard salida={salida} key={salida.key} />
                        ))}
                    </div>
                </div>
            </div>
            <Modal
                footer={null}
                onCancel={() => {
                    setIsModalVisible(false);
                }}
                onOk={() => {
                    setIsModalVisible(false);
                }}
                visible={isModalVisible}
            >
                <h1 className="titulo" style={{ fontSize: "30px" }}>
                    Filtrar registros del reporte
                </h1>
                <p className="descripcion">
                    Filtrar los registros que tendra el reporte.
                </p>
                <Form onFinish={generarReporte} layout="vertical" form={form}>
                    <Form.Item
                        name="intervaloFecha"
                        label="Intervalo de fecha del registro(s)"
                        rules={[
                            {
                                required: true,
                                message: "Ingresa la fecha del filtro",
                            },
                        ]}
                    >
                        <RangePicker size="large" locale={locale} />
                    </Form.Item>
                    <Form.Item
                        label="Tipo de salida"
                        name="tipo"
                        rules={[
                            {
                                required: true,
                                message: "Ingresa un tipo de salida!",
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="Tipo de salida..."
                            size="large"
                            onChange={(e) => {
                                setCategorias(e);
                            }}
                        >
                            <Select.Option value="obra">Obra</Select.Option>
                            <Select.Option value="resguardo">
                                Resguardo
                            </Select.Option>
                            <Select.Option value="merma">Merma</Select.Option>
                        </Select>
                    </Form.Item>
                    {renderizarOpcionesBeneficiario()}
                    <p>(Por defecto la fecha sera la del mes actual)</p>
                    <Button type="primary" htmlType="submit">
                        Descargar PDF
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};
