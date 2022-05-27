import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.css';
import {Input, Space, Table, Tag } from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { SocketContext } from '../../context/SocketContext';
import { useSelector } from 'react-redux';


export const ProductosScreen = () => {


    const { Search } = Input;
    const rol = useSelector(store=> store.auth.rol);

    const categoriaColor = (categoria) => {
        switch (categoria) {
            case "ferreteria":
                return <Tag color="cyan" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "vinilos":
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "herramientas":
                return <Tag color="blue" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" key="categoria">{categoria.toUpperCase()}</Tag>
            case "fontaneria":
                return <Tag color="red" key="categoria">{categoria.toUpperCase()}</Tag>
            case "iluminacion":
                return <Tag color="yellow" key="categoria">{categoria.toUpperCase()}</Tag>
            case "materialElectrico":
                return <Tag color="gold" key="categoria">{categoria.toUpperCase()}</Tag>
            default:
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
                break;
        }
    }
    const botonEditar = () =>{
        if(rol === "ADMIN_ROLE" || rol === "ALMACEN_ENCARGADO_ROLE"){
                return (
                <div className="d-flex justify-content-end">
                        <Link className="btn btn-outline border" to="/aplicacion/almacen/registro/">Registrar un nuevo producto</Link>
                    </div>
                )
        }
    }
    const { socket } = useContext(SocketContext);
    const [dataSource, setValuesTable] = useState([]);

    //Solicitando los productos cuando el componente cargue por primera vez o cargue otra vez
    useEffect(()=>{

        socket.emit("obtener-productos-almacen",null,(productos)=>{
            setValuesTable(productos);
        });

    },[]);


    //Escuchando nuevos productos
    useEffect(()=>{

        socket.on("producto-nuevo",(producto)=>{
            const {nombre,cantidad,categorias,_id} = producto;
            setValuesTable([...dataSource,{nombre,cantidad,categorias,_id}]);
        });

        return () => {socket.off("producto-nuevo");}


    },[socket,setValuesTable,dataSource]);
  
    


    const [formValues, setFormValues] = useState("");

    const onSearch = value => setFormValues(value);

    const conseguirNombre = (text) => {
        const producto = dataSource.find(producto => producto._id === text);
        return producto.nombre;
    }
  
    const columns = [
        {
            title:"Nombre producto",
            key:"nombre",
            dataIndex:"_id",
            key:"_id",
            //render: text => <Link to={`/aplicacion/almacen/${text}`}>Ir a ver el producto!</Link>,
            render: text => <Link to={`/aplicacion/almacen/${text}`}>{conseguirNombre(text)}</Link>,

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
                        //return (<Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag>);
                        return categoriaColor(categoria);
                    })
                }
            </>
        },
    ];




    return (
        <div className="container mt-lg-4 mt-sm-2 p-5 shadow rounded">
            <h1>Lista de productos en almacen</h1>
            <hr/> 
                <Search
                    placeholder="Buscar un producto en almacen..."
                    allowClear
                    enterButton="Buscar"
                    size="large"
                    onSearch={onSearch}
                />
                <Space style={{marginTop:16}}>
                <button className="btn btn-outline border">Ordenar</button>
                <button className="btn btn-outline border">Limpiar filtros</button>
                {
                    botonEditar()
                }                
                </Space>

            <div className="mt-3">
                <Table columns={columns} dataSource={[...dataSource]} style={{maxWidth:"100vw"}}/>
            </div>
         
                          

        </div>
    )
}