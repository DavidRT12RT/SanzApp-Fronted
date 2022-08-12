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
			title:<p className="titulo-descripcion">Titulo</p>,
            render:(text,record) => {
				return <p className="descripcion">{record.titulo}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Tipo de inventario</p>,
            render:(text,record) => {
				return <p className="descripcion">{record.tipo}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Fecha de registro</p>,
            render:(text,record) => {
				return <p className="descripcion">{record.fechaRegistro}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Estatus</p>,
            render:(text,record) => {
                switch (record.estatus) {
                    case "En progreso":
				        return <p className="descripcion text-success">{record.estatus}</p>
                    case "Finalizado":
				        return <p className="descripcion text-danger">{record.estatus}</p>
                }
            }
        },
        {
            title:<p className="titulo-descripcion">Detalles</p>,
            render:(text,record)=>{
                return <Link to={`/almacen/inventarios/${record._id}`} className="descripcion text-primary">Ver mas detalles</Link>
            }
        }
    ];

    const filtrarInventariosPorTitulo = (values) => {

	    if(values.length === "") return setRegistrosInventarios(inventarios);
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
                <p className="descripcion" style={{fontSize:"27px"}}>Inventarios que ha tenido el <b>almacen</b> , aqui podras buscar los inventarios y ver mas <b>detalles</b> sobre cada uno de estos , tambien podras generar un <b>reporte</b> en PDF sobre este mismo.</p>
                <div className="d-flex justify-content-center align-items-center gap-3 flex-column mt-3">
                    <Search
                    	placeholder="Ingresa el titulo del inventario..."
                    	allowClear
                    	autoFocus
                    	enterButton="Buscar"
					    size="large"
						onChange={(e)=>{
                            filtrarInventariosPorTitulo(e.target.value)
						}}
                	/> 
                    {isSearching ? <Button type="primary" danger onClick={limpiarFiltros}>Borrar filtros</Button> : <Button type="primary" onClick={()=>{setIsModalVisible(true)}} >Filtrar inventarios</Button>}
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
                                <Select.Option value="POR-CATEGORIA">Por categoria</Select.Option>
              		        </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Aplicar filtros</Button>
                    </Form>
                </Modal>
            </div>
        )
    }
}
