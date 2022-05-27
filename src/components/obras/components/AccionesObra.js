import { List, Avatar, Button, Modal, Form, Input, Divider, Select, Dropdown, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InfoCircleOutlined,DownOutlined } from '@ant-design/icons';
const { Option } = Select;


export const AccionesObra = ({ obraInfo }) => {

    const [listData, setListData] = useState([]);
    const { obraId }= useParams();
    const [empleadosObra, setEmpleadosObra] = useState([]);

    useEffect(() => {

        setEmpleadosObra(obraInfo.empleados);

        const data = obraInfo.trabajosEjecutados.map((element,index)=>{
            element.key = index;
        });

        setListData(data);

    }, []);

    //Si la información de la obra se actualizo
    useEffect(()=>{
        //Seteo los trabajos que se han ejecutado
        obraInfo.trabajosEjecutados.map((element,index) => {
            element.avatar = `http://localhost:4000/api/uploads/usuarios/${element.empleadoId}`;
            element.key = index;
        });
        setListData(obraInfo.trabajosEjecutados);

        //Seteo los empleados que estan dentro de la obra
        setEmpleadosObra(obraInfo.empleados);
    },[obraInfo]);


    const handleSearch = (value) =>{
         //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setListData(obraInfo.trabajosEjecutados);
        }

        const resultadosBusqueda = obraInfo.trabajosEjecutados.filter((elemento)=>{
            if(elemento.trabajoRealizado.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setListData(resultadosBusqueda);
    }

    const handleFilter = ({key:value}) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value == "Limpiar"){
            return setListData(obraInfo.trabajosEjecutados);
        }

        const resultadosBusqueda = obraInfo.trabajosEjecutados.filter((elemento)=>{
            if(elemento.trabajador.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setListData(resultadosBusqueda);
    }

    const menu = (
        <Menu onClick={handleFilter}>
            {
                empleadosObra.map(empleado => {
                    return <Menu.Item key={empleado.nombre}>{empleado.nombre}</Menu.Item>
                })
            }
            <Menu.Divider></Menu.Divider>
            <Menu.Item key="Limpiar">Limpiar filtros</Menu.Item>
        </Menu>
    );

    return (
        <>
            <p className="lead">Trabajos ejecutados</p>
            {/*Buscador y filtrador*/}
            <div className="d-flex align-items-center gap-2">
                <Input.Search 
                    size="large" 
                    placeholder="Buscar un trabajo realizado por el titulo del trabajo..." 
                    enterButton
                    onSearch={handleSearch}
                    className="search-bar-class"
                />
                <Dropdown overlay={menu} className="">
                    <Button type="primary" size='large'>
                        Filtrar por categoria:
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>

            <div className="mt-3">
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={listData}
                    renderItem={item => 
                            <List.Item key={item.key}>
                                <List.Item.Meta
                                    avatar={<Avatar src={`http://localhost:4000/api/uploads/usuarios/${item.empleadoId}`} />}
                                    title={item.trabajoRealizado}
                                    description={item.trabajador}
                                />
                                {item.descripcion}
                            </List.Item>
                    }
                />
            </div>
        </>
    )
}

