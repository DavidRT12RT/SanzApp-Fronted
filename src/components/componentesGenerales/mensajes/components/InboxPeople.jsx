import React from 'react'
import { useSelector } from 'react-redux'

//Component's
import { InboxPeopleItem } from './InboxPeopleItem'

export const InboxPeople = ({usuarios}) => {

    const auth = useSelector(store => store.auth);

    return (
        <div className="InboxPeople">
            <div className="p-3">
                <h1 className="titulo-descripcion mensajes-titulo">Usuarios</h1>
                <input className="form-control" placeholder="Busca un usuario"></input>
            </div>
            <div className="InboxPeopleUsersContainer">
                {
                    usuarios.map(usuario => {
                        if(usuario.uid !== auth.uid) return <InboxPeopleItem usuario={usuario} key={usuario.uid}/>
                    })
                }
            </div>
        </div>
    )
}

