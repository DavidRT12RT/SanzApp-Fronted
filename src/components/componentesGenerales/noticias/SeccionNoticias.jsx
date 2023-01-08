
//Componets
import UsuarioNewPublication from "../usuarios/UsuarioScreen/components/UsuarioNewPublication";
import Publicacion from "./components/Publicacion";

//Custom hook for logic of component
import { useNoticias } from "../../../hooks/useNoticias";

//Extra component's
import { SanzSpinner } from "../../../helpers/spinner/SanzSpinner";

//Estilos CSS
import "./assets/style.css";

export const SeccionNoticias = () => {

    const { userInfo,publicaciones } = useNoticias();

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