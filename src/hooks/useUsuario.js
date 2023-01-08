import React, { useContext, useEffect, useState } from 'react'

//Thirds party import's
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

//Context's
import { SocketContext } from '../context/SocketContext';

//Custom hooks
import { useForm } from './useForm';

//Helpers
import { fetchConToken, fetchConTokenSinJSON } from '../helpers/fetch';

const { confirm } = Modal;


export const useUsuario = () => {
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

    //Obtener el uid del usuario actual que esta viendo el perfil (Puede o no ser el usuario)
    const usuario = useSelector(store => store.auth);

    useEffect(() => {
        socket?.on("usuario-actualizado",(usuario) => {
            if(usuario.uid === userInfo.uid) setUserInfo(usuario);
        });
    }, [socket]);
    
    useEffect(() => {

        const fetchDataUser = async() => {                
            //Mandar a llamar informacion del usuario
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

    return {
        userInfo,
        isEditing,
        setIsEditing, 
        values, 
        handleInputChange, 
        handleEditInfoUser,
        setFilesList ,
        usuarioId,
        usuario
    };
    
}