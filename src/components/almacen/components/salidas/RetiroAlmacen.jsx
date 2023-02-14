import React from "react";

import { Upload } from "antd";

//Icons
import { InboxOutlined } from "@ant-design/icons";
import { ArrowRight } from "react-bootstrap-icons";

//Style CSS
import "./assets/styleRetiroAlmacen.css";

//Component's
import { ProductosList } from "./components/ProductosList";
import { CardSalida } from "./components/CardSalida";
import { Beneficiarios } from "./components/Beneficiarios";
import { SalidasSucessScreen } from "./components/SalidasSucessScreen";

//Custom hook's
import { useRetiroAlmacen } from "../../../../hooks/useRetiroAlmacen";

const { Dragger } = Upload;

export const RetiroAlmacen = () => {
    //Custom hook for logic
    const {
        values,
        handleInputChange,
        tiposSalidas,
        propsDragger,

        agregarProducto,
        cambiarCantidadProducto,
        eliminarProducto,
        cambiarTipoSalida,
        cambiarBeneficiario,
        realizarRetiroAlmacen,
        retirarOtraVezAlmacen,
    } = useRetiroAlmacen();

    if (values.doned)
        return (
            <SalidasSucessScreen
                salida={values.salida}
                retirarOtraVezAlmacen={retirarOtraVezAlmacen}
            />
        );
    else
        return (
            <section className="retirarAlmacenContenedor">
                <div className="contentLeft">
                    <h1 className="titulo">Lista de productos a retirar</h1>
                    <p className="descripcion">
                        Escanea los productos que seran retirados del almacen y
                        su cantidad <br /> respectiva por cada uno de ellos.
                    </p>
                    <form onSubmit={agregarProducto}>
                        <input
                            className="form-control descripcion barraBusqueda"
                            placeholder="Busca un producto por su codigo de barras..."
                            autoFocus
                            name="searchBar"
                            value={values.searchBar}
                            onChange={handleInputChange}
                        ></input>
                    </form>
                    <ProductosList
                        cambiarCantidadProducto={cambiarCantidadProducto}
                        productos={values.listaProductos}
                        eliminarProducto={eliminarProducto}
                    />
                    <p className="descripcion">
                        Ten en cuenta que los productos retirados deben tener la
                        etiqueta de{" "}
                        <span className="text-success">disponible</span>
                    </p>
                </div>

                <div className="contentRight">
                    <h1 className="titulo">Detalles de la salida</h1>
                    <p className="descripcion">
                        Completa la salida del almacen proveyendo informacion
                        acerca del destinatario y motivo.
                    </p>
                    <h2 className="sub-titulo">Tipo de salida</h2>

                    {tiposSalidas.map((tipo) => (
                        <CardSalida
                            tipo={tipo}
                            tipoSalidaElegida={values.tipoSalida}
                            cambiarTipoSalida={cambiarTipoSalida}
                            key={tipo.nombre}
                        />
                    ))}

                    <h1 className="sub-titulo">Selecciona el beneficiario</h1>
                    <Beneficiarios
                        beneficiarioElegido={values.beneficiario}
                        cambiarBeneficiario={cambiarBeneficiario}
                        tipoSalida={values.tipoSalida}
                    />

                    <h1 className="sub-titulo">Motivo</h1>
                    <textarea
                        className="form-control descripcion"
                        name="motivo"
                        value={values.motivo}
                        onChange={handleInputChange}
                        rows={5}
                    />

                    <h1 className="sub-titulo">Adjunta evidencia</h1>
                    <Dragger {...propsDragger} className="bg-body dragger">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click o arrastra el archivo de evidencia aqui
                        </p>
                        <p className="ant-upload-hint">
                            Soporte para varias imagenes de tipo JPG/PNG.
                        </p>
                    </Dragger>
                    <p className="descripcion">Cantidad de fotos a subir: {values.filesList.length}</p>
                    <div className="row">
                        <button
                            type="primary"
                            className="btn btn-warning sub-titulo"
                            disabled={
                                values.listaProductos.length === 0 ||
                                values.filesList.length === 0 ||
                                values.motivo.length === 0
                                // TODO: Evaluar si es merma o NO
                            }
                            onClick={realizarRetiroAlmacen}
                        >
                            Retirar
                            <span className="ms-2 sub-titulo">
                                <ArrowRight />
                            </span>
                        </button>
                    </div>
                </div>
            </section>
        );
};
