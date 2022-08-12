import React from 'react'
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { useCategorias } from '../../../../hooks/useCategorias';
import { useEntradas } from '../../../../hooks/useEntradas';
import { useProductos } from '../../../../hooks/useProductos';
import { useSalidas } from '../../../../hooks/useSalidas';

export const PanelDeControlNew = () => {
    const { isLoading:isLoadingSalidas, salidas } = useSalidas();
    const { isLoading:isLoadingEntradas,entradas } = useEntradas();
    const { isLoading:isLoadingProductos,productos,productosInfo } = useProductos();
    const { isLoading:isLoadingCategorias, categorias,categoriasInformacion } = useCategorias();

    if((isLoadingSalidas || isLoadingEntradas || isLoadingProductos || isLoadingCategorias || productosInfo === undefined) || categoriasInformacion === undefined){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-5">
                <h1 className="titulo">Panel de control</h1>
            </div>
        )
    }
}
