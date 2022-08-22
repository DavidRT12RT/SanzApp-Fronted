import { List, Avatar, Button, Modal, Form, Input, Divider, Select, Dropdown, Menu, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { confirmation } from '../../../../alerts/botons';
import { InfoCircleOutlined,DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;


export const TrabajosEjecutados = ({obraInfo,socket}) => {
    const [listaTrabajos, setListaTrabajos] = useState([]);
    //Formulario editar y registro de un trabajo 
    const [isModalVisible, setIsModalVisible] = useState({estado:false,tipo:null,trabajo:null});
    const [empleadosObra, setEmpleadosObra] = useState([]);
    const [form] = Form.useForm();
    const { obraId }= useParams();

    useEffect(() => {
        socket.emit("obtener-trabajadores-en-obra-por-id",{obraId},(empleados)=>{
            empleados.map(empleado => empleado.key = empleado.id.uid);
            setEmpleadosObra(empleados);
        });

        obraInfo.trabajosEjecutados.map(trabajo => trabajo.key = trabajo._id)
        setListaTrabajos(obraInfo.trabajosEjecutados);

    }, [obraInfo]);


    useEffect(() => {
        if(isModalVisible.tipo === "editar") return form.setFieldsValue({titulo:isModalVisible.trabajo.titulo,descripcion:isModalVisible.trabajo.descripcion,trabajador:isModalVisible.trabajo.trabajador.uid});
    }, [isModalVisible]);
    
    const agregarTrabajo = async (values) =>{
        confirm({
            title:"Seguro quieres agregar este registro de trabajo u accion a la obra",
            icon:<ExclamationCircleOutlined />,
            content:"La accion sera registrada dentro de la obra y se asociara al trabajador que la realizo",
			okText:"Registrar",
			cancelText:"Volver atras",
            async onOk(){
                values.obraId = obraId;
                socket.emit("añadir-trabajo-a-obra",values,(confirmacion) => {
                    if(!confirmacion.ok) return message.error(confirmacion.msg);
                    //Trabajo anadido con exito!
                    message.success(confirmacion.msg);
                    setIsModalVisible({estado:false,tipo:null});
                });
            }
        })
    }

    const editarTrabajo = async (values) =>{
        values._id = isModalVisible.trabajo._id; //Asignando el id del trabajo para poder remplazarlo en la base de datos
        confirm({
            title:"Seguro quieres editar el trabajo registrado en la obra?",
            icon:<ExclamationCircleOutlined />,
            content:"El trabajo realizado sera editado",
			okText:"Editar",
			cancelText:"Volver atras",
            async onOk(){
                values.obraId = obraId;
                socket.emit("editar-trabajo-en-obra",values,(confirmacion) => {
                    if(!confirmacion.ok) return message.error(confirmacion.msg);
                    message.success(confirmacion.msg);
                    setIsModalVisible({estado:false,tipo:null});
                });
            }
        })
    }

    const eliminarTrabajo = (values) => {
        confirm({
            title:"Seguro quieres ELIMINAR el trabajo registrado en la obra?",
            icon:<ExclamationCircleOutlined />,
            content:"El trabajo realizado sera eliminado de los registros de la obra",
			okText:"Eliminar",
			cancelText:"Volver atras",
            async onOk(){
                values.obraId = obraId;
                socket.emit("eliminar-trabajo-en-obra",values,(confirmacion) => {
                    if(!confirmacion.ok) return message.error(confirmacion.msg);
                    message.success(confirmacion.msg);
                });
            }
        })
    }

    const handleSearch = (value) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setListaTrabajos(obraInfo.trabajosEjecutados);
        }

        const resultadosBusqueda = obraInfo.trabajosEjecutados.filter((elemento)=>{
            if(elemento.trabajoRealizado.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setListaTrabajos(resultadosBusqueda);
    }

    const handleFilter = ({key:value}) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value == "Limpiar"){
            return setListaTrabajos(obraInfo.trabajosEjecutados);
        }

        const resultadosBusqueda = obraInfo.trabajosEjecutados.filter((elemento)=>{
            if(elemento.trabajador.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setListaTrabajos(resultadosBusqueda);

    }

    const menu = (
        <Menu onClick={handleFilter}>
            {
                empleadosObra.map(empleado => {
                    return <Menu.Item key={empleado.id.uid}>{empleado.id.nombre}</Menu.Item>
                })
            }
            <Menu.Divider></Menu.Divider>
            <Menu.Item key="Limpiar">Limpiar filtros</Menu.Item>
        </Menu>
    );

    return (
        <div className="container p-3 p-lg-5" style={{minHeight:"100vh"}}>
            <h1 className="titulo">Trabajos ejecutados</h1>
            <p className="descripcion">Seccion para anadir trabajos o tareas que hayan cumplido los trabajadores de la obra y asi poder tener un historial de acciones en esta misma.</p>
            <Divider/>
            <div className="d-flex align-items-center gap-2 flex-wrap">
                <Input.Search 
                    size="large" 
                    placeholder="Buscar un trabajo realizado por el titulo del trabajo..." 
                    style={{width:"80%"}}
                    onSearch={handleSearch}
                />
                <Dropdown overlay={menu} className="">
                    <Button type="primary" size="large">
                        Filtrar por categoria:
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>
            <Button type="primary" style={{marginBottom: 16,}} onClick={()=>{setIsModalVisible({estado:true,tipo:"registrar"})}} className="mt-3"> Añadir trabajo </Button>
            <List
                itemLayout="vertical"
                size="large"
                pagination={{pageSize: 3,}}
                grid={{
                    gutter: 16,
                    column:1
                }}
                dataSource={listaTrabajos}
                renderItem={item =>(
                    <>
                    <List.Item
                        key={item.key}
                        className="p-5 border"
                        actions={[
                            <Button type="primary" onClick={() => {setIsModalVisible({estado:true,tipo:"editar",trabajo:item})}}>Editar</Button>,
                            <Button danger type="primary" onClick={() => {eliminarTrabajo(item)}}>Borrar trabajo</Button>,
                        ]}
                    >
                        <List.Item.Meta
                            avatar={<img src={`http://localhost:4000/api/uploads/usuarios/${item.trabajador.uid}`} width="60px" height="60px" style={{objectFit:"cover",borderRadius:"40px"}}/>}
                            title={<p className="titulo-descripcion">{item.titulo}</p>}
                            description={<p className="titulo-descripcion"><mark style={{backgroundColor:"#FFFF00"}}>{item.trabajador.nombre}</mark></p>}
                        />
                            {<p className="descripcion">{item.descripcion}</p>}
                        </List.Item>
                    </>
                )}
            />

            <Modal footer={null} visible={(isModalVisible.estado)} onOk={()=>{setIsModalVisible({estado:false,tipo:null})}} onCancel={()=>{setIsModalVisible({estado:false,tipo:null})}}>
                {isModalVisible.tipo === "registrar" ? <h1 className="titulo">Registrar un trabajo</h1> : <h1 className="titulo">Editar trabajo</h1>}
                <Form form={form} layout="vertical" onFinish={(e)=> {isModalVisible.tipo === "registrar" ? agregarTrabajo(e) : editarTrabajo(e)}}>
                    <Form.Item label="Titulo del trabajo realizado" name="titulo" rules={[{ required: true, message: 'Introduce el titulo del trabajo realizado!' }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Titulo del trabajo realizado" name="descripcion" rules={[{ required: true, message: 'Introduce la descripcion del trabajo realizado!' }]}>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item label="Usuario que realizo el trabajo" name="trabajador" rules={[{ required: true, message: 'Introduce el trabajo que realizo el trabajo!' }]}>
                        <Select>
                            {empleadosObra.map(empleado => {
                                return <Select.Option key={empleado.id.uid} value={empleado.id.uid}>{empleado.id.nombre}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">{isModalVisible.tipo === "registrar" ? "Registrar trabajo" : "Editar trabajo"}</Button>
                </Form>
            </Modal>
        </div>
    )
}