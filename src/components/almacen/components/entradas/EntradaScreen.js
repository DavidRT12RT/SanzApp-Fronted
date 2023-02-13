import { Button, Divider, message, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { fetchConToken } from "../../../../helpers/fetch";
import { SanzSpinner } from "../../../../helpers/spinner/SanzSpinner";

export const EntradaScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [informacionEntrada, setInformacionEntrada] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetchConToken(`/entradas/${id}`);
            const body = await resp.json();
            if (resp.status != 200) return navigate(-1);
            body.listaProductos.map(
                (producto) => (producto.key = producto._id)
            );
            setInformacionEntrada(body);
        };
        fetchData();
    }, []);

   const handleDownloadEvidencia = async () => {
        /*
        const blob = await pdf((
            <ReporteSalidaAlmacen salida={informacionSalida}/>
        )).toBlob();
        saveAs(blob,`salida_almacen_${informacionSalida._id}.pdf`)
        */

        console.log("Entrada reporte!");
    };

    const columnsProductosDevueltos = [
        {
            title: <p className="titulo-descripcion">Nombre del producto</p>,
            render: (text, record) => (
                <p className="descripcion">{record.id.nombre}</p>
            ),
        },
        {
            title: <p className="titulo-descripcion">Marca del producto</p>,
            render: (text, record) => (
                <p className="descripcion">{record.id.marca}</p>
            ),
        },
        {
            title: <p className="titulo-descripcion">Categoria</p>,
            render: (text, record) => (
                <Tag
                    className="descripcion"
                    style={{
                        backgroundColor: record.id.categoria.color,
                        borderColor: record.id.categoria.color,
                        padding: "13px",
                        maxWidth: "fit-content",
                    }}
                >
                    {record.id.categoria.nombre}
                </Tag>
            ),
        },
        {
            title: <p className="titulo-descripcion">Unidad</p>,
            render: (text, record) => (
                <p className="descripcion">{record.id.unidad}</p>
            ),
        },
        {
            title: <p className="titulo-descripcion">Cantidad ingresada</p>,
            render: (text, record) => (
                <p className="descripcion">{record.cantidadIngresada}</p>
            ),
        },
        {
            title: <p className="titulo-descripcion">Costo por unidad</p>,
            render: (text, record) => (
                <p className="descripcion">${record.costoXunidad}</p>
            ),
        },
        {
            title: (
                <p className="titulo-descripcion">Costo total del producto</p>
            ),
            render: (text, record) => (
                <p className="descripcion text-success">
                    ${record.costoXunidad * record.cantidadIngresada}
                </p>
            ),
        },
        {
            title: (
                <p className="titulo-descripcion">Informacion del producto</p>
            ),
            render: (text, record) => (
                <a
                    className="descripcion text-primary"
                    href={`/almacen/productos/${record.id._id}`}
                    target="blank"
                >
                    Ver producto
                </a>
            ),
        },
    ];

    if (informacionEntrada === null) {
        return <SanzSpinner />;
    } else {
        return (
            <div className="container p-5" style={{ minHeight: "100vh" }}>
                <div className="d-flex justify-content-end align-items-center">
                    <Button
                        type="primary"
                        onClick={handleDownloadEvidencia}
                        className="my-3"
                    >
                        Descargar PDF
                    </Button>
                </div>
                <h1 className="titulo">
                    Entrada del almacen
                </h1>
                <div className="row">
                    <div className="col-12 col-lg-6">

                        <Divider />
                        <h1 className="sub-titulo">
                            Informacion de la entrada
                        </h1>
                        <div className="row mt-3">
                            <h1 className="titulo-descripcion col-6">
                                Tipo de la entrada:{" "}
                            </h1>
                            <h1 className="col-6 descripcion">
                                {informacionEntrada.tipo.toUpperCase()}
                            </h1>
                            <h1 className="titulo-descripcion col-6">
                                dinero TOTAL de la entrada:{" "}
                            </h1>
                            <h1 className="col-6 descripcion text-success">
                                ${informacionEntrada.costoTotal}
                            </h1>
                            <h1 className="titulo-descripcion col-6">
                                Fecha creacion:{" "}
                            </h1>
                            <h1 className="col-6 descripcion">
                                {informacionEntrada.fecha}
                            </h1>
                            {(informacionEntrada.tipo == "sobrante-obra" ||
                                informacionEntrada.tipo ==
                                    "devolucion-resguardo") && (
                                <>
                                    <h1 className="titulo-descripcion col-6">
                                        Entrada a la salida:{" "}
                                    </h1>
                                    <Link
                                        to={`/almacen/salidas/${informacionEntrada.salida}`}
                                        target="_blank"
                                    >
                                        <h1 className="col-6 descripcion text-primary">
                                            {informacionEntrada.salida}
                                        </h1>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <Divider />
                        <h1 className="sub-titulo">
                            Informacion del beneficiario
                        </h1>
                        <div className="row">
                            <h1 className="titulo-descripcion text-danger">
                                Para las entradas el beneficiario es el sistema.
                            </h1>
                        </div>
                    </div>
                </div>
                <Divider />
                <h1 className="sub-titulo">Lista de productos devueltos</h1>
                <Table
                    columns={columnsProductosDevueltos}
                    dataSource={informacionEntrada.listaProductos}
                    className="mt-3"
                />
            </div>
        );
    }
};
