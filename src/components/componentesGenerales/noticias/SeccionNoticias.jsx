
import { message, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchConToken } from "../../../helpers/fetch";
import { SanzSpinner } from "../../../helpers/spinner/SanzSpinner";
import UsuarioNewPublication from "../usuarios/UsuarioScreen/components/UsuarioNewPublication";


//Componets
import Publicacion from "./components/Publicacion";

//Estilos CSS
import "./assets/style.css";

export const SeccionNoticias = () => {

    //Obtener informacion del usuario actual
    const { uid } = useSelector(store => store.auth);
    const [userInfo, setUserInfo] = useState(null);

    //Publicaciones(Noticias)
    const [publicaciones, setPublicaciones] = useState([]);

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
    

    if(userInfo === null) return <SanzSpinner/>
    else return (
        <div className="containerPrincipalNoticias">
            <UsuarioNewPublication userInfo={userInfo}/>
            {
                publicaciones.map(publicacion => (
                    <Publicacion publicacion={publicacion} key={publicacion._id}/>
                ))
            }
        </div>
    )
};