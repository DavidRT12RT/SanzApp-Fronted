import React, { useEffect, useState } from 'react'
import { Button, Divider, Form, Input, Modal, Table } from "antd";
import { useParams } from 'react-router-dom';
import "../../assets/styleMaterialList.css";

export const MaterialUtilizado = ({obraInfo,socket}) => {

    const [dataSource, setDataSource] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [deletingRow, setDeletingRow] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const [form] = Form.useForm();

    useEffect(() => {
        setDataSource(obraInfo.materialUtilizado);
    }, [obraInfo]);
    
    const { obraId } = useParams();




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

    return (
        <>
        <h1>Material utilizado</h1>
        <p className="lead">En esta sección se mostrara los materiales utilizados en la obra hasta el momento.</p>
        <Divider/>
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
                        className="fix"
                    />
                </Form>
            </div>
        <Modal title="Agregar material a la obra" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>

        </Modal>
        </>
    )
}
