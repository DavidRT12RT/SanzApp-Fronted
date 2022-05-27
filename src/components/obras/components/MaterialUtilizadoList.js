import React, { useEffect, useState } from 'react'
import {Button, Dropdown, Input , Menu, Table, Tag } from 'antd';
import { SearchOutlined,DownOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';

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

export const MaterialUtilizadoList = ({obraInfo}) => {

    const [dataSource, setDataSource] = useState([]);

    useEffect(() => {
        obraInfo.materialUtilizado.map(element => {element.key = element._id;});
        setDataSource(obraInfo.materialUtilizado); 
    }, [obraInfo]);

    useEffect(() => {
        obraInfo.materialUtilizado.map(element => {element.key = element._id;});
        setDataSource(obraInfo?.materialUtilizado);
    }, []);
    
    const columns = [
        {
            title:"Concepto",
            key:"concepto",
            dataIndex:"concepto",
            filterDropdown:({setSelectedKeys,selectedKeys,confirm,clearFilters})=>{
                return (
                    <Input 
                    autoFocus 
                    placeholder='Filtrar por concepto...' 
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
                return record.concepto.toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            title:"Unidad",
            dataIndex:"unidad",
            key:"unidad"
        },
        {
            title:"Cantidad",
            dataIndex:"cantidad",
            key:"cantidad",
        },
        {
            title:"Motivo",
            key:"motivo",
            dataIndex:"motivo",
        },
        {
            title:"Categorias",
            key:"categorias",
            dataIndex:"categorias",
            responsive:["sm"],
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


    const handleSearch = (value) => {
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setDataSource(obraInfo.materialUtilizado);
        }

        const resultadosBusqueda = obraInfo.materialUtilizado.filter((elemento)=>{
            if(elemento.concepto.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setDataSource(resultadosBusqueda);
    }

    const handleFilter = ({key:value}) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value == "Limpiar"){
            return setDataSource(obraInfo.materialUtilizado);
        }

        const resultadosBusqueda = obraInfo.materialUtilizado.filter((elemento)=>{
            if(elemento.categorias.includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setDataSource(resultadosBusqueda);
    }

    const menu = (
        <Menu onClick={handleFilter}>
            <Menu.Item key="ferreteria">Ferreteria</Menu.Item>
            <Menu.Item key="electrico">Electrico</Menu.Item>
            <Menu.Item key="herramientas">Herramientas</Menu.Item>
            <Menu.Item key="vinilos">Vinilos</Menu.Item>
            <Menu.Item key="pisosAzulejos">Pisos y Azulejos</Menu.Item>
            <Menu.Item key="fontaneria">Fontaneria</Menu.Item>
            <Menu.Item key="iluminacion">Iluminación</Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="Limpiar">Limpiar filtros</Menu.Item>
        </Menu>
    );

    return (
      <>

            <p className='lead'>Material utilizado</p>
            <div className="mt-3">
            {/*Buscador y filtrador*/}
            <div className="d-flex align-items-center gap-2">
            <Input.Search 
                size="large" 
                placeholder="Busca una factura por su descripción o concepto" 
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
                <Table columns={columns} dataSource={[...dataSource]} pagination={{pageSize:"50"}} scroll={{y:240}} className="mt-3"/>
            </div>

  </>
  )
}