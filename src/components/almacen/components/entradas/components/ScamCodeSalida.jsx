import { ArrowRight } from "react-bootstrap-icons";

export const ScamCodeSalida = ({
    cambiarPhase,
    grabarCodigoSalida
}) => {

    return (
        <div className="ScamCodeSalida">
            <h1 className="titulo">Escanea el codigo de la salida.</h1>
            <input 
                autoFocus 
                className="form-control descripcion"
                placeholder="Codigo salida..."
            />
            <button type="primary" className="btn btn-warning">Seleccionar <ArrowRight/></button>
        </div>
    );
}