import { Tag, Upload } from 'antd'
import React from 'react'
import { PencilFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import { InboxOutlined, UserOutlined } from '@ant-design/icons';
import { useRef } from 'react';


const { Dragger } = Upload;


const UsuarioHeader = ({userInfo,isEditing,setIsEditing,values,handleInputChange,handleEditInfoUser,setFilesList}) => {

    const { uid } = useSelector(store => store.auth);
    const perfilImagen = useRef(null);


    const setImagen = (e) => {
        setFilesList((parametrosAnteriores) => (
            {
                ...parametrosAnteriores,
                perfil:perfilImagen.current.files[0]
            }
        ));
    }
    
    const renderizarEtiqueta = () => {
        switch (userInfo.rol) {
            case "ADMIN_ROLE":
                return <Tag color="magenta" className="etiqueta">{userInfo.rol}</Tag>

            case "OBRAS_ROLE":
                return <Tag color="red">{userInfo.rol}</Tag>

            default:
                return <Tag color="orange">{userInfo.rol}</Tag>
        }
    }

    const handleSetEditing = () => {
        setIsEditing(state => !state);
    }

    const propsHeader = {
        onRemove : file => {
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma función*/
            setFilesList((estadoAnterior) => (
                {
                    ...estadoAnterior,
                    header:null
                }
            ));
        },
        beforeUpload: file => {
            //Verificar que el fileList sea menos a 2 
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            setFilesList((estadoAnterior) => (
                {
                    ...estadoAnterior,
                    header:file
                }
            ));
            return false;
        },
    };
 
    return (
        <section className="userHeader">

            <div className="headerUser">

                {
                    isEditing 
                    ?
                    <>
                        <Dragger {...propsHeader} className="headerUserImage">
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click o arrastra a esta area para actualizar foto de portada</p>
                        </Dragger>
                    </> 
                    : 
                    <img className="headerUserImage" src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${userInfo.uid}/fotos/?tipo=header`}/>
                }

                <div className="imagePerfilUser">
                    {
                        isEditing
                        ?
                            <>
                                <input onChange={setImagen} type="file" ref={perfilImagen} id="inputImagePerfilUser"/>
                                <label htmlFor="inputImagePerfilUser" className="imagePerfilUserEditor">
                                    <p className="text-warning" style={{fontSize:"40px",margin:"0px"}}>
                                        <UserOutlined/>
                                    </p>
                                    Click o arrastra para cambiar la foto de perfil
                                </label>
                            </>
                        :
                        <img className="imagePerfilUserImage" src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${userInfo.uid}/fotos/?tipo=perfil`}/>
                    }

                    <div className="basicInfoUser">
                        <div className="contentLeft">
                            {isEditing ? <input name="nombre" value={values.nombre} onChange={handleInputChange} className="form-control titulo"></input> : <h1 className="titulo">{userInfo.nombre}</h1>}
                            {renderizarEtiqueta()}
                            {isEditing ? <textarea name="descripcion" value={values.descripcion} onChange={handleInputChange} className="form-control descripcion mt-3" rows="3"></textarea> : <p className="descripcion descripcionUser mt-3">{(userInfo.descripcion === undefined || userInfo?.descripcion?.length == 0) ? "Aun no sabemos nada de ti pero sabemos que eres asombroso!" : userInfo.descripcion}</p>}
                        </div>
                        <div className="contentRight row">
                            {(uid === userInfo.uid) && 
                                isEditing 
                                    ? 
                                        <div className="d-flex justify-content-center gap-2 flex-wrap">
                                            <button type="primary" className="editInfoUser titulo-descripcion btn btn-danger" onClick={handleEditInfoUser}><span className="icon"><PencilFill/></span>Guardar cambios!</button>
                                            <button type="primary" className="editInfoUser titulo-descripcion btn btn-warning" onClick={handleSetEditing}>Salir sin guardar cambios</button>
                                        </div>
                                    :
                                        <button type="primary" className="editInfoUser titulo-descripcion btn btn-warning" onClick={handleSetEditing}><span className="icon"><PencilFill/></span>Editar perfil</button>
                            }
                        </div>
                   </div>
                </div>

            </div>
        </section>
    )
}


export default UsuarioHeader;