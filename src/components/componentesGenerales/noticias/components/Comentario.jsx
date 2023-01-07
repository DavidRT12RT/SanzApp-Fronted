import { Avatar } from 'antd'
//Moment for dates
import moment from "moment";
import 'moment/locale/es';

import React from 'react'
import { Link } from 'react-router-dom';

const Comentario = ({comentario}) => {
    return (
        <div className="comentario">
            <Avatar size={40} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${comentario.autor.uid}/fotos/?tipo=perfil`} />
            <div className="content">
                <Link to={`/usuarios/${comentario.autor.uid}/`} target="_blank"><h1 className="titulo-descripcion" style={{margin:"0px"}}>{comentario.autor.nombre}</h1></Link>
                {moment(comentario.fecha,"LLLL").fromNow()}
                <p className="descripcion">{comentario.comentario}</p>
            </div>
        </div>
    )
}

export default Comentario