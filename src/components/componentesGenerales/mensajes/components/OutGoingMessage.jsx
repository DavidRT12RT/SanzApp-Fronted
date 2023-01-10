import React from 'react'
import moment from "moment";

export const OutGoingMessage = ({mensaje}) => {

    const fecha = new moment(mensaje.createdAt).format("lll");
    return (
        <>
            <div className="OutGoingMessageContainer">
                <p className="descripcion">
                    {mensaje.mensaje}
                </p>
                <div className="MessageInfoContainer">
                    <p className="descripcion MessageDate">{fecha}</p>
                </div>
            </div>
        </>
    )
}
