import React from 'react'

//Moment for dates
import moment from "moment";
import 'moment/locale/es';
import { Avatar, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { ChatFill, HandThumbsUpFill, ShareFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
moment.locale('es');

//Solucion!
const fecha = "jueves, 15 de diciembre de 2022 22:39";
console.log("Diferencia: ",moment(fecha,"LLLL").fromNow());


const Publicacion = ({publicacion}) => {
    const { uid } = useSelector(store => store.auth);
    return (
        <div className="publicacionContainer">
            <div className="d-flex justify-content-start align-items-center gap-2">
                <Avatar size={40} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${publicacion.autor.uid}/fotos/?tipo=perfil`} />
                <div>
                    <Link to={`/usuarios/${publicacion.autor.uid}/`} target="_blank"><h1 className="titulo-descripcion" style={{margin:"0px"}}>{publicacion.autor.nombre}</h1></Link>
                    {moment(publicacion.fecha,"LLLL").fromNow()}
                </div>
            </div>
            <p className="descripcion mt-3">{publicacion.descripcion}</p>
            {
                publicacion.contieneFotos && 
                    <div className="fotosContainer">
                        {
                            publicacion.fotos.map(foto => (
                                <img src={`${process.env.REACT_APP_BACKEND_URL}/api/publicaciones/${publicacion._id}/fotos/${foto}`}/>
                            ))
                        }
                    </div>
            }
            <Divider style={{margin:"0px"}}/>
            <div className="reaccionesContainer">
                <button type="primary"><span className="me-3"><HandThumbsUpFill/></span>Me gusta</button>
                <button type="primary"><span className="me-3"><ChatFill/></span>Comentar</button>
                <button type="primary"><span className="me-3"><ShareFill/></span>Compartir</button>
            </div>
            <Divider style={{margin:"0px"}}/>
            <div className="comentariosContainer">

            </div>
            <div className="comentarioContainer">
                <Avatar size={40} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${uid}/fotos/?tipo=perfil`} />
                <input className="form-control descripcion" placeholder="Escribe un comentario..."></input>
            </div>
        </div>
    )
}

export default Publicacion