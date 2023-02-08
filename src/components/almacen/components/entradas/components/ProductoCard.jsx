import React from "react";
import { XLg } from "react-bootstrap-icons";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";

const { confirm } = Modal;

export const ProductoCard = ({
    producto,
    cambiarCantidadProducto, 
    eliminarProducto,
    tipo 
}) => {

    console.log("Cambiar cantidad producto",cambiarCantidadProducto);

    console.log("Eliminar producto",eliminarProducto);

    const renderizarValor = () => {
        switch(tipo){
            case "Ingresado":
                return producto.cantidadIngresada;
            case "Retirado":
                return producto.cantidadRetirada;
            case "Bodega":
                return producto.cantidad;
        }
    }

    return (
        <div className="productoCard">
            {
                eliminarProducto != false &&
                    (<XLg
                        className="deleteProductBtn"
                        onClick={(e) => {
                            confirm({
                                title: "¿Seguro quieres borrar el producto de la lista?",
                                icon: <ExclamationCircleOutlined />,
                                okText: "Borrar",
                                cancelText: "Volver atras",
                                async onOk() {
                                    eliminarProducto(producto._id);
                                },
                            });
                        }}
                    />)
            }
           <div className="img">
                <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/productos/${producto._id}`}
                />
            </div>
            <div>
                <h1 className="sub-titulo">{producto.id.nombre || producto.nombre}</h1>
                <p className="descripcion">
                    {
                        (producto.id.descripcion || producto.descripcion).slice(0,30)
                    }
                    ...
                </p>
                <hr style={{ margin: "5px" }} />
                <div className="extraInfo">
                    {
                        cambiarCantidadProducto != false &&
                            (<div>
                                <p className="descripcion">
                                    Ingresar:
                                    <input
                                        className="form-control sub-titulo text-danger"
                                        type="number"
                                        value={producto.cantidadIngresada}
                                        onChange={(e) =>
                                            cambiarCantidadProducto(
                                                producto,
                                                parseInt(e.target.value)
                                            )
                                        }
                                    />
                                </p>
                            </div>)
                    }
                   <div>
                        <p className="descripcion">
                            {tipo}
                            <input
                                className="form-control sub-titulo"
                                type="number"
                                value={
                                    renderizarValor()
                                }
                                readOnly
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
