import { ArrowRight, UpcScan } from "react-bootstrap-icons";

export const ScamCodeSalida = ({
    cambiarPhase,
    grabarCodigoSalida
}) => {

    return (
        <div className="ScamCodeSalida">
                <h1 className="titulo">Digita el codigo de barras de la salida</h1>
                <p className="descripcion">Escanea el codigo de barras de la salida que se encuentra en la hoja de evidencia de esta.</p>
                <input 
                    type="text" 
                    className="form-control descripcion" 
                    placeholder="Codigo de salida..."
                    autoFocus
                    onChange={(e) => grabarCodigoSalida(e.target.value)}
                />
                <button 
                    type="primary" 
                    className="btn btn-warning titulo-descripcion"
                    onClick={() => {
                        cambiarPhase(3)
                    }}
                >
                    Siguiente <ArrowRight/>
                </button>
        </div>
    );
}