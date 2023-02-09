import { useEffect, useState } from "react";
import { message,Modal } from "antd";

//Icon's
import { ExclamationCircleOutlined } from "@ant-design/icons";

//Helper's
import { fetchConToken, fetchConTokenSinJSON } from "../helpers/fetch";

//Custom hook's
import { useForm } from "./useForm";

const { confirm } = Modal;

export const useIngresoAlmacen = () => {

    const initialState = {
        listaProductos:[],
        tipoEntrada:"compraDirecta",//Tipo entrada por default,
        codigoSalida:"",
        salida:null,
        isLoading:false,
        motivo:"",
        filesList:[],
        entrada:""
    };

    const [ values,handleInputChange,setValues ] = useForm(initialState);

    const [phaseNumber,setPhaseNumber] = useState(1);
    const [productosDevueltos,setProductosDevueltos] = useState();

    useEffect(() => {
        if(values.salida !== null) {
            let productos = [];
            for(const entrada of values.salida.productosDevueltos){
                for(const producto of entrada.listaProductos){
                    productos.push(producto);
                }
            }
            setProductosDevueltos(productos);
        }
    },[values]);

    const propsDragger = {
        onRemove: (fileRemove) => {
            const newFiles = values.filesList.filter(
                (file) => file.name != fileRemove.name
            );

            setValues({
                ...values,
                filesList: newFiles,
            });
        },
        beforeUpload: (file) => {
            //Verificar que el fileList sea menos a 2
            if (values.filesList.length < 5) {
                setValues({
                    ...values,
                    filesList: [...values.filesList, file],
                });
            } else {
                message.error("Solo puedes subir maximo 5 archivos en total");
            }
            return false;
        },
        listType: "picture",
        showUploadList: false,
        maxCount: 5,
        // fileList: values.filesList,
    };
    
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

    const checarCantidadProducto = (productoAIngresar) => {
        //Buscar el producto en la lista de productos retirados y si este excede la cantidad retirada manderle un error
        for(const producto of values.salida.listaProductos){
            if(producto._id === productoAIngresar._id) {
                return (producto.cantidadRetirada <= (productoAIngresar.cantidadIngresada)) 
            }
        }
    }

    const isProductInListEntrada = (id) => {
        return values.listaProductos.some((producto) => producto._id === id);
    }

    const isProductInListSalida = (id) => {
        return values.salida.listaProductos.some((producto) => producto._id == id);
    }

    const agregarProducto = async(id = "") => {
        if(id.length === 0) return;

        //El producto ya esta en la lista asi que no hacemos la peticion al backend
        let body;
        if(!isProductInListEntrada(id)){
            const resp = await fetchConToken(`/productos/${id}`);
            body = await resp.json();
            if (resp.status != 200) return message.error("No existe ningun producto por ese ID!");
        }

        let bandera = false;
            

        if(values.tipoEntrada === "devolucionSalida"){
            //Checar que el producto este en la lista de productos que se retiraron
            if(!isProductInListSalida(id)) return message.error(`Producto NO esta en la lista de productos retirados anteriormente`);
        }

        const nuevaListaProductos = values.listaProductos.map((producto) => {
            if (producto._id === id) {
                bandera = true;
                if(values.tipoEntrada === "devolucionSalida")
                    checarCantidadProducto(producto) ? message.error("No puedes agregar mas producto del que salio!") : producto.cantidadIngresada += 1;
                else
                    producto.cantidadIngresada += 1;
            }
            return producto;
        });

        //El producto ya se encontraba en la lista y solo aumentamos la cantidad de este
        if (bandera) setValues({ ...values, listaProductos: nuevaListaProductos });

        //El producto NO estaba asi que lo agregamos
        if (!bandera) setValues({...values,listaProductos: [...values.listaProductos,{ ...body, id:body._id,cantidadIngresada: 1, costoXunidad: body.costo },],});

    }

    //Función para cambiar la cantida de un producto sea sumar o restar
    const cambiarCantidadProducto = (producto, cantidad) => {
        if(values.tipoEntrada === "devolucionSalida"){
            if(checarCantidadProducto(producto,cantidad)) return message.error("No puedes regresar mas de lo que se retiro!");
        }

        const nuevaListaProductos = values.listaProductos.map((item) => {
            if (item._id === producto._id) item.cantidadIngresada = cantidad;
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

    const realizarIngresoAlmacen = () => {

        confirm({
            title: "¿Seguro quieres ingresar estos productos al almacen?",
            icon: <ExclamationCircleOutlined />,
            content:
                "La cantidad de los productos sera aumentada en el sistema y NO habra forma de restablecerlo!",
            okText: "Realizar ingreso",
            cancelText: "Volver atras",
            async onOk() {
                const formData = new FormData();

                //Values
                for(const property in values){
                    if(property !== "filesList") formData.append(property,JSON.stringify(values[property]));
                }

                //FilesList
                values.filesList.forEach((file) => formData.append(file.name,file));

                //Peticion
                const endpoint = values.tipoEntrada === "devolucionSalida" ? "ingresar-almacen-por-devolucion" : "ingresar-almacen";
                const resp = await fetchConTokenSinJSON(
                    `/entradas/${endpoint}/`,
                    formData,
                    "POST"
                );

                const body = await resp.json();

                if(resp.status !== 201) return message.error(body.msg);
                
                setValues({...values,entrada:body.entrada});
                cambiarPhase(4);
            }
        });
    }

    const ingresarOtraVezAlmacen = () => {
        setValues({...initialState});
        cambiarPhase(1);
    }

    return {
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
    };
}