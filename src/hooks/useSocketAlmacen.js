import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

export const useSocketAlmacen = (productoId = "") => {

    const [informacionProducto, setInformacionProducto] = useState({});
    const {socket} = useContext(SocketContext);

    //Solicitando los productos cuando el componente cargue por primera vez o cargue otra vez
    useEffect(()=>{
        socket.emit("obtener-producto-por-id",{productoId},(producto)=>{
            setInformacionProducto(producto);
        });
    },[]);

    return {
        informacionProducto
    };
}