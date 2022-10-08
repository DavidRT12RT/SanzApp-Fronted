import { Button, Checkbox, Divider, Input } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { useEmpleados } from '../../../../hooks/useEmpleados';

//Estilos propipos del componente
import "./assets/styleUsuariosPanel.css";
import { UsuarioCard } from './components/UsuarioCard';

export const UsuariosPanel = () => {

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
        <>
            <div className="bg-body p-3" style={{minHeight:"100vh"}}>
                <div className="container text-center mt-3">
                    <div className="d-flex justify-content-end">
                        <Link to={`/administracion/usuarios/registrar/`}><Button type="primary">Registrar usuario</Button></Link>
                    </div>
                    <h1 className="titulo mt-3 mt-lg-0">Usuarios registrados</h1>
                    <p className="descripcion">Registros de <b>TODOS</b> los usuarios en el sistema, en este apartado 
                    podras ver y conocer mas informacion sobre cada usuario, asi como las obras trabajadas, los resguardos del empleado
                    y muchas cosas mas.
                    </p>
                        <Input.Search placeholder="Buscar empleado por su nombre" className="descripcion col-8" enterButton onChange={(e) => handleFilterByName(e.target.value)} size="large"/>
                        <Button type="primary" className="mt-3 col-3" size="large">Filtrar usuarios</Button>
                        <Divider/>
                        {/* Tarjetas de usuarios*/}
                        <div className="d-flex justify-content-center gap-5 flex-wrap">
                            {
                                empleadosRegistros.map(empleado => (
                                    <UsuarioCard usuario={empleado} key={empleado.key}/>
                                ))
                            }
                        </div>
                    </div>
                </div>
        </>
    )
}
