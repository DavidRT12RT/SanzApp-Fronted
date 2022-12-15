import { Avatar, Divider, Form, Input, message, Modal } from 'antd'
import Dragger from 'antd/lib/upload/Dragger';
import React, { useState } from 'react'
import { FlagFill, Images } from 'react-bootstrap-icons';
import { InboxOutlined } from '@ant-design/icons';


const UsuarioNewPublication = ({userInfo}) => {

    const [isModalVisible, setIsModalVisible] = useState(false);

    /*
    Por alguna razon react realiza este codigo de forma no optima
    if(document.readyState === "complete"){
        const element = document.getElementById("form");
        const handleAddNewPublic = (e) => {
            e.preventDefault();
            const publicationOfUser = (e.target[0].value);
            console.log(publicationOfUser);
            return message.info("Trabajando en ello...");
        }
        if(element != null) element.addEventListener("submit",handleAddNewPublic)
    }
    */

    const handleAddNewPublic = (e) => {
        e.preventDefault();
        const textOfPublication = (e.target[0].value);
        return message.info("Trabajando en ello...");
    }

    const changeStateOfModal = () => {
        setIsModalVisible((state) => (!state));
    }
    
    const handleRegisterNewPublication = (values) => {
        console.log(values);
    }


    return (            
        <>
            <div className="newPublicUserContainer" id="form" onSubmit={handleAddNewPublic}>
                <Avatar size={40} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${userInfo.uid}/fotos/?tipo=perfil`} />
                <input className="form-control descripcion bg-light" placeholder="¿Qué estás pensando?" onClick={changeStateOfModal}/>
                <Divider style={{margin:"0px"}}/>
                <button type="primary" className="btnPublicUser descripcion" onClick={changeStateOfModal}><span className="me-2"><Images/></span>Foto</button>
                <button type="primary" className="btnPublicUser descripcion" onClick={changeStateOfModal}><span className="me-2"><FlagFill/></span>Tipo de publicacion</button>
            </div>

            <Modal visible={isModalVisible} onCancel={changeStateOfModal} onOk={changeStateOfModal} footer={null}>
                <h1 className="titulo-descripcion">Crear publicación</h1>
                <Divider/>
                <div className="d-flex justify-content-start align-items-start gap-2">
                    <Avatar size={40} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${userInfo.uid}/fotos/?tipo=perfil`} />
                    <div>
                        <h1 className="titulo-descripcion">{userInfo.nombre}</h1>
                        {userInfo.rol}
                    </div>
                </div>
                <textarea className="form-control descripcion w-100 mt-3" rows={8} placeholder="¿Qué estás pensando?"/>
                <Dragger className="mt-3">
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined className="text-warning"/>
                    </p>
                    <p className="ant-upload-text ">Click o arrastra a esta area para agregar fotos a la publicacion</p>
                </Dragger>
                <div className="row">
                    <button type="primary" className="btn btn-warning mt-3">Publicar</button>
                </div>
            </Modal>
        </>
    )
}

export default UsuarioNewPublication