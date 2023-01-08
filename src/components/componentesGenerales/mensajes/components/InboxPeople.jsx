import React from 'react'


//Component's
import { InboxPeopleItem } from './InboxPeopleItem'

export const InboxPeople = ({usuarios}) => {

    return (
        <div className="InboxPeople">
            <div className="p-3">
                <h1 className="titulo-descripcion mensajes-titulo">Usuarios</h1>
                <input className="form-control" placeholder="Busca un usuario"></input>
            </div>
            <div className="InboxPeopleUsersContainer">
                {
                    usuarios.map(usuario => (
                        <InboxPeopleItem usuario={usuario} key={usuario.uid}/>
                    ))
                }
            </div>
        </div>
    )
}

