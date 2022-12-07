import React from 'react'

import imagenHeaderObras from "./assets/imgs/d61c7d29-f247-4a6b-9771-2ce5f3c6c67a.png";
const HeaderObras = () => {
    return (
        <div className="obrasHeader">
            <div className="content">
                <h1 className="titulo text-warning">Obras</h1>
                <p className="descripcion"><b>Administra</b> las <b>obras</b> registradas en el sistema, busca por <b>empresa</b>,<br/>sucursales y aplica cualquier <b>filtro</b> que quieras!</p>
            </div>
            <img src={imagenHeaderObras}/>
        </div>
    )
}

export default HeaderObras
