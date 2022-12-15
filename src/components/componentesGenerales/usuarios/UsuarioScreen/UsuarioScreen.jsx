import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchConToken, fetchConTokenSinJSON } from '../../../../helpers/fetch';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { useForm } from '../../../../hooks/useForm';
import { SocketContext } from '../../../../context/SocketContext';

//Components
import UsuarioHeader from './components/UsuarioHeader';
import UsuarioInfo from './components/UsuarioInfo';
import UsuarioObras from './components/UsuarioObras';
import UsuarioResguardos from './components/UsuarioResguardos';
import UsuarioNewPublication from './components/UsuarioNewPublication';

import Footer from '../../Footer'

//Estilos CSS
import "./assets/style.css";

//Extra components
const { confirm } = Modal;

export const UsuarioScreen = () => {

    //Obtener informacion del usuario
    const { usuarioId } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [filesList, setFilesList] = useState({
        perfil:null,
        header:null
    });
    //Mover usuario
    const navigate = useNavigate();

    //Estado que nos dira si el usuario esta editando la informacion o NO
    const [isEditing, setIsEditing] = useState(false);

    //Formulario por si el usuario decide editar su informacion
    const [values,handleInputChange,setValues] = useForm({});

    //socket para recibir informacion del usuario si es que se actualiza
    const { socket } = useContext(SocketContext);

    /*
    useEffect(() => {
        socket.on("");
    }, [socket]);
    */
    


    useEffect(() => {
        const fetchDataUser = async() => {
            const resp = await fetchConToken(`/usuarios/${usuarioId}/`);
            const body = await resp.json();
            if(resp.status != 200) {
                navigate(-1);
                return message.error(body.msg);
            }
            //PETICION HECHA CON EXITO!!!
            setUserInfo(body);
        }

        fetchDataUser();

    }, [usuarioId]);

    useEffect(() => {
        if(userInfo != null){
            setValues({
                nombre:userInfo.nombre,
                descripcion:userInfo.descripcion || "",
                correo:userInfo.correo,
                telefono:userInfo.telefono,
            });
        }
       
    }, [userInfo]);

    const handleEditInfoUser = () => {
	    confirm({
            title:"¿Seguro quieres editar tu informacion?",
            icon:<ExclamationCircleOutlined />,
            content:"Los cambios hechos no podran ser restablecidos.",
			okText:"Editar",
			cancelText:"Volver atras",
            async onOk(){
                setIsEditing(false);
        		const formData = new FormData();
                //Form values
                for(const property in values) formData.append(property,values[property]);
                //Imagenes
                for(const property in filesList) formData.append(property,filesList[property]);

                const resp = await fetchConTokenSinJSON(`/usuarios/${userInfo.uid}/`,formData,"PUT");
                const body = await resp.json();
            
                if(resp.status != 200) return message.error(body.msg);

                //PETICION HECHA CON EXITO
                message.success(body.msg);
                setFilesList({perfil:null,header:null});
            }
        });
    }
    



    if(userInfo == null) return <SanzSpinner/>
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
                        <UsuarioNewPublication userInfo={userInfo}/> 
                    </div>
                </section>
            </div>
            <Footer/>
        </>
    )
}
