import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { SocketContext } from '../../../../context/SocketContext';
import { Link } from 'react-router-dom';

//Moment for dates
import moment from "moment";
import 'moment/locale/es';


import { Avatar, Divider, message } from 'antd';
import { ChatFill, HandThumbsUpFill, ShareFill, ThreeDots, TrashFill } from 'react-bootstrap-icons';
import { fetchConToken } from '../../../../helpers/fetch';

//Personal components
import Comentario from './Comentario';

moment.locale('es');


const Publicacion = (props) => {

    const { uid } = useSelector(store => store.auth);
    const publicacionId = props.publicacion._id;
    const inputComentary = useRef(null);
    const {socket} = useContext(SocketContext);

    const [publicacion, setPublicacion] = useState(null);
    const [tieneMiLike, setTieneMiLike] = useState(false);
    const [isOptionsVisible, setIsOptionsVisible] = useState(false);


    useEffect(() => {
        setPublicacion(props.publicacion);
    }, []);
    
    useEffect(() => {
        socket.on("actualizar-publicacion",(publicacionNueva) => {
            if(publicacionNueva._id === publicacionId) setPublicacion(publicacionNueva);
        });
    }, [socket,setPublicacion]);

    useEffect(() => {
        if(publicacion != null){
            let bandera = false
            publicacion.reacciones.forEach(reaccion => {
                if(reaccion.autor.uid == uid) bandera = true;
            });

            setTieneMiLike(bandera);
        }
    }, [publicacion]);

    

    const handleAddReaction = async() => {
        const resp = await fetchConToken(`/publicaciones/${publicacion._id}/registrarAccion/?tipo=reaccion`,{reaccion:"like"},"PUT");
        const body = await resp.json();
        if(resp.status != 200) return message.error(body.msg);

        //Peticion hecha con exito, hay que mandar a actualizar la publicacion
        socket.emit("actualizar-publicacion",{id:publicacion._id});
    }

    const handleAddComentary = async(e) => {
        e.preventDefault();
        const comentario = inputComentary.current.value;
        const resp = await fetchConToken(`/publicaciones/${publicacion._id}/registrarAccion/?tipo=comentario`,{comentario},"PUT");
        const body = await resp.json();
        if(resp.status != 200) return message.error(body.msg);

        //TODO BIEN
        inputComentary.current.value = "";

        //Peticion hecha con exito, hay que mandar a actualizar la publicacion
        socket.emit("actualizar-publicacion",{id:publicacion._id});
    }

    const handleAddShare = () => {
        return message.info("Funcion aun no creada");
    }

    const handleFocusComentary = () => {
        inputComentary.current.focus();
    }

    console.log(isOptionsVisible);


    if(publicacion === null) return;
    else return (
        <div className="publicacionContainer">

            <div className={"optionsPublicationContainer " + (isOptionsVisible ? "d-block" : "d-none")}>
                <p><TrashFill/> Eliminar publicacion</p>
                <p><TrashFill/> Eliminar publicacion</p>
            </div>

            <div className="userInformationContainer">
                <div className="content">
                    <Avatar size={40} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${publicacion.autor.uid}/fotos/?tipo=perfil`} />
                    <div className="d-flex align-items-start flex-column">
                        <Link to={`/usuarios/${publicacion.autor.uid}/`} target="_blank"><h1 className="titulo-descripcion" style={{margin:"0px"}}>{publicacion.autor.nombre}</h1></Link>
                        <p style={{margin:"0px"}}>{moment(publicacion.fecha,"LLLL").fromNow()}</p>
                    </div>
                </div>

                {
                    publicacion.autor.uid === uid &&
                        <ThreeDots onClick={() => setIsOptionsVisible((state) => !state)} className="editPublicationButton"/>
                }

            </div>
            <p className="descripcion mt-3">{publicacion.descripcion}</p>
            {
                publicacion.contieneFotos && 
                    <div className="fotosContainer">
                        {
                            publicacion.fotos.map((foto) => {
                                return <img src={`${process.env.REACT_APP_BACKEND_URL}/api/publicaciones/${publicacion._id}/fotos/${foto}`} key={foto}/>
                            })
                        }
                    </div>
            }

            <div className="accionesregistradascontainer">
                <p><span><HandThumbsUpFill/></span> {publicacion.reacciones.length} reacciones</p>
                <p><span><ChatFill/>{publicacion.comentarios.length} comentarios</span></p>
            </div>

            <Divider style={{margin:"0px"}}/>
            <div className="botonesReaccionesContainer">
                <button type="primary" onClick={handleAddReaction} className={tieneMiLike && "text-primary"}><span className="me-3"><HandThumbsUpFill/></span>Me gusta</button>
                <button type="primary" onClick={handleFocusComentary}><span className="me-3"><ChatFill/></span>Comentar</button>
                <button type="primary" onClick={handleAddShare}><span className="me-3"><ShareFill/></span>Compartir</button>
            </div>
            <Divider style={{margin:"0px"}}/>
            <form className="comentarioContainer" onSubmit={handleAddComentary}>
                <Avatar size={40} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${uid}/fotos/?tipo=perfil`} />
                <input ref={inputComentary} className="form-control descripcion" placeholder="Escribe un comentario..."></input>
            </form>
            <div className="comentariosContainer">
                {
                    publicacion.comentarios.map((comentario,index) => (
                        <Comentario comentario={comentario}/>
                    ))
                }
            </div>
        </div>
    )
}

export default Publicacion