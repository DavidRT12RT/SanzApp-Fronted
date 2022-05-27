import React, { useEffect, useState } from 'react'
import { Button, Divider, Dropdown, Form, Input, Menu, Modal, Table, Tag } from "antd";
import { useParams } from 'react-router-dom';
import "../../assets/styleMaterialList.css";
import { DownOutlined } from '@ant-design/icons';

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

export const MaterialUtilizado = ({obraInfo,socket}) => {

    const [dataSource, setDataSource] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [deletingRow, setDeletingRow] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const { obraId } = useParams();

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    useEffect(() => {
        setDataSource(obraInfo.materialUtilizado);
        console.log(obraInfo.materialUtilizado);
    }, [obraInfo]);
    

    const onFinish = ( values ) =>{
        const updatedDataSource = [...dataSource];
        updatedDataSource.splice(editingRow, 1, { ...values, key: editingRow });
        //obraInfo.materialUtilizado = [...updatedDataSource];
        //Mandar socket
        socket.emit("material-actualizado",{obraId,updatedDataSource});
        setDataSource(updatedDataSource);
        setEditingRow(null);
    }

    const handleAdd = () => {
        const nuevaFila = {concepto:"Nueva fila...",unidad:"Nueva fila...",cantidad:1,observaciones:"Ninguna por defecto..."};
        socket.emit("material-añadir",{obraId,values:nuevaFila},(materialNuevo)=>{
            //Asignados key
            materialNuevo.map((element,index) => element.key = index);
            setDataSource(materialNuevo);
        });
    }

    const handleDelete = (deletingRow) => {
        const nuevoArrayMaterial = dataSource.filter(element => element.key != deletingRow);
        socket.emit("eliminar-material",{obraId,values:nuevoArrayMaterial},(materialNuevo)=>{
            materialNuevo.map((element,index) => element.key = index);
            setDataSource(materialNuevo);
        });
        setEditingRow(null);
    }

    const columns = [
        {
            title:"Concepto",
            dataIndex:"concepto",
            render: (text,record) => {
                if(editingRow === record.key){
                    return (
                    <Form.Item name="concepto" rules={[{required:true,message:"Tiene que tener un valor este campo!"}]}>
                        <Input/>
                    </Form.Item>
                    )
                }else{
                    return <p>{text}</p>
                }
            }
        },
        {
            title:"Unidad",
            dataIndex:"unidad",
            render: (text,record) => {
                if(editingRow === record.key){
                    return (
                    <Form.Item name="unidad" rules={[{required:true,message:"Tiene que tener un valor este campo!"}]}>
                        <Input/>
                    </Form.Item>
                    )
                }else{
                    return <p>{text}</p>
                }
            }
        },
        {
            title:"Cantidad",
            dataIndex:"cantidad",
            render: (text,record) => {
                if(editingRow === record.key){
                    return (
                    <Form.Item name="cantidad" rules={[{required:true,message:"Tiene que tener un valor este campo!"}]}>
                        <Input/>
                    </Form.Item>
                    )
                }else{
                    return <p>{text}</p>
                }
            }
        },
        {
            title:"Motivo",
            dataIndex:"motivo",
            render: (text,record) => {
                if(editingRow === record.key){
                    return (
                    <Form.Item name="motivo" rules={[{required:true,message:"Tiene que tener un valor este campo!"}]}>
                        <Input/>
                    </Form.Item>
                    )
                }else{
                    return <p>{text}</p>
                }
            }
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
        /*
        {
            title:"Acciones",
            render:(_,record) => {
                return (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                        setEditingRow(record.key);
                        form.setFieldsValue({
                            concepto: record.concepto,
                            unidad: record.unidad,
                            cantidad : record.cantidad,
                            observaciones: record.observaciones

                        });
            }}
                    >
                    Editar
                    </Button>

                    <Button danger type="link" onClick={()=>{
                        setDeletingRow(record.key);
                        handleDelete(deletingRow);
                        }}>
                        Eliminar
                    </Button>

                    <Button type="link" htmlType="submit">
                        Guardar
                    </Button>
                   
                </>
                );
            },
        },
        */
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
        <h1>Material utilizado</h1>
        <p className="lead">En esta sección se mostrara los materiales utilizados en la obra hasta el momento.</p>
        <Divider/>
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
        {
            /*
            <Button
                onClick={showModal}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                Añadir fila
            </Button>
            */
        }
            <div>
                <Form form = {form} onFinish={onFinish}>
                    <Table
                        columns = {columns}
                        dataSource = {dataSource}
                        className="fix mt-3"
                    />
                </Form>
            </div>
        <Modal title="Agregar material a la obra" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>

        </Modal>
        </>
    )
}
