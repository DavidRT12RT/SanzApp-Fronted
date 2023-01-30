import { message, Modal } from "antd";

//Icon's
import { ExclamationCircleOutlined } from "@ant-design/icons";

//Helper's
import { fetchConToken, fetchConTokenSinJSON } from "../helpers/fetch";

//Custom hook's
import { useForm } from "./useForm";

//Context's
import { SocketContext } from "../context/SocketContext";

const { confirm } = Modal;

export const useRetiroAlmacen = () => {
    const tiposSalidas = [
        {
            nombre: "obra",
            descripcion:
                "Salida a una obra(la obra tiene que estar registrada)",
        },
        {
            nombre: "resguardo",
            descripcion:
                "Salida a un resguardo(el empleado beneficiado tiene que estar registrado)",
        },
        {
            nombre: "merma",
            descripcion: "Salida por merma (Se tiene que adjuntar evidencia)",
        },
    ];
    const initialState = {
        tipoSalida: tiposSalidas[0],
        listaProductos: [],
        searchBar: "",
        beneficiario: null,
        filesList: [],
        doned: false,
        motivo: "",
    };

    const [values, handleInputChange, setValues] = useForm(initialState);

    console.log(values);

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

    const agregarProducto = async (e) => {
        e.preventDefault();

        if (values.searchBar.length == 0) return;

        const resp = await fetchConToken(`/productos/${values.searchBar}`);
        const body = await resp.json();

        if (resp.status != 200) {
            return message.error("No existe ningun producto por ese ID!");
        }

        if (body.estatus === false) {
            return message.error("Producto con estatus NO DISPONIBLE");
        }

        if (body.cantidad === 0) {
            return message.error("Producto sin cantidad en stock registrado!");
        }

        let bandera = false;
        const nuevaListaProductos = values.listaProductos.map((producto) => {
            if (producto._id === body._id) {
                bandera = true;
                body.cantidad - producto.cantidadRetirada === 0
                    ? message.error(
                          "No puedes agregar mas de lo que hay en bodega registrado!"
                      )
                    : (producto.cantidadRetirada += 1);
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
                    { ...body, cantidadRetirada: 1, costoXunidad: body.costo },
                ],
            });
    };

    //Función para cambiar la cantida de un producto sea sumar o restar
    const cambiarCantidadProducto = (producto, cantidad) => {
        const nuevaListaProductos = values.listaProductos.map((item) => {
            if (item._id === producto._id)
                producto.cantidad - cantidad < 0
                    ? message.error(
                          "No puedes agregar mas de lo que hay en bodega registrado!"
                      )
                    : (item.cantidadRetirada = cantidad);
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

    const cambiarTipoSalida = (tipo) => {
        setValues({ ...values, tipoSalida: tipo, beneficiario: null });
    };

    const cambiarBeneficiario = (id) => {
        setValues({ ...values, beneficiario: id });
    };

    const realizarRetiroAlmacen = () => {
        confirm({
            title: "¿Seguro quieres retirar estos productos del almacen?",
            icon: <ExclamationCircleOutlined />,
            content:
                "La cantidad sera restada de el almacen y un registro se creara y NO habra forma de borrarlo.",
            okText: "Realizar retiro",
            cancelText: "Volver atras",
            async onOk() {
                const formData = new FormData();

                //Values
                for (const property in values)
                    if (property !== "filesList")
                        formData.append(
                            property,
                            JSON.stringify(values[property])
                        );

                // Files
                values.filesList.forEach((file) =>
                    formData.append(file.name, file)
                );

                const resp = await fetchConTokenSinJSON(
                    `/salidas/retirar-productos-almacen`,
                    formData,
                    "POST"
                );
                const body = await resp.json();

                if (resp.status !== 201) return message.error(body.msg);

                setValues({ initialState, doned: true, salida: body.salida });
            },
        });
    };

    const retirarOtraVezAlmacen = () => {
        setValues(initialState);
    };

    return {
        values,
        setValues,
        handleInputChange,
        tiposSalidas,
        propsDragger,

        agregarProducto,
        cambiarCantidadProducto,
        eliminarProducto,

        cambiarTipoSalida,
        cambiarBeneficiario,
        realizarRetiroAlmacen,
        retirarOtraVezAlmacen,
    };
};
