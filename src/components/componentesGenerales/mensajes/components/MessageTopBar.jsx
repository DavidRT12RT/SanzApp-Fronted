import { Avatar } from 'antd';
import React from 'react'
import { ArrowLeft } from 'react-bootstrap-icons';
import { types } from '../../../../types/types';

export const MessageTopBar = ({user,isMessageTopBarVisible,dispatch}) => {
    
    const handleClick = () => {
        dispatch({
            type:types.desactivarChat
        });
    }

    return (
        <div className={"MessageTopBarContainer " + (isMessageTopBarVisible ? "d-flex" : "d-none")}>
            <span className="MessageTopBarLeftIcon" onClick={handleClick}><ArrowLeft/></span>
            <div className="d-flex flex-wrap align-items-center gap-2">
                <Avatar size={40} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${user.uid}/fotos/?tipo=perfil`} />
                <h1 style={{"margin":"0px"}} className="titulo-descripcion">{user.nombre}</h1>
            </div>
       </div>
    )
}
