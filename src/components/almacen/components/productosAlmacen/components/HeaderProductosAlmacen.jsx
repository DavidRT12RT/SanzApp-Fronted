import { Input } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom';
import welcomeImage from"./assets/imgs/juicy-business-coach-explains-the-material-to-the-woman.png";

export const HeaderProductosAlmacen = ({setParametrosBusqueda}) => {

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
        <section className="headerProductos">
            <div className="content">
                <h1 className="titulo text-warning">Productos almacen</h1>
                <p className="descripcion"><b>Busca</b> cualquier producto del almacen por su nombre o <b>categoria</b> y <br/>encuentra informacion sobre este como salidas,entradas,etc.</p>
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
                <Link to={`/almacen/productos/registrar`}>
                    <button className="btn btn-warning mt-3">Registrar producto</button>
                </Link>

            </div>
            <img src={welcomeImage} className="imageHeaderProductos"/>
        </section>
    )
}
