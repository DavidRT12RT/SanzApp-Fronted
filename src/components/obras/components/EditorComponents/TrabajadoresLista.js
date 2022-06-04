import React, { useEffect, useState } from 'react'
import { Button, Divider, Form, Input, message, Modal, Select, Table } from "antd";
import { useParams } from 'react-router-dom';
import "../../assets/styleMaterialList.css";
const { Option } = Select;

export const TrabajadoresLista =  ({obraInfo,socket}) => {

    const [dataSource, setDataSource] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [empleados, setEmpleados] = useState([]);
    const [form] = Form.useForm();
    const { obraId } = useParams();
    //Select row
    const [selectedRows, setSelectedRows] = useState([]);

    const disabledButton = selectedRows.length > 0 ? false : true;

    //Obtener TODOS los empleados activos
    useEffect(() => {
        socket.emit("obtener-empleados-activos",{},(empleados)=>{ 
            setEmpleados(empleados);
        }); 
    }, []);

    //Estar al tanto por si la información de la obra cambia
    useEffect(()=>{
        setDataSource(obraInfo.empleados);
    },[obraInfo]);

    //Obtener todos los empleados que YA esten trabajando en la obra con su rol
    useEffect(() => {
        socket.emit("obtener-empleados-en-obra-por-id",{obraId},(empleados)=>{
            empleados.map(empleado=>empleado.key = empleado._id);
            setDataSource(empleados);
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
    
    const rowSelection = {
        /*
        onSelect: (record, selected, selectedRows) => {
            //console.log("Seleccionaste una celda","record",record, "selected",selected, "selectedrow",selectedRows);
            setSelectedRow(prevState => [...prevState,record]);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            setSelectedRow([...selectedRows]);
        },
        */
        onChange: (selectedRowKeys, selectedRows) => {
            //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            //setSelectedRow([...selectedRows]);
            setSelectedRows([...selectedRowKeys]);
        },
    };

    const handleDelete = () => {

        //Confirmación si lo quiere eliminar realmente
        const employersArrayUpdated = dataSource.filter(element => {
            if(!selectedRows.includes(element.key)){
                return element;
            }
        });
        socket.emit("eliminar-empleado-en-obra",{obraId,employersArrayUpdated},(confirmacion)=>{
            if(confirmacion.ok){
                message.success(confirmacion.msg);
            }else{
                message.error(confirmacion.msg);
            }
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
            title:"Correo electronico",
            dataIndex:"correo",
            key:"correo",
            with:"33%"
        },
        {
            title:"Telefono",
            dataIndex:"telefono",
            key:"telefono",
            with:"33%"
        },
        {
            title:"Rol",
            dataIndex:"rol",
            key:"rol",
            with:"33%"
        },
    ];

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
            <Button
                onClick={handleDelete}
                type="primary"
                danger
                disabled={disabledButton}
            >
                Eliminar empleado
            </Button>

        <Table 
            columns = {columns} 
            dataSource = {dataSource} 
            className="fix" 
            style={{overflowX:"auto"}} 
            rowSelection={{...rowSelection}} 
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
        </>
    )
}
