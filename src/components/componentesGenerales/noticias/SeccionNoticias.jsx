import { message } from "antd";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../context/SocketContext";

//Helpers
import { fetchConToken } from "../../../helpers/fetch";
import { SanzSpinner } from "../../../helpers/spinner/SanzSpinner";

//Componets
import UsuarioNewPublication from "../usuarios/UsuarioScreen/components/UsuarioNewPublication";
import Publicacion from "./components/Publicacion";

//Estilos CSS
import "./assets/style.css";

export const SeccionNoticias = () => {

    //Obtener informacion del usuario actual
    const { uid } = useSelector(store => store.auth);
    const [userInfo, setUserInfo] = useState(null);

    //Publicaciones(Noticias)
    const [publicaciones, setPublicaciones] = useState([]);

    //const {socket} = useContext(SocketContext);

    //UseEffect for user data
    useEffect(() => {
        const fetchUserData = async() => {
            const resp = await fetchConToken(`/usuarios/${uid}`);
            const body = await resp.json();

            if(resp.status != 200) return message.error("Informacion del usuario no se ha podido encontrar!");

            //PETICION HECHA CON EXITO!
            setUserInfo(body);
        }

        fetchUserData();
    }, [uid]);

    //Usereffect for all publications 
    useEffect(() => {
        const fetchPublicationData = async() => {
            const resp = await fetchConToken(`/publicaciones`);
            const body = await resp.json();

            if(resp.status != 200) return message.error(body.msg);

            //PETICION HECHA CON EXITO!

            setPublicaciones(body.publicaciones);
        }
        fetchPublicationData();
    },[]);

    if(userInfo === null) return <SanzSpinner/>
    else return (
        <div className="containerPrincipalNoticias">
            <div className="newPublicationContainer">
                <UsuarioNewPublication userInfo={userInfo}/>
            </div>
            <div className="publicacionesContainer">
                {
                    publicaciones.map(publicacion => (
                        <Publicacion publicacion={publicacion} key={publicacion._id}/>
                    ))
                }
            </div>
        </div>
    )
};