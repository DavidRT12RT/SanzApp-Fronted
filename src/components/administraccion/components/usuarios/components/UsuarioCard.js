import { Divider, Tag } from 'antd';
import React from 'react'

//Estilo del componente
import "../assets/styleUsuarioCard.css";

export const UsuarioCard = ({usuario}) => {
    return (
        <div className="usuarioCard border">
            <div className="row">
                <div className="col-12 col-lg-12 d-flex justify-content-center">
                    <img src={`http://localhost:4000/api/uploads/usuarios/${usuario.uid}`} style={{width:"130px",height:"130px",borderRadius:"75px",objectFit:"cover"}}/>
                </div>

                <div className="col-12 col-lg-12 mt-3 d-flex justify-content-center flex-column text-center">
                    <h1 className="descripcion nombreUsuario">{usuario.nombre}</h1>
                    <p className="titulo-descripcion text-muted" style={{fontSize:"15px"}}>{usuario.rol}</p>
                    <p className="titulo-descripcion text-muted" style={{fontSize:"15px"}}>{usuario.obrasTrabajadas.length} Obras trabajadas <span style={{fontSize:"11px"}}>⚫</span> {usuario.resguardos.length} Resguardos</p>
               </div>
            </div>

        </div>
    )
}
