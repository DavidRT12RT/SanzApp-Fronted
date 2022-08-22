import React, { useEffect, useState } from 'react'
import { Button, Divider, Form, Input, Modal, Table, Select, InputNumber, message, Dropdown, Space, Badge, Menu} from "antd";
import { useParams } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
const { Option } = Select;

export const HorasExtra = ({obraInfo,socket}) => {
    
    
    const [dataSource, setDataSource] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [empleadosObra, setEmpleadosObra] = useState([]);
    const [form] = Form.useForm();
    const { obraId } = useParams();

    
    /*NOTA 
        En nuestra tabla tenemos el prop expandable el cual recibe una función la cual recibe los valores record,index,etc.
        esta función obtendra el valor de cada fila y con eso nosotros solo destructuramos el valor registros de la fila osea record
        y ese sera el dataSource de nuestra tabla con las columnas 
    */

    const expandedRowRender = (record,index,indent,expanded) => {
        const columns = [
        {
            title: 'Fecha de registro',
            dataIndex: 'fecha',
            key: 'date',
        },
        {
            title: 'Motivo',
            dataIndex: 'motivo',
            key: 'motivo',
            render:(text,record) => {
                if(editingRow === record.key){
                    return (
                        <Form.Item name="motivo" rules={[{required:true,message:"Tiene que tener un valor este campo"}]}>
                            <Input/>
                        </Form.Item>
                    )
                }else{
                    return <p>{text}</p>
                }
            }
        },
        {
            title:"Horas",
            dataIndex:"horas",
            key:"horas",
            render:(text,record) =>{
                if(editingRow === record.key){
                    return (
                    <Form.Item name="horas" rules={[{required:true,message:"Tiene que tener un valor este campo!"}]}>
                        <InputNumber style={{width: "100%"}} min={1} />
                    </Form.Item>
                    )
                }else{
                    return <p>{text}</p>
                }
            }
        },
        {
            title: 'Estatus',
            key: 'estatus',
            dataIndex:"estatus",
            render: (text,record) => {
                if(editingRow === record.key){
                    return (
                        <Form.Item name="estatus" rules={[{required: true,message: 'El producto necesita tener este parametro'},]}>
                            <Select>
                                <Select.Option value={true}>Pagadas</Select.Option>
                                <Select.Option value={false}>NO pagadas</Select.Option>
                            </Select>
                        </Form.Item>
                    )
                }else{
                    if(text){
                        return (<span><Badge status="success"/>Pagadas</span>)
                    }else{
                        return (<span><Badge status="error"></Badge>NO Pagadas</span>)
                    }
                }
           }
        },
        {
            title:"Acciones",
            render:(_,record) => {
                return (
                <>
                    <Button
                        type="link"
                        onClick={() => {
                            if(editingRow != null){
                                setEditingRow(null);
                            }else{
                                console.log(record.key);
                                setEditingRow(record.key);
                                form.setFieldsValue({
                                    horas:record.horas,
                                    pagadas:record.pagadas,
                                    motivo:record.motivo,
                                    estatus:record.estatus
                                });
                            }
                       }}
                    >
                        Editar registro
                    </Button>

                    <Button type="link" htmlType="submit">
                       {editingRow && "Realizar cambios" }
                    </Button>
                   
                </>
                );
            },
        },
        ];


        return <Form form = {form} onFinish={(values)=>{onFinish(values,record)}}><Table columns={columns} dataSource={record.registros} pagination={false} with="100%"/></Form>;
    };

    useEffect(() => {
        for(let index = 0;index < obraInfo.horasExtra.length; index++){
            //Por cada elemento de horas extra añadimos un elemento key 
            obraInfo.horasExtra[index].key = obraInfo.horasExtra[index]._id;
            for (let j = 0; j < obraInfo.horasExtra[index].registros.length; j++) {
                //Por cada registro del element añadimos un elemento key
                obraInfo.horasExtra[index].registros[j].key = obraInfo.horasExtra[index].registros[j]._id;
            }
        }
        setEmpleadosObra(obraInfo.empleados);
        setDataSource(obraInfo.horasExtra);
    }, []);
   
    

    useEffect(() => {
        
        for(let index = 0;index < obraInfo.horasExtra.length; index++){
            //Por cada elemento de horas extra añadimos un elemento key 
            obraInfo.horasExtra[index].key = obraInfo.horasExtra[index]._id;
            for (let j = 0; j < obraInfo.horasExtra[index].registros.length; j++) {
                //Por cada registro del element añadimos un elemento key
                obraInfo.horasExtra[index].registros[j].key = obraInfo.horasExtra[index].registros[j]._id;
            }
        }
        setDataSource(obraInfo.horasExtra);
        setEmpleadosObra(obraInfo.empleados);
    }, [obraInfo]);

    
   
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = ( newData ) =>{

        socket.emit("actualizar-horas-extra-a-obra",{newData,obraId,editingRow},(confirmacion)=>{
            form.resetFields();
            confirmacion ? message.success(confirmacion.msg) : message.error(confirmacion.msg);
        });
        setEditingRow(null);
    }

    const handleAddNewRegister = (values) => {
        values.obraId = obraId;
        socket.emit("añadir-horas-extra-a-obra",values,(confirmacion)=>{
            form.resetFields();
            confirmacion ? (handleOk())(message.success(confirmacion.msg)) : message.error(confirmacion.msg);
        });
    } 

    const columns = [
        {
            title:"Trabajador",
            dataIndex:"trabajador",
            with:"50%",
            render: (text,record) => {
                if(editingRow === record.key){
                    return (
                        <Form.Item name="trabajador" rules={[{required:true,message:"Tiene que tener un valor este campo!"}]}>
                            <Select
                                placeholder="Selecciona el nombre del empleado..."
                                allowClear
                            >
                                {
                                    empleadosObra.map(empleado => {
                                        return <Option key={empleado.key} value={empleado.nombre}>{empleado.nombre}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        )
                }else{
                    return <p>{text}</p>
                }
            }
        },
        {
            title:"Cantidad de horas extra totales",
            dataIndex:"horasTotales",
            with:"50%",
            render: (text,record) => {
                if(editingRow === record.key){
                    return (
                    <Form.Item name="horas" rules={[{required:true,message:"Tiene que tener un valor este campo!"}]}>
                        <Input/>
                    </Form.Item>
                    )
                }else{
                    return <p>{text}</p>
                }
            }
        },
        {
            title:"Cantidad de registros",
            dataIndex:"numeroRegistros",
        },
        {
            title:"Horas totales pagadas",
            dataIndex:"pagadasTodas",
            render:(text,record) =>{
                if(text){
                    return (<span><Badge status="success"/>Pagadas</span>)
                }else{
                    return (<span><Badge status="error"></Badge>NO Pagadas</span>)
                }

            }
        }
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
                            trabajador:record.trabajador,
                            horas:record.horas,
                            pagadas:record.pagadas,
                            motivo:record.motivo 
                        });
            }}
                    >
                    Editar
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

    return (
        <>
        <h1>Horas extra en la obra</h1>
        <p className="lead">
            En esta sección se podran añadir horas extra a los empleados que se encuentren registrados trabajando dentro de la obra, <br/>
            asi como marcar si las horas estan pagadas o NO. 
        </p>
        <Divider/>
        {
            <Button
                onClick={showModal}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                Añadir nuevo registro
            </Button>
        }
            <div>
                    <Table
                        columns = {columns}
                        dataSource = {dataSource}
                        expandable={
                                {
                                    expandedRowRender,
                                    /*
                                    onExpand:(expanded,record)=>{
                                        if(expanded){
                                            const { key } = record
                                            setCurrentFatherRow(key);
                                        }
                                    }
                                    */
                            }
                        }
                        className="fix"
                        with="100%"
                    />
            </div>

        <Modal title="Agregar un nuevo registro!" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
            <h4>Agregar un nuevo registro</h4>
            <p className="lead">Añade y administra las horas extra de los trabajadores en la obra!</p>
            <Form form = {form} onFinish={handleAddNewRegister} layout="vertical">
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
                                return <Option key={empleado.key} value={empleado.nombre}>{empleado.nombre}</Option>
                            })
                        }
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Cantidad de horas extra"
                    name="horas"
                    tooltip="Especifica cuantas horas extra el empleado hizo"
                    rules={[
                        {
                        required:true,
                        message:"Debes ingresar la cantida de horas extra!"
                        }
                    ]}
                >

                    <InputNumber style={{width: "100%"}} min={1} max={99}/>

                </Form.Item>
 
                <Form.Item
                    label="Motivo"
                    name="motivo"
                    tooltip="Crea una descripción detallada sobre el por que se agregaran horas extra a este empleado"
                    rules={[
                        {
                            required:true,
                            message:"Especifica el motivo por el cual se van agregar las horas extrra!"
                        }
                    ]}
                >
                    <Input.TextArea allowClear showCount minLength={20} maxLength={60} style={{width:"100%"}} placeholder="Descripción del producto" />
                </Form.Item>
                <div className="d-flex justify-content-start gap-2">
                    <Button danger type="primary" onClick={handleCancel}>Salir sin editar</Button>
                    <Button type="primary" htmlType='submit'>Registrar nuevo elemento</Button>
                </div>
 
            </Form>
        </Modal>
        </>
    )
}
