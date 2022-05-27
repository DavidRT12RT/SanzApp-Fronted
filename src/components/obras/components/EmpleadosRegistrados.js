import { Table } from 'antd';
import React, { useEffect, useState } from 'react'

export const EmpleadosRegistrados = ({obraInfo}) => {

    const [dataSource, setDataSource] = useState([]);

    //Obtener empleados en la obra cuando el componente se monta
    useEffect(() => {
        setDataSource(obraInfo.empleados);
    }, []);

    //Actualizar los empleados cuando la información de la obra se actualize
    useEffect(() => {
        setDataSource(obraInfo.empleados);
    }, [obraInfo]);

    const columns = [
        {
            title:"Nombre empleado",
            dataIndex:"nombre",
            key:"nombre",
            with:"33%"
        },
        {
            title:"Correo electronico",
            dataIndex:"correo",
            key:"correo",
            with:"33%"
        },
        {
            title:"Telefono",
            dataIndex:"telefono",
            key:"telefono",
            with:"33%"
        },
        {
            title:"Rol",
            dataIndex:"rol",
            key:"rol",
            with:"33%"
        },
    ];

    return (
        <>
        <p className="lead">Empleados registrados en la obra</p>
            <Table
                columns = {columns} 
                dataSource = {dataSource} 
                className="fix" 
                style={{overflowX:"auto"}} 
                bordered
            />
        </>
    )
}
