import React, { useContext, useEffect, useState } from 'react'


import 'antd/dist/antd.css';
import { Button, Input, Space, Table, Tag } from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { SocketContext } from '../../context/SocketContext';

const { Search } = Input;
export const ProductosScreen = () => {

    const { socket } = useContext(SocketContext);
    const [dataSource, setValuesTable] = useState([]);


    useEffect(()=>{
        socket.on("producto-nuevo",(producto)=>{
        const {nombre,cantidad,categorias,_id:key} = producto;
        setValuesTable([...dataSource,{nombre,cantidad,categorias,key}]);});
        return () => {socket.off("producto-nuevo");}
    },[socket,dataSource,setValuesTable]);
   

    const [formValues, setFormValues] = useState("");

    const onSearch = value => setFormValues(value);

    console.log(dataSource);
  
    const columns = [
        {
            title:"Nombre producto",
            dataIndex:"nombre",
            key:"nombre",
            render: text => (<Link to={`/aplicacion/almacen/${1212}`}>{text}</Link>),
            filterDropdown:({setSelectedKeys,selectedKeys,confirm,clearFilters})=>{
                return (
                    <Input 
                    autoFocus 
                    placeholder='Filtrar por nombre...' 
                    onChange = {(e)=>{setSelectedKeys(e.target.value ? [e.target.value] : [] )}}
                    value = {selectedKeys}
                    onPressEnter = {()=> {
                        confirm()
                    }} 
                    onBlur = {()=>{
                        confirm()
                    }}>
                    </Input>
                );
            },
            filterIcon:()=>{
                return <SearchOutlined/>
            },
            onFilter:(value,record)=>{
                return record.nombre.toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            title:"Cantidad",
            dataIndex:"cantidad",
            key:"cantidad",
            render: text => (text > 0 ? <span className="text-success">{text}</span> : <span className='text-danger'>{text}</span>)
        },
        {
            title:"Categorias",
            key:"categorias",
            dataIndex:"categorias",
            render: categorias => 
            <>
                {
                    categorias.map(categoria => {
                        return (<Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag>);
                    })
                }
            </>
        }
    ];




    return (
        <div className="container mt-5 shadow p-5 rounded">
            <h1>Lista de productos en almacen</h1>
            <hr/> 
                <Search
                    placeholder="input search text"
                    allowClear
                    enterButton="Search"
                    size="large"
                    onSearch={onSearch}
                />
                <Space style={{marginTop:16}}>
                <Button>Ordenar</Button>
                <Button onClick>Limpiar filtros</Button>
                </Space>
            <div className="mt-3">
                <Table columns={columns} dataSource={dataSource}/>
            </div>
            

        </div>
    )
}