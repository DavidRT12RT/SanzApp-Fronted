import React from 'react'
import { SanzSpinner } from '../../../../../helpers/spinner/SanzSpinner';
import { useProductos } from '../../../../../hooks/useProductos'
import { ProductoCard } from '../../productos/components/ProductoCard';

export const ProductosCards = ({productos}) => {

    return (
        <section className="productosContenedorPrincipal">
            <h1 className="titulo-descripcion">Productos</h1>

            <div className="productosContainer">
                {
                    productos.length > 0 ?
                    productos.map(producto => {
                        return <ProductoCard producto={producto} key={producto._id}/>
                    })
                    :
                    <p className="titulo-descripcion text-danger">Ningun producto registrado en el sistema aun...</p>
                }
            </div>
       </section>
    )
}
