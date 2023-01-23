import { Divider, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { SanzSpinner } from "../../../../helpers/spinner/SanzSpinner";
import { useInventarios } from "../../../../hooks/useInventarios";

//Estilos CSS
import "./assets/styleInventariosAlmacen.css";
import { CategoriaCard } from "./CategoriaCard";
import { InventarioCard } from "./InventarioCard";

import imagenInventarios from "./assets/imgs/juicy-man-programmer-writing-code-and-make-web-design-on-a-pc.png";
import { fetchConToken } from "../../../../helpers/fetch";

export const InventariosAlmacen = () => {
    const { isLoading, inventarios, setInventarios } = useInventarios();
    const [registrosInventarios, setRegistrosInventarios] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [parametrosBusqueda, setParametrosBusqueda] = useState({});
    const { search } = useLocation();

    useEffect(() => {
        inventarios.map((inventario) => (inventario.key = inventario._id));
        setRegistrosInventarios(inventarios);
    }, [inventarios]);

    useEffect(() => {
        setParametrosBusqueda({
            ...parametrosBusqueda,
            tipo: categorias,
        });
    }, [categorias]);

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
            const resp = await fetchConToken(`/inventarios/${search}`);
            const body = await resp.json();
            if (resp.status != 200) return message.error(body.msg);
            //Busqueda con exito!
            setInventarios(body.inventarios);
        };
        fetchData();
    }, [search]);

    const tiposDeInventarios = [
        "TODOS",
        "VARIOS-PRODUCTOS",
        "UN-PRODUCTO",
        "POR-CATEGORIA",
    ];

    if (isLoading) {
        return <SanzSpinner />;
    } else {
        return (
            <>
                <div className="containerInventarios">
                    <div className="containerRegister">
                        <div>
                            <h1 className="titulo text-warning">
                                Buscar crear un nuevo inventario o generar un
                                reporte?
                            </h1>
                            <p className="descripcion">
                                Crea un nuevo inventario del almacen respecto a
                                varias categorias y genera <br />
                                un reporte de los inventarios que ha tenido el
                                sistema.
                            </p>
                            <Link
                                to={`/almacen/inventarios/registrar-inventario/`}
                            >
                                <button
                                    type="button"
                                    className="btn btn-warning mt-3"
                                >
                                    Crear nuevo inventario
                                </button>
                            </Link>
                        </div>
                        <img
                            src={imagenInventarios}
                            className="imagenRegister"
                        />
                    </div>

                    <h1
                        className="titulo-descripcion mt-5"
                        style={{ fontSize: "20px" }}
                    >
                        FILTRAR POR:
                    </h1>
                    <Divider />
                    <h1
                        className="titulo-descripcion"
                        style={{ fontSize: "13px" }}
                    >
                        Tipo de inventario
                    </h1>
                    <div className="containerCategorias mt-3">
                        {tiposDeInventarios.map((categoria) => (
                            <CategoriaCard
                                categoria={categoria}
                                categorias={categorias}
                                setCategorias={setCategorias}
                            />
                        ))}
                    </div>
                    <h1
                        className="titulo-descripcion mt-5"
                        style={{ fontSize: "20px" }}
                    >
                        INVENTARIOS ENCONTRADOS
                    </h1>
                    <Divider />
                    <div className="containerInventariosRegistros">
                        <Input.Search
                            size="large"
                            enterButton
                            className="descripcion barraBusquedaInventarios"
                            placeholder="Buscar un inventario por su concepto..."
                        />
                        {registrosInventarios.map((inventario) => (
                            <InventarioCard
                                inventario={inventario}
                                key={inventario.key}
                            />
                        ))}
                    </div>
                </div>
            </>
        );
    }
};
