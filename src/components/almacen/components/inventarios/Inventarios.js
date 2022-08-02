import { Button, DatePicker, Form, Input, Modal, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { useInventarios } from '../../../../hooks/useInventarios';
import "./assets/style.css";
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
const { Search } = Input;

export const Inventarios = () => {


    const { isLoading,inventarios } = useInventarios();
    const [registrosInventarios, setRegistrosInventarios] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setRegistrosInventarios(inventarios);
    }, [inventarios]);
    
    const columns = [
        {
            title:"Titulo",
            dataIndex:"titulo"
        },
        {
            title:"Tipo de inventario",
            dataIndex:"tipo"
        },
        {
            title:"Intervalo de fecha",
            render:(text,record)=>{
                return (
                    <span>{record.intervaloFecha[0]} --- {record.intervaloFecha[1]}</span>
                )
            }
        },
        {
            title:"Estatus",
            dataIndex:"estatus"
        },
        {
            title:"Detalles",
            render:(text,record)=>{
                return <Link to={`/almacen/inventarios/${record._id}`}>Ver mas detalles</Link>
            }
        }
    ];

    const filtrarInventariosPorTitulo = (values) => {
        const inventariosFiltrados = inventarios.filter(inventario => { if(inventario.titulo.toLowerCase().includes(values.toLowerCase())) return inventario;})
        setRegistrosInventarios(inventariosFiltrados);
    }

    const filtrarRegistros = (values) => {
        const inventariosFiltrados = inventarios.filter(inventario => {
            if(moment(inventario.fechaRegistro).isSame(values.fechaRegistro.format("YYYY-MM-DD")) && values.tipoInventario.includes(inventario.tipo)) return inventario;
        });
        setRegistrosInventarios(inventariosFiltrados);
        setIsModalVisible(false);
        setIsSearching(true);
    }

    const limpiarFiltros = () => {
        setIsSearching(false);
        setRegistrosInventarios(inventarios);
    }

    if(isLoading){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-5 text-center"  style={{minHeight:"100vh"}}>
                <div className="d-flex justify-content-end flex-wrap gap-2 align-items-center">
                    <Link to="/almacen/inventarios/registrar-inventario/"><Button type="primary"  className="my-3">Crear un nuevo inventario</Button></Link>
                </div>          
                <h1 className="titulo" style={{fontSize:"40px"}}>Inventarios totales del almacen</h1>
                <h1 className="descripcion">Inventarios que ha tenido el almacen , aqui podras buscar los inventarios y ver mas detalles sobre cada uno.</h1>
                <div className="d-flex justify-content-center align-items-center gap-3 flex-column mt-3">
                    <Search
                    	placeholder="Ingresa el titulo del inventario..."
                    	allowClear
                    	autoFocus
                    	enterButton="Buscar"
					    size="large"
						onSearch={filtrarInventariosPorTitulo}
						onChange={(e)=>{
							if(e.target.value === "") return setRegistrosInventarios(inventarios);
						}}
                	/> 
                    {isSearching ? <Button type="primary" danger size="large" onClick={limpiarFiltros}>Borrar filtros</Button> : <Button type="primary" onClick={()=>{setIsModalVisible(true)}} size="large">Filtrar inventarios</Button>}
                </div>
                <Table columns={columns} dataSource={registrosInventarios} bordered className="mt-4"/>
                <Modal visible={isModalVisible} footer={null} onCancel={()=>{setIsModalVisible(false)}} onOk={()=>{setIsModalVisible(false)}}>
                    <h1 className="titulo" style={{fontSize:"30px"}}>Filtrar registros</h1>
                    <p className="descripcion">Filtrar registros de inventarios por los siguientes campos.</p>
                    <Form form={form} layout={"vertical"} onFinish={filtrarRegistros}>
                        <Form.Item label="Fecha registro" name="fechaRegistro" rules={[{required: true,message: 'Ingresa la fecha del reporte!',},]}>
                            <DatePicker style={{width:"100%"}} locale={locale} size="large"/>
                        </Form.Item>
                        <Form.Item label="Tipo de inventario" name="tipoInventario" rules={[{required: true,message: 'Ingresa un tipo de inventario para filtrar!',},]}>
                		    <Select mode="multiple" placeholder="Tipo de inventario..." size="large">
                                <Select.Option value="TODOS">Todos los productos</Select.Option>
                                <Select.Option value="VARIOS-PRODUCTOS">Varios productos</Select.Option>
                                <Select.Option value="UN-PRODUCTO">Solo un producto</Select.Option>
              		        </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Aplicar filtros</Button>
                    </Form>
                </Modal>
            </div>
        )
    }
}
