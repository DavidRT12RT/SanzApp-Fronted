//Components
import UsuarioHeader from './components/UsuarioHeader';
import UsuarioInfo from './components/UsuarioInfo';
import UsuarioObras from './components/UsuarioObras';
import UsuarioResguardos from './components/UsuarioResguardos';
import UsuarioNewPublication from './components/UsuarioNewPublication';

//Estilos CSS
import "./assets/style.css";

//Extra components
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import Footer from '../../Footer'

//Custom hook for logic
import { useUsuario } from '../../../../hooks/useUsuario';


export const UsuarioScreen = () => {

    //Custom hook para el manejo del componente
    const { userInfo,isEditing,setIsEditing, values, handleInputChange, handleEditInfoUser,setFilesList ,usuarioId,usuario } = useUsuario();

    if(userInfo === null) return <SanzSpinner/>
    else return (
        <>
            <div className="contenedorPrincipalUsuario">
               <UsuarioHeader userInfo={userInfo} isEditing={isEditing} setIsEditing={setIsEditing} values={values} handleInputChange={handleInputChange} handleEditInfoUser={handleEditInfoUser} setFilesList={setFilesList}/>
                <section className="contenedorSecundarioUsuario row">
                    <div className="col-12 col-xl-4">
                        <UsuarioInfo userInfo={userInfo} isEditing={isEditing} values={values} handleInputChange={handleInputChange}/>
                        <UsuarioObras userInfo={userInfo}/>
                        <UsuarioResguardos userInfo={userInfo}/>
                    </div>
                    <div className="col-12 col-xl-8 mt-3 mt-lg-0">
                        {
                            usuario.uid === usuarioId && <UsuarioNewPublication userInfo={userInfo}/> 
                        }
                    </div>
                </section>
            </div>
            <Footer/>
        </>
    )
}
