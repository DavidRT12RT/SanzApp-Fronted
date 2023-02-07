
//Style CSS
import "./assets/styleEntradaAlmacen.css";

//Custom hook's
import { useForm } from "../../../../hooks/useForm";

// Components
import { ChooseTypeEntrada } from "./components/ChooseTypeEntrada";
import { ScamCodeSalida } from "./components/ScamCodeSalida";
import { CapturarProductos } from "./components/CapturarProductos";


export const IngresoAlmacen = () => {

    const [ values,handleInputChange,setValues ] = useForm({
        phaseNumber:1,
        tipoEntrada:"compraDirecta"//Tipo entrada por default
    });

    console.log(values);
    const seleccionarTipoEntrada = (tipoEntrada = "compraDirecta") => {
        setValues({
            ...values,
            tipoEntrada,
        });
    }

    const cambiarPhase = (phaseNumber = 1) => {
        setValues({
            ...values,
            phaseNumber
        });
    }

    const grabarCodigoSalida = (codigoSalida = "") => {
        //Comprobar que la salida exista!
        setValues({
            ...values,
            codigoSalida
        });
    }


    switch(values.phaseNumber){
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
                        cambiarPhase={cambiarPhase}
                    />
                </div>
            );
        
        case 3:
            //TODO: Comprobar codigo de salida sea valido antes de mandarlo al siguiente pestana!
            return (
                <div className="IngresoAlmacenContainer">
                    <CapturarProductos
                        values={values}
                    />
                </div>
            );
    }

}

