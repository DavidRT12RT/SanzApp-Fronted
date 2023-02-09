//Style CSS
import "./assets/styleIngresoAlmacen.css";

// Components
import { ChooseTypeEntrada } from "./components/ChooseTypeEntrada";
import { ScamCodeSalida } from "./components/ScamCodeSalida";
import { CapturarProductos } from "./components/CapturarProductos";
import { EntradaSucessScreen } from "./components/EntradaSucessScreen";

//Helper's
import { SanzSpinner } from "../../../../helpers/spinner/SanzSpinner";

//Custom hook for logic
import { useIngresoAlmacen } from "../../../../hooks/useIngresoAlmacen";


export const IngresoAlmacen = () => {

    const {
        values,
        phaseNumber,
        propsDragger,
        productosDevueltos,
        handleInputChange,
        seleccionarTipoEntrada,
        cambiarPhase,
        grabarCodigoSalida,
        agregarProducto,
        cambiarCantidadProducto,
        eliminarProducto,
        realizarIngresoAlmacen,
        ingresarOtraVezAlmacen
    } = useIngresoAlmacen();


    if(values.isLoading) return <SanzSpinner/>
    switch(phaseNumber){
        case 1:
            return (
                <div className="IngresoAlmacenContainer">
                    <ChooseTypeEntrada
                        tipoEntrada={values.tipoEntrada}
                        seleccionarTipoEntrada={seleccionarTipoEntrada}
                        cambiarPhase={cambiarPhase}
                    />
                </div>
            );
        // Fase dos SOLO sera invocada si el tipo de entrada es por devolucion!
        case 2:
            if(values.tipoEntrada !== "devolucionSalida") return cambiarPhase(3);
            return (
                <div className="IngresoAlmacenContainer">
                    <ScamCodeSalida
                        grabarCodigoSalida={grabarCodigoSalida}
                    />
                </div>
            );
        
        case 3:
            return (
                <div className="IngresoAlmacenContainer" style={{height:"150vh"}}>
                    <CapturarProductos
                        values={values}
                        handleInputChange={handleInputChange}
                        agregarProducto={agregarProducto}
                        cambiarCantidadProducto={cambiarCantidadProducto}
                        eliminarProducto={eliminarProducto}
                        propsDragger={propsDragger}
                        realizarIngresoAlmacen={realizarIngresoAlmacen}
                        productosDevueltos={productosDevueltos}
                    />
                </div>
            );
        
        case 4:
            return (
                <EntradaSucessScreen
                    entrada = {values.entrada}
                    ingresarOtraVezAlmacen={ingresarOtraVezAlmacen}
                />
            );

    }

}

