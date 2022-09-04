import React, { useEffect, useState } from 'react'
import { Avatar, Button, Col, Divider, Drawer, Form, Input, message, Modal, Row, Select, Table } from "antd";
import { useParams } from 'react-router-dom';
import { useEmpleados } from '../../../../hooks/useEmpleados';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const { confirm } = Modal;

export const TrabajadoresLista =  ({obraInfo,socket}) => {

    const [trabajadoresObra, setTrabajadoresObra] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { isLoading:isLoadingEmpleados,empleados } = useEmpleados();
    const [form] = Form.useForm();
    const { obraId } = useParams();

    useEffect(()=>{
        obraInfo.trabajadores.map(trabajador => trabajador.key = trabajador._id);
        setTrabajadoresObra(obraInfo.trabajadores);
    },[obraInfo]);

    useEffect(() => {
        if(empleados.length > 0) empleados.map(empleado=> empleado.key = empleado.uid);
    }, [empleados]);
    


    const agregarEmpleadoObra = (values) => {
	    confirm({
            title:"¿Seguro quieres registrar este nuevo usuario en la obra?",
            icon:<ExclamationCircleOutlined />,
            content:"Una vez registrado este usuario en la obra , podras anadirle trabajos que haya realizado y este mismo tendra un registro en su perfil acerca de la obra trabajada.",
			okText:"Registrar",
			cancelText:"Volver atras",
            async onOk(){
                values.obraId = obraId;
                socket.emit("agregar-empleado-obra",values,(confirmacion)=>{
                    if(!confirmacion.ok) return message.error(confirmacion.msg);
                    message.success(confirmacion.msg);
                    return setIsModalVisible(false);
                });
            }
        });

    }
    
    const eliminarEmpleado = (id) => {
        //TODO Confirmación si lo quiere eliminar realmente
        socket.emit("eliminar-empleado-obra",{obraId,empleadoID:id},(confirmacion)=>{
            confirmacion.ok ? message.success(confirmacion.msg) : message.error(confirmacion.msg);
            //(confirmacion.ok) ? message.success(confirmacion.msg)(handleOk()) : message.error(confirmacion.msg);
        });
    }

    const columns = [
        {
            render:(text,record) => {
                return <Avatar style={{width:"60px",height:"60px"}} src={`http://localhost:4000/api/uploads/usuarios/${record.id.uid}`} />
            }
        },
        {
            title:<p className="titulo-descripcion">Nombre del empleado</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.id.nombre}</p>
            },
            key:"nombre",
        },
        {
            title:<p className="titulo-descripcion">Rol del empleado en obra</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.rol}</p>
            },
            key:"rol",
        },
        {
            title:<p className="titulo-descripcion">Acciones</p>,
            render:(text,record) => {
                return <div className="d-flex justify-content-start align-items-center gap-2">
                    <Button type="primary" danger onClick={()=>{eliminarEmpleado(record.id.uid)}}>Eliminar empleado</Button>
                </div>
            }
        }
    ];

    if(isLoadingEmpleados){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-3 p-lg-5" style={{minHeight:"100vh"}}>
                <div className="d-flex justify-content-end align-items-center gap-2">
                    <Button type="primary">Descargar resumen</Button>
                </div>
                <h1 className="titulo">Trabajadores de la obra</h1>
                <p className="descripcion">En esta seccion podras añadir o eliminar empleados que estaran participando en la obra</p>
                <Divider/>
                <Button
                    onClick={()=>{setIsModalVisible(true)}}
                    type="primary"
                    className="my-3"
                >
                    Añadir empleado
                </Button>

                <Table 
                    columns = {columns} 
                    dataSource = {trabajadoresObra} 
                    style={{overflowX:"auto"}} 
                    bordered/>

                <Modal visible={isModalVisible} onOk={()=>{setIsModalVisible(false)}} onCancel={()=>{setIsModalVisible(false)}} footer={null}>
                    <h1 className="titulo">Agregar un nuevo trabajador</h1>
                    <p className="descripcion">A continuación se mostrara un formulario con todos los campos a llenar para
                    agregar un empleado a la obra</p>
                    <Form form={form} onFinish={agregarEmpleadoObra} layout="vertical">
                        <Form.Item
                            label="Nombre del empleado que sera agregado a la obra"
                            name="id"
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
                                    empleados.map(empleado => {
                                        return <Option value={empleado.uid}>{empleado.nombre}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Rol que empañara el empleado en la obra"
                            name="rol"
                            tooltip="Especifica el rol que tendra el empleado en la obra..."
                            rules={[
                                {
                                    required:true,
                                    message:"Debes ingresar el rol del empleado en la obra!"
                                }
                            ]}
                        >
                            <Select
                                placeholder="Rol del empleado..."
                                allowClear
                            >
                                <Option value="encargado-rol">Encarga de obra</Option>
                                <Option value="maestro-obra-rol">Maestro de obra</Option>
                                <Option value="albañil-rol">Albañil</Option>
                                <Option value="jefe-piso-rol">Jefe de piso</Option>
                            </Select>
                        </Form.Item>
                        <div className="d-flex justify-content-start gap-2">
                            <Button type="primary" htmlType="submit">Registrar empleado en la obra!</Button>
                            <Button className="mx-2" htmlType='button' onClick={()=>{form.resetFields()}}>Borrar información</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}
