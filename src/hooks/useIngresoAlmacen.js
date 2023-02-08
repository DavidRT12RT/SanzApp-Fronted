import { useState } from "react";
import { message } from "antd";

//Helper's
import { fetchConToken } from "../helpers/fetch";

//Custom hook's
import { useForm } from "./useForm";

export const useIngresoAlmacen = () => {

    const [ values,handleInputChange,setValues ] = useForm({
        listaProductos:[],
        tipoEntrada:"compraDirecta",//Tipo entrada por default,
        codigoSalida:"",
        salida:null,
        isLoading:false,
        // phaseNumber:1
    });

    const [phaseNumber,setPhaseNumber] = useState(1);
    
    console.log(values);

    const seleccionarTipoEntrada = (tipoEntrada = "compraDirecta") => {
        setValues({
            ...values,
            tipoEntrada,
        });
    }

    const cambiarPhase = (phaseNumber = 1) => {
        return setPhaseNumber(phaseNumber);
    }

    const comprobarCodigoSalida = async(codigoSalida) => {

        setValues({...values,isLoading:true});
        const resp = await fetchConToken(`/salidas/${codigoSalida}`);
        const body = await resp.json();
        setValues({...values,isLoading:false});

        return (resp.status != 200) ? ({isSalidaValid:false,salida:null}) : ({isSalidaValid:true,salida:body});

    }

    const grabarCodigoSalida = async(codigoSalida = "") => {
        
        //Comprobar codigo de salida sea valido antes de mandarlo al siguiente pestana!
        const isValid = await comprobarCodigoSalida(codigoSalida);

        if(isValid.isSalidaValid){
           //La salida es valida asi que la grabamos en values
            setValues({
                ...values,
                salida:isValid.salida,
                codigoSalida
            });
            return cambiarPhase(3);
        }else{
            cambiarPhase(2);
            return message.error(`Salida con id ${values.codigoSalida} NO es valida!`);
        }
    }

    const agregarProducto = async(id = "") => {
        if(id.length === 0) return;

        const resp = await fetchConToken(`/productos/${id}`);
        const body = await resp.json();

        if (resp.status != 200) {
            return message.error("No existe ningun producto por ese ID!");
        }

        let bandera = false;
            

        if(values.tipoEntrada === "devolucionSalida"){
            //Checar que el producto este en la lista de productos que se retiraron
            const isProductInList = values.salida.listaProductos.some((producto) => producto._id == id);

            if(!isProductInList) return message.error(`Producto NO esta en la lista de productos retirados anteriormente`);
        }

        const nuevaListaProductos = values.listaProductos.map((producto) => {
            if (producto._id === body._id) {
                bandera = true;
                producto.cantidadIngresada += 1;
            }
            return producto;
        });

        //El producto ya se encontraba en la lista y solo aumentamos la cantidad de este
        if (bandera)
            setValues({ ...values, listaProductos: nuevaListaProductos });

        //El producto NO estaba asi que lo agregamos
        if (!bandera)
            setValues({
                ...values,
                listaProductos: [
                    ...values.listaProductos,
                    { ...body, id:body._id,cantidadIngresada: 1, costoXunidad: body.costo },
                ],
            });

    }

    //Función para cambiar la cantida de un producto sea sumar o restar
    const cambiarCantidadProducto = (producto, cantidad) => {
        const nuevaListaProductos = values.listaProductos.map((item) => {
            if (item._id === producto._id) item.cantidadRetirada = cantidad;
            return item;
        });
        setValues({ ...values, listaProductos: nuevaListaProductos });
    };

    //Función para eliminar un producto de la lista de productos a retirar
    const eliminarProducto = (id) => {
        const nuevaListaProductos = values.listaProductos.filter(
            (producto) => producto._id != id
        );
        setValues({ ...values, listaProductos: nuevaListaProductos });
    };

    return {
        values,
        phaseNumber,
        seleccionarTipoEntrada,
        cambiarPhase,
        grabarCodigoSalida,
        agregarProducto,
        cambiarCantidadProducto,
        eliminarProducto
    };
}