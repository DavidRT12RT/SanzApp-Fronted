import React, { useEffect, useState } from 'react'
import { Button, Divider, Form, Input, Modal, Table, Select, InputNumber, message, Dropdown, Space, Badge, Menu} from "antd";
import { useParams } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';
import "../../assets/styleMaterialList.css";
const { Option } = Select;

export const HorasExtra = ({obraInfo,socket}) => {

    const [dataSource, setDataSource] = useState([]);
    const [data, setData] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [empleadosObra, setEmpleadosObra] = useState([]);
    const [currentExpandedRow, setCurrentExpandedRow] = useState(null);
    const [form] = Form.useForm();
    const { obraId } = useParams();

    
   
    /*NOTA 
        En nuestra tabla tenemos el prop expandable el cual recibe una función la cual recibe los valores record,index,etc.
        esta función obtendra el valor de cada fila y con eso nosotros solo destructuramos el valor registros de la fila osea record
        y ese sera el dataSource de nuestra tabla con las columnas 
    */

    const menu = (
    <Menu
        items={[
        {
            key: '1',
            label: 'Editar',
        },
        {
            key: '2',
            label: 'Guardar',
        },
        ]}
    />
    );

    const expandedRowRender = (record,index,indent,expanded) => {
        //console.log(record,index,indent,expanded);

        const columns = [
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'date',
        },
        {
            title: 'Motivo',
            dataIndex: 'motivo',
            key: 'motivo',
        },
        {
            title:"Horas",
            dataIndex:"horas",
            key:"horas"
        },
        {
            title: 'Estatus',
            key: 'estatus',
            dataIndex:"estatus",
            render: (text,record) => {
                if(text){
                    return (<span><Badge status="success"/>Pagadas</span>)
                }else{
                    return (<span><Badge status="error"></Badge>NO Pagadas</span>)
                }
            }
        },
        {
            title: 'Menu',
            dataIndex: 'operation',
            key: 'operation',
            render: () => (
            <Space size="middle">
                <Dropdown overlay={menu}>
                <a>
                    Acciones <DownOutlined />
                </a>
                </Dropdown>
            </Space>
            ),
        },
        ];


        return <Table columns={columns} dataSource={record.registros} pagination={false} with="100%"/>;
    };

    useEffect(() => {
        setEmpleadosObra(obraInfo.empleados);
        obraInfo.horasExtra.map(element => element.key = element._id);
        setDataSource(obraInfo.horasExtra);
    }, []);
   
    

    useEffect(() => {
        obraInfo.horasExtra.map(element => element.key = element._id);
        setDataSource(obraInfo.horasExtra);
        setEmpleadosObra(obraInfo.empleados);
    }, [obraInfo]);

    useEffect(() => {
        if(currentExpandedRow != null){
            const data = obraInfo.horasExtra.find(element => element.key === currentExpandedRow);
            setData(data.registros); 
        }
    }, [currentExpandedRow]);
    
   
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onFinish = ( values ) =>{

        //Pequeña validación para checar si los datos son los mismo y si es asi NO enviar la petición
        for (let index = 0; index < dataSource.length; index++) {
            if(dataSource[index].key === editingRow){
                if(dataSource[index].trabajador === values.trabajador && dataSource[index].horas === values.horas && dataSource[index].pagadas === values.pagadas && dataSource[index].motivo === values.motivo){
                    setEditingRow(null);
                    return;
                }
            }
        }

        const newData = dataSource.map(element => {
            if(element.key === editingRow){
                //Es el elemento que queremos cambiar!
                element.trabajador = values.trabajador;
                element.motivo = values.motivo;
                element.pagadas = values.pagadas;
                element.horas = values.horas;
            }
            delete element.key;
            return element;
        });
        //setDataSource(newData);
        setEditingRow(null);
        //TODO
        socket.emit("actualizar-horas-extra-a-obra",{newData,obraId},(confirmacion)=>{
            confirmacion ? message.success(confirmacion.msg) : message.error(confirmacion.msg);
        });
    }

    const handleAddNewRegister = (values) => {
        values.obraId = obraId;
        socket.emit("añadir-horas-extra-a-obra",values,(confirmacion)=>{
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
            dataIndex:"horas",
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
            dataIndex:"cantidadRegistros",
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
                <Form form = {form} onFinish={onFinish}>
                    <Table
                        columns = {columns}
                        dataSource = {dataSource}
                        expandable={
                                {
                                    expandedRowRender,
                                    /*
                                    onExpand:(expanded,record)=>{
                                        if(currentExpandedRow === null){
                                            const { key } = record;
                                            setCurrentExpandedRow(key);
                                        }else{
                                            setCurrentExpandedRow(null);
                                        }
                                    },
                                    */
                            }
                        }
                        className="fix"
                        with="100%"
                    />
                </Form>
            </div>

        <Modal title="Agregar un nuevo registro!" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
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
