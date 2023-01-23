import React, { useContext, useState } from "react";

//Context's
import { SocketContext } from "../../../../context/SocketContext";

//Style CSS
import "./assets/styleRetiroAlmacen.css";

//Component's
import { ProductosList } from "./components/ProductosList";
import { CardSalida } from "./components/CardSalida";
import { Beneficiarios } from "./components/Beneficiarios";
import { ArrowRight } from "react-bootstrap-icons";
import { fetchConToken } from "../../../../helpers/fetch";
import { message } from "antd";

const tiposSalidas = [
    {
        nombre: "obra",
        descripcion: "Salida a una obra(la obra tiene que estar registrada)",
    },
    {
        nombre: "resguardo",
        descripcion:
            "Salida a un resguardo(el empleado beneficiado tiene que estar registrado)",
    },
    {
        nombre: "merma",
        descripcion: "Salida por merma (Se tiene que adjuntar evidencia)",
    },
];

export const RetiroAlmacen = () => {
    const [tipoSalidaElegida, setTipoSalidaElegida] = useState(tiposSalidas[0]);
    const { socket } = useContext(SocketContext);
    const [listaProductos, setListaProductos] = useState([]);
    const [valueSearch, setValueSearch] = useState("");

    const agregarProducto = async (e) => {
        e.preventDefault();

        if (valueSearch.length == 0) return;

        const resp = await fetchConToken(`/productos/${valueSearch}`);
        const body = await resp.json();

        if (resp.status != 200) {
            setValueSearch("");
            return message.error("No existe ningun producto por ese ID!");
        }

        if (body.estatus === false) {
            setValueSearch("");
            return message.error("Producto con estatus NO DISPONIBLE");
        }

        if (body.cantidad === 0) {
            setValueSearch("");
            return message.error("Producto sin cantidad en stock registrado!");
        }

        let bandera = false;
        const nuevaListaProductos = listaProductos.map((producto) => {
            if (producto._id === valueSearch) {
                bandera = true;
                body.cantidad - producto.cantidadARetirar === 0
                    ? message.error(
                          "No puedes agregar mas de lo que hay en bodega registrado!"
                      )
                    : (producto.cantidadARetirar += 1);
            }
            return producto;
        });

        if (bandera) {
            setListaProductos(nuevaListaProductos); //El producto ya se encontraba en la lista y solo aumentamos la cantidad de este
        }

        if (!bandera) {
            setListaProductos((productos) => [
                ...productos,
                // { id: valueSearch, cantidad: 1, costoXunidad: body.costo },
                { ...body, cantidadARetirar: 1 },
            ]); //El producto NO estaba asi que lo agregamos
        }

        setValueSearch("");
    };

    console.log(listaProductos);

    return (
        <section className="retirarAlmacenContenedor">
            <div className="contentLeft">
                <h1 className="titulo">Lista de productos</h1>
                <p className="descripcion">
                    Escanea los productos que seran retirados del almacen y su{" "}
                    cantidad <br /> respectiva por cada uno de ellos.
                </p>
                <form onSubmit={agregarProducto}>
                    <input
                        className="form-control descripcion barraBusqueda"
                        placeholder="Busca un producto por su codigo de barras..."
                        value={valueSearch}
                        onChange={(e) => {
                            setValueSearch(e.target.value);
                        }}
                    ></input>
                </form>
                <ProductosList productos={listaProductos} />
                <p className="descripcion">
                    Ten en cuenta que los productos retirados deben tener la
                    etiqueta de <span className="text-success">disponible</span>
                </p>
            </div>

            <div className="contentRight">
                <h1 className="titulo">Detalles de la salida</h1>
                <p className="descripcion">
                    Completa la salida del almacen proveyendo informacion acerca
                    del destinatario y motivo.
                </p>
                <h2 className="sub-titulo">Tipo de salida</h2>

                {tiposSalidas.map((tipo) => (
                    <CardSalida
                        tipo={tipo}
                        tipoSalidaElegida={tipoSalidaElegida}
                        setTipoSalidaElegida={setTipoSalidaElegida}
                        key={tipo.nombre}
                    />
                ))}

                {tipoSalidaElegida !== null && (
                    <>
                        <h1 className="sub-titulo">
                            Selecciona el beneficiario
                        </h1>
                        {/* <Beneficiarios
                            tipo={"salida"}
                            tipoSalida={tipoSalida}
                        /> */}
                    </>
                )}

                <div className="row">
                    <button
                        type="primary"
                        className="btn btn-warning sub-titulo"
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
