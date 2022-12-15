import { Divider } from 'antd'
import React from 'react'

const UsuarioInfo = ({userInfo,isEditing,values,handleInputChange}) => {
    return (
        <div className="userInfoContainer">
            <h1 className="titulo">Informacion</h1>
            <div className="row">
                <h1 className="titulo-descripcion col-3">Correo:</h1>
                {isEditing ? <input name="correo" value={values.correo} onChange={handleInputChange} className="form-control descripcion"></input> : <h1 className="titulo-descripcion col-9">{userInfo.correo}</h1>}
                <h1 className="titulo-descripcion col-3 mt-3">Telefono:</h1>
                {isEditing ? <input name="telefono" value={values.telefono} onChange={handleInputChange} className="form-control descripcion"></input> : <h1 className="titulo-descripcion col-9 mt-3">{userInfo.telefono}</h1>}
                <h1 className="titulo-descripcion col-6 mt-3">Obras trabajadas:</h1>
                <h1 className="titulo-descripcion col-3 mt-3">{userInfo.obrasTrabajadas.length}</h1>
            </div>

        </div>
    )
}

export default UsuarioInfo