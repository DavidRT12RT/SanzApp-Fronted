import { Input } from 'antd';
import React from 'react'

//Component's
import { ProductoCard } from '../../productos/components/ProductoCard';

export const ProductosCards = ({productos,setParametrosBusqueda}) => {

    const handleSearch = (e) => {
        if(e.length == 0){
            setParametrosBusqueda((parametrosAnteriores) => {
                delete parametrosAnteriores.nombre;
                return {
                    ...parametrosAnteriores
                }
            });
        }else{
            setParametrosBusqueda((parametrosAnteriores) => ({
                ...parametrosAnteriores,
                nombre:e
            }));
        }
    }

    return (
        <section className="productosContenedorPrincipal">
            <h1 className="titulo-descripcion">Productos</h1>
            <Input.Search 
                placeholder="Busca un producto por su nombre"
                allowClear
                bordered
                size="large"
                className="headerBarraBusqueda"
                enterButton
                onSearch={handleSearch}  
            >
            </Input.Search>

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
