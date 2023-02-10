import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { ArrowRight } from "react-bootstrap-icons";
import { ProductosList } from "./ProductList";

const { Dragger } = Upload;

export const CapturarProductos = ({
    values,
    handleInputChange,
    propsDragger,
    agregarProducto,
    cambiarCantidadProducto,
    eliminarProducto,
    realizarIngresoAlmacen,
    productosDevueltos = []
}) => {
    return (
        <div className="CapturarProductos">
           <div className="capturar">
                {values.tipoEntrada === "devolucionSalida" && (
                    <>
                        <h1 className="titulo">Lista de productos retirados</h1>
                        <p className="descripcion">Productos que fueron retirados del almacen registrados en la salida.</p>
                        {
                            values.salida.devueltoTotal && (
                                <p className="titulo-descripcion text-success">
                                    TODOS LOS PRODUCTOS HAN SIDO DEVUELTOS AL ALMACEN!
                                </p>
                            )
                        }
                        <ProductosList
                            productos={values.salida.listaProductos}
                            tipo="Retirado"
                        />

                        <h1 className="titulo">Lista de productos devueltos</h1>
                        <p className="descripcion">Productos que han sido devueltos al almacen.</p>
                        <ProductosList
                            productos={
                                productosDevueltos
                            }
                            tipo="Ingresado"
                        />
                    </>
                )}
                <h1 className="titulo">Lista de productos a ingresar</h1>
                <p className="descripcion">Productos a capturar para su devolucion a almacen.</p>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    agregarProducto(e.target[0].value);
                }}>
                    <input 
                        type="text" 
                        className="form-control descripcion" 
                        autoFocus
                        placeholder="Busca un producto por su codigo de barras..."
                    />
                </form>
                <ProductosList
                        productos={values.listaProductos}
                        tipo="Bodega"
                        cambiarCantidadProducto={cambiarCantidadProducto}
                        eliminarProducto={eliminarProducto}

                />
            </div>
            <div className="infoEntrada">
                <h1 className="titulo">Detalles de la entrada</h1>
                <p className="descripcion">Completa la entrada del almacen proveyendo informacion acerca del motivo de la entrada y su evidencia.</p>

                <h1 className="sub-titulo">Motivo</h1>
                <textarea 
                    className="form-control descripcion"
                    name="motivo"
                    onChange={handleInputChange}
                    value={values.motivo}
                    rows={4}/>
                
                <h1 className="sub-titulo">Adjunta evidencia</h1>
                <Dragger  {...propsDragger} className="bg-body dragger">
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

                <button 
                    type="primary"
                    className="btn btn-warning titulo-descripcion"
                    onClick={realizarIngresoAlmacen}
                    disabled={
                        values?.salida?.devueltoTotal ||
                        values.listaProductos.length === 0 ||
                        values.motivo.length === 0 || 
                        values.filesList.length === 0
                    }
                >
                    Ingresar <ArrowRight/>
                </button>
 
            </div>
        </div>
    );

}