import { List, Avatar, Button, Modal, Form, Input, Divider, Select, Dropdown, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { confirmation } from '../../../../alerts/botons';
import { InfoCircleOutlined,DownOutlined } from '@ant-design/icons';
const { Option } = Select;


export const TrabajosEjecutados = ({obraInfo,socket}) => {
    const [listData, setListData] = useState([]);
    //Formulario editar
    const [isModalVisible, setIsModalVisible] = useState(false);
    //Formulario registro
    const [isModalVisible2, setIsModalVisible2] = useState(false);
    const [actualRow, setActualRow] = useState(null);
    //Empleados que estan en la obra
    const [empleadosObra, setEmpleadosObra] = useState([]);

    const [form] = Form.useForm();

    const { obraId }= useParams();

    useEffect(() => {
        const data = listData.filter(element => element.key == actualRow)[0];
        form.setFieldsValue(data); 
            
        return () => {form.resetFields()}
    }, [actualRow,form]);
       

    useEffect(() => {
        socket.emit("obtener-empleados-en-obra-por-id",{obraId},(empleados)=>{
            setEmpleadosObra(empleados);
        });

        const data = obraInfo.trabajosEjecutados.map((element,index)=>{
            element.key = index;
        });

        setListData(data);

    }, []);

    //Si la información de la obra se actualizo
    useEffect(()=>{
        //Seteo los trabajos que se han ejecutado
        obraInfo.trabajosEjecutados.map((element,index) => {
            element.key = index;
        });
        setListData(obraInfo.trabajosEjecutados);

        //Seteo los empleados que estan dentro de la obra
        setEmpleadosObra(obraInfo.empleados);
    },[obraInfo]);

    

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };


    const showModal2 = () =>{
        setIsModalVisible2(true);
    }

    const handleOk2 = () =>{
        setIsModalVisible2(false);
    }

    const handleCancel2 = () =>{
        setIsModalVisible2(false);    
    }

    const onFinish = async (values) =>{
        try {
            await confirmation("Editaras la información de el trabajo realizado y no podras regresar a la información anterior"); 
            //Encontrar ID del trabajador y agregarlo al objecto que se agrara a la lista de tareas
            const {_id:empleadoId} = empleadosObra.find(element => {
                if(element.nombre === values.trabajador){
                    return element;
                }
            });
            values.empleadoId = empleadoId;
            const trabajosRealizadosUpdated = listData.map(element => {
                if(element.key == actualRow){
                    return element = values;
                }else{
                    return element
                }
            });
            handleCancel();
            socket.emit("actualizar-trabajo",{obraId,trabajosRealizadosUpdated},(nuevosTrabajos)=>{
                //Asignando key de nuevo
                nuevosTrabajos.map((element,index) => element.key = index);
                setListData(nuevosTrabajos);
            });
            form.resetFields();
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (key) =>{
        try {
            await confirmation("Se eliminara el registro del trabajo realiza y no podras recuperarlo");
            const trabajosRealizadosUpdated = listData.filter(element => element.key != key);
            //Emitir array actualizado 
            socket.emit("actualizar-trabajo",{obraId,trabajosRealizadosUpdated},(nuevosTrabajos)=>{
                //Asignando key de nuevo
                nuevosTrabajos.map((element,index) => element.key = index);
                setListData(nuevosTrabajos);
            });
        } catch (error) {
            console.log(error);
                
        }
    }

    const handleAddNewElement = async (values) =>{
        try {
            await confirmation("Agregaras un nuevo trabajo a lista"); 
            //Encontrar ID del trabajador y agregarlo al objecto que se agrara a la lista de tareas
            const {_id:empleadoId} = empleadosObra.find(element => {
                if(element.nombre=== values.trabajador){
                    return element;
                }
            });
            values.empleadoId = empleadoId;
            listData.unshift(values);
            const trabajosRealizadosUpdated = listData;
            socket.emit("actualizar-trabajo",{obraId,trabajosRealizadosUpdated},(nuevosTrabajos)=>{
                //Actualizamos la key
                nuevosTrabajos.map((element,index) => element.key = index);
                setListData(nuevosTrabajos);
            });
            setListData([...trabajosRealizadosUpdated]);
            handleOk2();
        } catch (error) {
            console.log(error);
                
        }
    }

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
        <h1>Trabajos ejecutados</h1>
        <p className="lead">En esta sección se mostrara los trabajos ejecutados dentro de la obra donde tambien se podran añadir mas trabajos </p>
        <Divider/>
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

        <Button type="primary" style={{marginBottom: 16,}} onClick={showModal2} className="mt-3"> Añadir trabajo </Button>
        <div className="bg-body p-lg-5">
            <List
                itemLayout="vertical"
                size="large"
                pagination={{
                    pageSize: 3,
                }}
                dataSource={listData}
                renderItem={item => (
                    <>
                    <List.Item
                        key={item.key}
                        actions={[
                            <Button type="primary" onClick={()=>{showModal();setActualRow(item.key)}}>Editar</Button>,
                            <Button danger type="primary" onClick={()=>{
                                handleDelete(item.key);
                            }}>Borrar trabajo</Button>,
                        ]}
                        /*
                        extra={
                            <img
                                width={272}
                                alt="logo"
                                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    />
                }
                */
            >
            <List.Item.Meta
                avatar={<Avatar src={`http://localhost:4000/api/uploads/usuarios/${item.empleadoId}`} />}
                title={item.trabajoRealizado}
                description={item.trabajador}
            />
                {item.descripcion}
            </List.Item>
                
        </>
            )}

        />
            <Modal title="Editar trabajo" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText="Salir sin ningun cambio" cancelText={false} footer={null}>
                <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>

                    <Form.Item
                        label="Nombre del empleado"
                        name="trabajador"
                        tooltip="Especifica el nombre del empleado..."
                        rules={[
                            {
                                required:true,
                                message:"Debes ingresar el nombre del empleado!"
                            }
                        ]}
                    >
                        <Select
                            placeholder="Selecciona el nombre del empleado..."
                            allowClear
                        >
                            {
                                empleadosObra.map(empleado => {
                                    return <Option value={empleado.nombre}>{empleado.nombre}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Trabajo realizado"
                        name="trabajoRealizado"
                        rules={[{ required: true, message: 'Introduce el titulo del trabajo realizado!' }]}
                        tooltip={{ title: 'Introduce el titulo del trabajo', icon: <InfoCircleOutlined /> }}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Descripcion del trabajo"
                        name="descripcion"
                        rules={[{ required: true, message: 'Introduce una descripción DETALLADA del trabajo!' }]}
                        tooltip={{ title: "Introuce una descripcion DETALLADA del trabajo", icon: <InfoCircleOutlined /> }}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Button danger type="primary" onClick={handleCancel}>Salir sin editar</Button>
                    <Button type="primary" className="mx-3" htmlType='submit'>Editar información</Button>
                </Form>
            </Modal>

            <Modal title="Añadir trabajo" visible={isModalVisible2} onOk={handleOk2} onCancel={handleCancel2} okText="Salir sin ningun cambio" cancelText={false} footer={null}>

                <Form name="basic" onFinish={handleAddNewElement} layout="vertical">
                    <Form.Item
                        label="Nombre del empleado"
                        name="trabajador"
                        tooltip="Especifica el nombre del empleado..."
                        rules={[
                            {
                                required:true,
                                message:"Debes ingresar el nombre del empleado!"
                            }
                        ]}
                    >
                        <Select
                            placeholder="Selecciona el nombre del empleado..."
                            allowClear
                        >
                            {
                                empleadosObra.map(empleado => {
                                    return <Option value={empleado.nombre} key={empleado._id}>{empleado.nombre}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Trabajo realizado"
                        name="trabajoRealizado"
                        rules={[{ required: true, message: 'Introduce el titulo del trabajo realizado!' }]}
                        tooltip={{ title: 'Introduce el titulo del trabajo', icon: <InfoCircleOutlined /> }}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Descripcion del trabajo"
                        name="descripcion"
                        rules={[{ required: true, message: 'Introduce una descripción DETALLADA del trabajo!' }]}
                        tooltip={{ title: "Introuce una descripcion DETALLADA del trabajo", icon: <InfoCircleOutlined /> }}

                    >
                        <Input.TextArea />
                    </Form.Item>
                    <div className="d-flex justify-content-start gap-2">
                        <Button danger type="primary" onClick={handleCancel2}>Salir sin editar</Button>
                        <Button type="primary" htmlType='submit'>Registrar nuevo elemento</Button>
                    </div>
                </Form>
            </Modal>
    </div>
    </>
    )
}