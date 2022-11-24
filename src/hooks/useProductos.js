import { useEffect, useState } from "react";
import { fetchConToken } from "../helpers/fetch";

export const useProductos = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [productos, setProductos] = useState([]);
    const [productosInfo, setProductosInfo] = useState(undefined);

    useEffect(() => {
        //Carga de productos
        fetchConToken("/productos",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setProductos(resp.productos);
                setProductosInfo({total:resp.total});
            });
        setIsLoading(false);
    }, []);

    return {
        isLoading,
        productos,
        productosInfo,
        setProductos
    }
}