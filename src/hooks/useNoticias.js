import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

//Third party import's
import { message } from "antd";

//Helpers
import { fetchConToken } from "../helpers/fetch";



//Logic for Seccion Noticias component
export const useNoticias = () => {

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

    return {
        userInfo,
        publicaciones
    };
}
