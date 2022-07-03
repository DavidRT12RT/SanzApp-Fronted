import { useEffect, useState } from "react";
import { fetchConToken } from "../helpers/fetch";

export const useProductos = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [productos, setProductos] = useState([]);
    const [productosInfo, setProductosInfo] = useState();

    useEffect(() => {
        //Carga de productos
        fetchConToken("/productos",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setProductos(resp.productos);
                setProductosInfo(resp.total);
            });
        setIsLoading(false);
    }, []);

    return {
        isLoading,
        productos,
        productosInfo
    }
}