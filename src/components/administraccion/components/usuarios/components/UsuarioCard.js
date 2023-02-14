import { Divider, Tag } from 'antd';
import React from 'react'

//Estilo del componente
import "../assets/styleUsuarioCard.css";

export const UsuarioCard = ({usuario}) => {
    const renderizarEtiqueta = () => {
        const rol = usuario.rol;
        switch (usuario.rol) {
            case "ADMIN_ROLE":
                return <Tag color="magenta" className="etiqueta descripcion mt-2">{rol}</Tag>

            case "OBRAS_ROLE":
                return <Tag className="descripcion mt-2" color="red">{rol}</Tag>

            default:
                return <Tag  className="descripcion mt-2" color="orange">{rol}</Tag>
        }
    }
    return (
        <div className="usuarioCard">
            <div className="usuarioImageContainer">
                {/* <img src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${usuario.uid}/fotos/?tipo=perfil`}/> */}
                <img src="http://54.91.5.96:4000/api/usuarios/62644b227e05a9af84b6ba64/fotos/?tipo=perfil"/>
            </div>
            <div>
                <h1 className="titulo-descripcion">{usuario.nombre.toUpperCase()}</h1>
                <p className="descripcion">{usuario?.descripcion?.slice(0,80)+"..." || "Usuario sin descripcion registrada aun..."}</p>
                {renderizarEtiqueta()}
                <Divider/>
            </div>
        </div>
    )
}
