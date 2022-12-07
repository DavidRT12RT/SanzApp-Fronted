import { Button, DatePicker, Form, Input, Modal, Select, Table, Tag } from 'antd'
import React, { useState, useEffect } from 'react'
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ReporteEntradas } from '../../../../../reportes/Productos/ReporteEntradas';
import { useLocation } from 'react-router-dom';
const { RangePicker } = DatePicker;

export const EntradasProducto = ({registros,informacionProducto}) => {

    const [registrosEntradas, setRegistrosEntradas] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleReporte, setIsModalVisibleReporte] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [form] = Form.useForm();
    const location = useLocation();


    useEffect(() => {
        setRegistrosEntradas([...registros.sobranteObra,...registros.devolucionResguardo,...registros.compraDirecta]);
    }, [registros]);

    const filtrarEntradas = (values) => {
        console.log(values);
        setIsSearching(true);
        const nuevosRegistros = registrosEntradas.filter(registro => {
            if((moment(registro.fecha).isBetween(values.intervaloFecha[0],values.intervaloFecha[1])) && (values.tipo.includes(registro.tipo))) return registro;
        });
        setRegistrosEntradas(nuevosRegistros);
        setIsModalVisible(false);
    }

    const limpiarFiltros = () => {

        setIsSearching(false);
        setRegistrosEntradas([...registros.sobranteObra,...registros.devolucionResguardo,...registros.compraDirecta]);
        
    }

    const crearReporteEntradas = async(values) => {
        const entradasFiltradas = registrosEntradas.filter(entrada => {
            if((moment(entrada.fecha).isBetween(values.intervaloFecha[0],values.intervaloFecha[1])) && (values.tipo.includes(entrada.tipo))) return entrada;
        });
        const blob = await pdf((
            <ReporteEntradas informacionProducto={informacionProducto} intervaloFecha={[values.intervaloFecha[0].format('YYYY-MM-DD'),values.intervaloFecha[1].format('YYYY-MM-DD')]} entradas={entradasFiltradas} entradasCategorias={values.tipo}/>
        )).toBlob();
        saveAs(blob,"reporte_entradas.pdf")
    }
    
    const columns = [            
        {
            title:"Tipo de entrada",
            key:"tipoEntrada",
            dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "sobranteObra":
                        return (
                            <Tag color="green">SOBRANTE-OBRA</Tag>
                        )
                    case "devolucionResguardo":
                        return (
                            <Tag color="yellow">DEVOLUCION-RESGUARDO</Tag>
                        )
                    case "compraDirecta":
                        return (
                            <Tag color="blue">COMPRA-DIRECTA</Tag>
                        )
                }
            }
        },
        {
            title:"Cantidad ingresada",
            key:"cantidad",
            dataIndex:"cantidad"
        },
        {
            title:"Fecha del ingreso",
            key:"fecha",
            dataIndex:"fecha"
        },
    ];
    
    return (
        <>
            <div className="d-flex justify-content-start align-items-center flex-wrap gap-2 mb-3">
                {isSearching ? <Button type="primary" danger onClick={limpiarFiltros}>Borrar filtros</Button> : <Button type="primary" onClick={()=>{setIsModalVisible(true)}}>Filtrar registros</Button>}
                {location.pathname.startsWith("/almacen") && <Button type="primary" onClick={()=>{setIsModalVisibleReporte(true)}}>Crear reporte de entradas</Button>}
            </div>
            <Table columns={columns} dataSource={registrosEntradas} pagination={{pageSize:4}} size="large" bordered/>
            <Modal visible={isModalVisible} footer={null} onCancel={()=>{setIsModalVisible(false)}} onOk={()=>{setIsModalVisible(false)}}>
                <Form onFinish={filtrarEntradas} layout="vertical" form={form}>
                    <h1 className="titulo" style={{fontSize:"30px"}}>Filtrar registros de entradas</h1>
                    <Form.Item label="Intervalo de fecha" name="intervaloFecha" rules={[{required: true,message: 'Ingresa un intervalo de fecha!',},]}>
                        <RangePicker locale={locale} size="large" style={{width:"100%"}}/>
                    </Form.Item>

                    <Form.Item label="Tipo de entrada" name="tipo" rules={[{required: true,message: 'Ingresa un tipo de entrada!',},]}>
                		<Select mode="multiple" placeholder="Tipo de entrada..." size="large">
							<Select.Option value="sobranteObra">Sobrante de obra</Select.Option>
							<Select.Option value="devolucionResguardo">Devolucion resguardo</Select.Option>
							<Select.Option value="compraDirecta">Compra directa</Select.Option>
              		    </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Filtrar registros</Button>
                </Form>
            </Modal>

            <Modal visible={isModalVisibleReporte} footer={null} onCancel={()=>{setIsModalVisibleReporte(false)}} onOk={()=>{setIsModalVisibleReporte(false)}}>
                <Form onFinish={crearReporteEntradas} layout="vertical" form={form}>
                    <h1 className="titulo" style={{fontSize:"30px"}}>Filtrar registros de entradas</h1>
                    <p className="descripcion">Marca en las siguientes casillas que informacion quieras que contengan el reporte de entradas del producto</p>
                    <Form.Item label="Intervalo de fecha" name="intervaloFecha" rules={[{required: true,message: 'Ingresa un intervalo de fecha!',},]}>
                        <RangePicker locale={locale} size="large" style={{width:"100%"}}/>
                    </Form.Item>

                    <Form.Item label="Tipo de entrada" name="tipo" rules={[{required: true,message: 'Ingresa un tipo de entrada!',},]}>
                		<Select mode="multiple" placeholder="Tipo de entrada..." size="large">
							<Select.Option value="sobranteObra">Sobrante de obra</Select.Option>
							<Select.Option value="devolucionResguardo">Devolucion resguardo</Select.Option>
							<Select.Option value="compraDirecta">Compra directa</Select.Option>
              		    </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Descargar PDF</Button>
                </Form>
            </Modal>
        </>
    )
}
