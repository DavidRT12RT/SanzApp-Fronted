import { Avatar, Card, Tag } from 'antd'
import React from 'react'
const { Meta } = Card;


export const InformacionUsuario = ({usuarioInfo}) => {
    console.log(usuarioInfo);
    return (
        <>
            <div>
                <h6 className="text-muted">Información de contacto</h6>
                <div className="row mt-4">
                    <h6 className="fw-bold col-6">Numero de telefono:</h6>
                    <p className="text-primary col-6">{usuarioInfo.telefono}</p>
                    <h6 className="fw-bold col-6">Correo electronico:</h6>
                    <p className="text-bold col-6">{usuarioInfo.correo}</p>
                </div>
                <h6 className="text-muted mt-4">Información basica</h6>
                <div className="row mt-4">
                    <h6 className="fw-bold col-6">Fecha de registro en el sistema:</h6>
                    <p className="text-bold col-6">{usuarioInfo.fechaRegistro}</p>
                    <h6 className="fw-bold col-6">Numero de seguro social:</h6>
                    <p className="text-bold col-6">{usuarioInfo.NSS}</p>
                    <h6 className="fw-bold col-6">RFC:</h6>
                    <p className="text-bold col-6">{usuarioInfo.RFC}</p>
                    <h6 className="fw-bold col-6">Estado del usuario:</h6>
                    {usuarioInfo.estado ? <p className="col-6"><Tag color="green">Activo</Tag></p> : <p className="col-6"><Tag color="red">Desactivado</Tag></p>}
                </div>
            </div>
        </>
    )
}
