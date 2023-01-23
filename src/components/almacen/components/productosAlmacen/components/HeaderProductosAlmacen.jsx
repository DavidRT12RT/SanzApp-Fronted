import React from 'react'

import { Link } from 'react-router-dom';

//Image
import welcomeImage from"./assets/imgs/juicy-business-coach-explains-the-material-to-the-woman.png";

export const HeaderProductosAlmacen = () => {

    return (
        <section className="headerProductos">
            <div className="content">
                <h1 className="titulo text-warning">Productos almacen</h1>
                <p className="descripcion"><b>Busca</b> cualquier producto del almacen por su nombre o <b>categoria</b> y <br/>encuentra informacion sobre este como salidas,entradas,etc.</p>

                <div className="mt-3">
                    <Link to={`/almacen/productos/registrar`}>
                        <button className="btn btn-warning">Registrar producto</button>
                    </Link>
                    <button className="btn btn-primary ms-2">Crear reporte</button>
                </div>
            </div>
            <img src={welcomeImage} className="imageHeaderProductos"/>
        </section>
    )
}
