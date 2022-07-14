import { Avatar, Button, Card, Divider, Dropdown, Input, Menu, Statistic, Table, Tag } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEmpleados } from '../../hooks/useEmpleados'
import { Loading } from './Loading';
import { DownOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { SocketContext } from '../../context/SocketContext';


export const EmpleadosScreen = () => {

    const {isLoading,empleados,empleadosEstadoInfo}  = useEmpleados();
    const { rol } = useSelector(store => store.auth);
    const [empleadosInfo, setEmpleadosInfo] = useState([]);
    const { socket } = useContext(SocketContext);

    useEffect(() => {
        empleados.map(empleado => empleado.key = empleado.uid);
        setEmpleadosInfo(empleados);        
    }, [empleados]);

    const columns = [
        {
            title:"Nombre del empleado",
            dataIndex:"nombre",
            render:(text,record)=>{
                return (
                    <>
                        <Meta
                            avatar={<Avatar src={`http://localhost:4000/api/uploads/usuarios/${record.uid}`} />}
                            title={text}
                            description={record.correo}
                        />
                    </>
                )
            }
        },
        {
            title:"Total de obras trabajadas",
            dataIndex:"obrasTrabajadas",
            render:(text,record)=>{
                return <span>{text.numeroTotal}</span>
            }
        },
        {
            title:"Estado del empleado",
            dataIndex:"estado",
            render:(text,record)=>{
                return text ? <Tag color="green">Activo</Tag> : <Tag color="red">Desactivado</Tag>
            }
        },
        {
            title:"Acciones",
            render:(text,record)=>{
                return <Button type="primary"><Link to={`/aplicacion/empleados/${record.uid}`}>Ver mas detalles del empleado</Link></Button>
            }
        }
        
    ];
    
    const menu = (
        <Menu>
            <Menu.Item key={1}>Mas obras trabajadas</Menu.Item>
            <Menu.Item key={2}>Fecha de ingreso</Menu.Item>
            <Menu.Item key={3}>Por role</Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="Limpiar">Limpiar filtros</Menu.Item>
        </Menu>
    );

    const menuReporte = (
        <Menu>
            <Menu.Item key={1}>Crear reporte de usuarios en general</Menu.Item>
            <Menu.Item key={2}>Crear reporte de empleados en obras</Menu.Item>
        </Menu>
    );

    const handleSearch = (value) => {
        if(value.length === 0) {
            return setEmpleadosInfo(empleados);
        }
        const resultadosBusqueda = empleados.filter(element => {
            if(element.nombre.toLowerCase().includes(value.toLowerCase())){
                return element;
            }
        });
        setEmpleadosInfo(resultadosBusqueda);
    }

    const handleFilter = () => {

    }

    if(isLoading){
        return <Loading/>
    }else{
        return (
            <div className="container p-5 shadow rounded">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <h1 className="display-5 fw-bold">Registro total de empleados</h1>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <Dropdown overlay={menuReporte}>
                            <Button onClick={(e)=> e.preventDefault()}>...</Button>
                        </Dropdown>
                        {(rol === "ADMIN_ROLE" || rol === "INGE_ROLE") && <Button type="primary" rounded><Link to="/aplicacion/registro">Registrar un usuario nuevo</Link></Button>}
                    </div>
                </div>
                {/*Tarjetas de información*/}
                <div className="d-flex justify-content-start flex-wrap mt-3 gap-2">
                    <Card style={{width:"300px"}}>
                        <Statistic
                            title="Numero de empleados activos"
                            value={empleadosEstadoInfo.empleadosActivos}
                            precision={0}
                            prefix="Total:"
                        />
                    </Card>
                    <Card style={{width:"300px"}}>
                        <Statistic
                            title="Numero de empleados desactivados"
                            value={empleadosEstadoInfo.empleadosDesactivados}
                            precision={0}
                            prefix="Total:"
                        />
                    </Card>
                </div>
                <Divider/>
                <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 mt-4">
                    <Input.Search 
                        size="large" 
                        style={{width:"100%"}}
                        placeholder="Busca una empleado por su nombre" 
                        enterButton
                        onSearch={handleSearch}
                        className="search-bar-class mb-3"
                    />
                </div>
                <div className="d-flex justify-content-start gap-2 flex-wrap">
                    <Dropdown overlay={menu} className="d-flex justify-content-center align-items-center">
                        <Button type="primary" size="large">Filtrar busqueda por: <DownOutlined /></Button>
                    </Dropdown>
                </div>
                <Table columns={columns} dataSource={empleadosInfo} className="mt-3" size="large"/>
                {isLoading &&<Loading/>}
            </div>
        )
    }
};
