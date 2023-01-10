import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

//Component's
import { InboxPeopleItem } from './InboxPeopleItem'
import { SelectChatPhone } from './SelectChatPhone';

export const InboxPeople = ({usuarios,chatState}) => {

    const auth = useSelector(store => store.auth);

    //UseState para poder filtrar si el usuario usa el buscador
    const [InboxPeople, setInboxPeople] = useState([]);

    useEffect(() => {
        setInboxPeople(usuarios);
    }, [usuarios]);

    const handleFilterUsers = (e) => {
        if(e.target.value.length === 0) return setInboxPeople(usuarios)
        const search = e.target.value.toLowerCase();

        const newInboxPeople = InboxPeople.filter(user => user.nombre.toLowerCase().includes(search));

        setInboxPeople(newInboxPeople);
    }


    return (
        <div 
            className={"InboxPeople " + (chatState.chatActivo === null ? "enabled" : "disabled")} 
        >
            <div className="p-3">
                <h1 className="titulo-descripcion mensajes-titulo">Usuarios</h1>
                <input 
                    onChange={handleFilterUsers} 
                    className="form-control" 
                    placeholder="Busca un usuario"
                >
                </input>
            </div>
            <div className="InboxPeopleUsersContainer">
                {
                    InboxPeople.map(usuario => {
                        if(usuario.uid !== auth.uid) return <InboxPeopleItem usuario={usuario} key={usuario.uid}/>
                    })
                }
            </div>
            <hr/>
            <SelectChatPhone/>
        </div>
    )
}

