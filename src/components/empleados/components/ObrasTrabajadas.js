import { Button, Divider, Dropdown, Input, Menu, Table } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'

export const ObrasTrabajadas = ({usuarioInfo}) => {
    const [obrasTrabajadas, setObrasTrabajadas] = useState([]);

    useEffect(() => {

        usuarioInfo.obrasTrabajadas.map((element,index) => {
            element.key = index;
        });

        setObrasTrabajadas(usuarioInfo.obrasTrabajadas);
    }, []);

    useEffect(() => {

        usuarioInfo.obrasTrabajadas.map((element,index) => {
            element.key = index;
        });

        setObrasTrabajadas(usuarioInfo.obrasTrabajadas);
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
            return setObrasTrabajadas(usuarioInfo.obrasTrabajadas);
        }

        const resultadosBusqueda = usuarioInfo.obrasTrabajadas.filter(element => {
            if(element.nombreObra.toLowerCase().includes(value.toLowerCase())){
                return element;
            }
        })

        return setObrasTrabajadas(resultadosBusqueda);
    }

    const handleSearch = (value) => {
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setObrasTrabajadas(usuarioInfo.obrasTrabajadas);
        }

        const resultadosBusqueda = usuarioInfo.obrasTrabajadas.filter(element => {
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
        <div className="mt-3">
            <h1>Obras del usuario</h1>
            <p className="lead">Aqui se encuentra las obras en las que el usuario ha trabajado o esta trabajando actualmente.
            </p>
            <Divider/>
            {/*Buscador con autocompletado*/}
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
                        Filtrar por empresa:
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>
            <Table columns={columns} dataSource={obrasTrabajadas} bordered className="mt-3"/>
        </div>
    )
}
