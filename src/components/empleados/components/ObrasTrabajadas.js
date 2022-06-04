import { Button, Divider, Dropdown, Input, Menu, Table } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'

export const ObrasTrabajadas = ({usuarioInfo}) => {
    const [obrasTrabajadas, setObrasTrabajadas] = useState([]);

    useEffect(() => {

        usuarioInfo.obrasTrabajadas.registros.map((element,index) => {
            element.key = index;
        });

        setObrasTrabajadas(usuarioInfo.obrasTrabajadas.registros);
    }, []);

    useEffect(() => {

        usuarioInfo.obrasTrabajadas.registros.map((element,index) => {
            element.key = index;
        });

        setObrasTrabajadas(usuarioInfo.obrasTrabajadas.registros);
    }, [usuarioInfo]);
    
    const columns = [            
        {
            title:"Titulo de la obra",
            key:"TituloObra",
            dataIndex:"nombreObra"
        },
        {
            title:"Rol en la obra",
            key:"rol",
            dataIndex:"rol"
        },
        {
            title:"Dirección regional",
            key:"DireccionRegional",
            dataIndex:"direccionRegionalObra"
        },
        {
            title:"Fecha de agreado",
            key:"fechaAgredado",
            dataIndex:"fechaAgregado"
        },

    ];

    const handleFilter = ({key:value}) =>{            
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value == "Limpiar"){
            return setObrasTrabajadas(usuarioInfo.obrasTrabajadas.registros);
        }

        const resultadosBusqueda = usuarioInfo.obrasTrabajadas.registros.filter(element => {
            if(element.nombreObra.toLowerCase().includes(value.toLowerCase())){
                return element;
            }
        })

        return setObrasTrabajadas(resultadosBusqueda);
    }

    const handleSearch = (value) => {
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setObrasTrabajadas(usuarioInfo.obrasTrabajadas.registros);
        }

        const resultadosBusqueda = usuarioInfo.obrasTrabajadas.registros.filter(element => {
            if(element.nombreObra.toLowerCase().includes(value.toLowerCase())){
                return element;
            }
        })

        return setObrasTrabajadas(resultadosBusqueda);
    }

    const menu = (
        <Menu onClick={handleFilter}>
            <Menu.Item key="santander">Santander</Menu.Item>
            <Menu.Item key="banbajio">Banbajio</Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="Limpiar">Limpiar filtros</Menu.Item>
        </Menu>
    );
    return (
        <div style={{height:"100%"}}>
            <h6 className="text-muted">Total de obras trabajadas</h6>
            {/*Buscador con autocompletado*/}
            <div className="d-flex align-items-center gap-2 mt-4">
                <Input.Search 
                    placeholder="Busca una factura por su descripción o concepto" 
                    enterButton
                    onSearch={handleSearch}
                    className="search-bar-class"
                />
                <Dropdown overlay={menu} className="">
                    <Button type="primary">
                        Filtrar por empresa:
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>
            <Table columns={columns} dataSource={obrasTrabajadas} bordered className="mt-3"/>
        </div>
    )
}
