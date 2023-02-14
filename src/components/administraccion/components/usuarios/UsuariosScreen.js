import React, { useEffect, useState } from 'react'
import { Input } from 'antd';
//Helper's
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';

//Custom hook's
import { useEmpleados } from '../../../../hooks/useEmpleados';

//Style
import "./assets/styleUsuarioScreen.css";

//Component's
import { UsuarioCard } from './components/UsuarioCard';

export const UsuariosScreen = () => {

    const { isLoading,empleados } = useEmpleados();
    const [empleadosRegistros, setEmpleadosRegistros] = useState([]);

    useEffect(() => {
        empleados.map(empleado => empleado.key = empleado.uid);
        setEmpleadosRegistros(empleados);
    }, [empleados]);


    const handleFilterByName = (value="") => {
        if(value.length === 0) return setEmpleadosRegistros(empleados);

        //Buscar por nombre
        const employersFilter = empleados.filter(empleado => {
            if(empleado.nombre.toLowerCase().includes(value.toLowerCase())) return empleado;
        });

        setEmpleadosRegistros(employersFilter);
    }

    
    if(isLoading) return <SanzSpinner/>
    return (
        <div className="usuariosContainer">
            {/* Usuarios */}
            <div className="usuariosCardsContainer">
                {
                    empleadosRegistros.map(empleado => (
                        <UsuarioCard usuario={empleado}/>
                    ))
                }
            </div>
        </div>
    )
}
