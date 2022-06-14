import React, { useEffect, useState } from 'react'
import { Avatar, Button, Col, Divider, Drawer, Form, Input, message, Modal, Row, Select, Table } from "antd";
import { useParams } from 'react-router-dom';
import "../../assets/styleMaterialList.css";
import "../../assets/styleTrabajadoresLista.css";

const { Option } = Select;

export const TrabajadoresLista =  ({obraInfo,socket}) => {

    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const [form] = Form.useForm();
    const { obraId } = useParams();
    //Drawer
    const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
    const [empleadoId, setEmpleadoId] = useState(null);
    const [informacionEmpleado, setInformacionEmpleado] = useState();

    //Estar al tanto por si la información de la obra cambia
    useEffect(()=>{
        obraInfo.empleados.map(empleado=>empleado.key = empleado._id);
        setDataSource(obraInfo.empleados);
    },[obraInfo]);

    //Cada vez que cambie el el empleadoId buscaremos información sobre el empleado y la setearemos en otro estado
    useEffect(() => {
        socket.emit("obtener-usuario-por-id",{usuarioId:empleadoId},(usuario)=>{
            setInformacionEmpleado(usuario);
        });
    }, [empleadoId,setInformacionEmpleado]);

    //Obtener todos los empleados que YA esten trabajando en la obra con su rol
    useEffect(() => {
        socket.emit("obtener-empleados-en-obra-por-id",{obraId},(empleados)=>{
            empleados.map(empleado=>empleado.key = empleado._id);
            setDataSource(empleados);
        });

        socket.emit("obtener-empleados-activos",{},(empleados)=>{ 
            empleados.map(element => element.key = element.uid);
            setEmpleados(empleados);
        }); 
    }, []);

    const showModal = () =>{
        setIsModalVisible(true);
    }

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onReset = () =>{
       form.resetFields();
    }
    
    const handleAddNewEmployer = (values) => {
        values.obraId = obraId;
        socket.emit("agregar-empleado-obra",values,(confirmacion)=>{
            if(confirmacion.ok){
                message.success(confirmacion.msg);
                return handleOk();
            }else{
                message.error(confirmacion.msg);
            }
        });
        form.resetFields();
    }
    

    const handleDelete = (record) => {

        //TODO Confirmación si lo quiere eliminar realmente
        const { _id:empleadoID } = record;
        socket.emit("eliminar-empleado-en-obra",{obraId,empleadoID},(confirmacion)=>{
            confirmacion.ok ? message.success(confirmacion.msg) : message.error(confirmacion.msg);
            //(confirmacion.ok) ? message.success(confirmacion.msg)(handleOk()) : message.error(confirmacion.msg);
        });
    }

    const columns = [
        {
            title:"Nombre empleado",
            dataIndex:"nombre",
            key:"nombre",
            with:"33%"
        },
        {
            title:"Rol",
            dataIndex:"rol",
            key:"rol",
            with:"33%"
        },
        {
            title:"Acciones",
            render:(text,record) => {
                return (
                    <Button type="primary" danger onClick={()=>{handleDelete(record)}}>Eliminar empleado</Button>
                )
            }
        },
        {
            title:"Detalles",
            dataIndex:"_id",
            key:"_id",
            render:(text,record) => {
                return (
                    <a href="#" onClick={(event)=>{
                        event.preventDefault();
                        setEmpleadoId(record._id);
                        setIsVisibleDrawer(true);
                    }}>Ver mas detalles</a>
                )
            }
        },
    ];

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );
   
    const renderizarHabilidades = () => {
		return informacionEmpleado.habilidades.map(elemento=>{
			return <p className="fw-bold">{elemento}</p>
		})
    }
    const ShowDrawer = () => (
        <Drawer width={640} placement="right" closable={false} onClose={()=>{setIsVisibleDrawer(false)}} visible={isVisibleDrawer}>
            <p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Perfil del usuario</p>
            <Avatar shape="square" src={`http://localhost:4000/api/uploads/usuarios/${informacionEmpleado.uid}`} style={{width:"250px",height:"250px",marginBottom:24}}/>
            <p className="site-description-item-profile-p fw-bold">Personal</p>
            <Row>
                <Col span={12}><DescriptionItem title="Nombre" content={informacionEmpleado.nombre}/></Col>
                <Col span={12}><DescriptionItem title="Edad" content={23}/></Col>
                <p>Habilidades:</p>
                <Col span={24} className="d-flex flex-wrap gap-4">
                    {informacionEmpleado.habilidades.length > 0 ? renderizarHabilidades() : <p>Ninguna habilidades registrada por el momento...</p>}
                </Col>
            </Row>
            <Divider/>
            <p className="site-description-item-profile-p fw-bold">Información de contacto</p>
            <Row>
                <Col span={24}><DescriptionItem title="Correo electronico" content={informacionEmpleado.correo}/></Col>
                <Col span={24}><DescriptionItem title="Numero de telefono" content={informacionEmpleado.telefono}/></Col>
            </Row>
        </Drawer>
    )
    return (
        <>
        <h1>Trabajadores de la obra</h1>
        <p className="lead">En esta seccion podras añadir o eliminar empleados que estaran participando en la obra</p>
        <Divider/>
            <Button
                onClick={showModal}
                type="primary"
                style={{
                    marginBottom: 10,
                    marginRight:10
                }}
            >
                Añadir empleado
            </Button>

        <Table 
            columns = {columns} 
            dataSource = {dataSource} 
            className="fix" 
            style={{overflowX:"auto"}} 
            bordered/>

        <Modal title="Agregar empleado a la obra" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                    <h4>Agregar un nuevo empleado a la obra</h4>
                    <p className="lead">A continuación se mostrara un formulario con todos los campos a llenar para
                    agregar un empleado a la obra
                    </p>
                    <Form form={form} onFinish={handleAddNewEmployer} layout="vertical">
                        <Form.Item
                            label="Nombre del empleado que sera agregado a la obra"
                            name="empleadoID"
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
                            name="rolEmpleado"
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
                            <Button className="mx-2" htmlType='button' onClick={onReset}>Borrar información</Button>
                        </div>
                   </Form>
        </Modal>
        {informacionEmpleado && <ShowDrawer/>}
        </>
    )
}
