import { ArrowRight } from "react-bootstrap-icons";

export const ChooseTypeEntrada = ({
    tipoEntrada,
    seleccionarTipoEntrada,
    cambiarPhase
}) => {
    return (
        <section className="chooseTypeEntrada">

            <h1 className="titulo">Elige el tipo de entrada.</h1>
            <div className="boxes">
                <div 
                    className={"tipoEntrada compraDirectaBox " + (tipoEntrada === "compraDirecta" ? "selected" : "")}
                    onClick={() => seleccionarTipoEntrada("compraDirecta")}
                >
                    <div className="blur"/>
                    <h1 className="sub-titulo">Entrada compra directa</h1>
                    <p className="descripcion">Ingresa al almacen un o unos productos de forma directa.</p>
                </div>            

                <div 
                    className={"tipoEntrada devolucionSalidaBox " + (tipoEntrada === "devolucionSalida" ? "selected" : "")}
                    onClick={() => seleccionarTipoEntrada("devolucionSalida")}
                >
                    <div className="blur"/>
                    <h1 className="sub-titulo">Entrada devolucion de salida</h1>
                    <p className="descripcion">Ingresa al almacen un o unos productos por devolucion de una salida.</p>
                </div>
            </div>

            <button 
                type="primary" 
                className="btn btn-warning titulo-descripcion"
                disabled={tipoEntrada === null}
                onClick={() => {cambiarPhase(2)}}
            >
                Seleccionar <ArrowRight/>
            </button>
        </section>
    );
}