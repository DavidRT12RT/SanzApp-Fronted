import { ArrowRight, UpcScan } from "react-bootstrap-icons";

export const ScamCodeSalida = ({
    grabarCodigoSalida,
}) => {

    return (
        <div className="ScamCodeSalida">
                <h1 className="titulo">Digita el codigo de barras de la salida</h1>
                <p className="descripcion">Escanea el codigo de barras de la salida que se encuentra en la hoja de evidencia de esta.</p>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    grabarCodigoSalida(e.target[0].value);
                }}>
                    <input 
                        type="text" 
                        className="form-control descripcion" 
                        placeholder="Codigo de salida..."
                        autoFocus
                    />
                    <button 
                        type="submit"
                        className="btn btn-warning titulo-descripcion"
                    >
                        Siguiente <ArrowRight/>
                    </button>
                </form>
        </div>
    );
}