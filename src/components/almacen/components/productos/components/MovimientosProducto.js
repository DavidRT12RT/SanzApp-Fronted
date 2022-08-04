import { Button, Col, DatePicker, Divider, Drawer, Form, Modal, Row, Select, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
const { RangePicker } = DatePicker;

export const MovimientosProducto = ({registros,informacionProducto}) => {
    const [registrosMovimientos, setRegistrosMovimientos] = useState([]);
    const [informacionInventario, setInformacionInventario] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isReporte, setIsReporte] = useState(false);
    const location = useLocation();
    const [form] = Form.useForm();

    useEffect(() => {
        setRegistrosMovimientos(registros);
    }, [registros]);

    const columns = [
        {
            title:"Titulo del inventario",
            render:(text,record) => {
                return (
                    <span>{record.inventario.titulo}</span>
                )
            }
        },
        {
            title:"Fecha del inventario",
            render:(text,record) => {
                return <span>{record.inventario.fechaRegistro}</span>
            }
        },
        {
            title:"Tipo",
            render:(text,record) => {
                if(record.tipo === "GANANCIA") return <Tag color={"green"} style={{fontSize:"13px",padding:"13px"}}>{record.tipo}</Tag>
                if(record.tipo === "PERDIDA") return <Tag color={"red"} style={{fontSize:"13px",padding:"13px"}}>{record.tipo}</Tag>
                if(record.tipo === "NEUTRAL") return <Tag color={"cyan"} style={{fontSize:"13px",padding:"13px"}}>{record.tipo}</Tag>
            },
        },
        {
            title:"Detalles",
            render:(text,record) => {
                return (
                    <a href="#" onClick={()=>{setInformacionInventario(record);setIsDrawerVisible(true);}}>Ver mas detalles</a>
                )
            }
        }
    ];

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );

    const filtrarMovimientos = (values) => {

        const movimientosFiltrados = registros.filter(registro => {
            if((values.tipo.includes(registro.tipo)) && (moment(registro.inventario.fechaRegistro).isBetween(values.intervaloFecha[0],values.intervaloFecha[1]))) {
                return registro;
            }
        });
        if(isReporte){
            /*
            const blob = await pdf((
            )).toBlob();
            saveAs(blob,"reporte_movimientos.pdf")
            */
            setIsReporte(false);
        }else{
            setRegistrosMovimientos(movimientosFiltrados);
            setIsSearching(true);
        }
        setIsModalVisible(false);
    }

    const limpiarFiltros = () => {
        setIsSearching(false);
        setRegistrosMovimientos(registros);
    }
    
    return (
        <>


            <div className="d-flex justify-content-start align-items-center flex-wrap gap-2 mb-3">
                {isSearching ? <Button type="primary" danger onClick={limpiarFiltros}>Borrar filtros</Button> : <Button type="primary" onClick={()=>{setIsModalVisible(true)}}>Filtrar registros</Button>}
                {location.pathname.startsWith("/almacen") && <Button type="primary" onClick={()=>{setIsReporte(true);setIsModalVisible(true)}}>Crear reporte de movimientos</Button>}
            </div>
            <Table columns={columns} bordered dataSource={registrosMovimientos}/>
            {informacionInventario != null && (
            <Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);setInformacionInventario(null)}} visible={isDrawerVisible}>
                <p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada del inventario</p>
                <Row>
                    <Col span={24}><DescriptionItem title="Titulo" content={informacionInventario.inventario.titulo}/></Col>
                    <Col span={24}><DescriptionItem title="Descripcion" content={informacionInventario.inventario.descripcion}/></Col>
                    <Col span={24}><DescriptionItem title="Tipo de inventario" content={informacionInventario.inventario.tipo}/></Col>
                    <Col span={24}><DescriptionItem title="Estatus del inventario" content={informacionInventario.inventario.estatus}/></Col>
                    <Divider/>
                    <Col span={12}><DescriptionItem title="Cantidad teorica" content={informacionInventario.cantidadTeorica}/></Col>
                    <Col span={12}><DescriptionItem title="Cantidad contada" content={informacionInventario.cantidadContada}/></Col>
                    <Divider/>
                    <Col span={24}><DescriptionItem title="Fecha del inventario" content={informacionInventario.inventario.fechaRegistro}/></Col>
                    <Col span={24}><DescriptionItem title="Intervalo de fecha del inventario" content={informacionInventario.inventario.intervaloFecha.join(" --- ")}/></Col>
                    <Divider/>
                    <Link to={`/almacen/inventarios/${informacionInventario.inventario._id}`}>Ver detalles completos del inventario</Link>
                </Row>
            </Drawer>
            )}
            <Modal visible={isModalVisible} footer={null} onCancel={()=>{setIsModalVisible(false);setIsReporte(false)}} onOk={()=>{setIsModalVisible(false);setIsReporte(false)}}>
                {isReporte ? <h1 className="titulo">Filtrar registros del reporte</h1> : <h1 className="titulo">Filtrar registros</h1>}
                {isReporte ? <p className="descripcion">Filtrar los registros que tendra el reporte de movimientos del producto</p> : <p className="descripcion">Filtrar registros de movimientos.</p>}
                <Form layout="vertical" form={form} onFinish={filtrarMovimientos}>
                    <Form.Item label="Tipo del movimiento" name="tipo">
                		<Select mode="multiple" placeholder="Tipo de salida..." size="large">
							<Select.Option value="GANANCIA">Ganacia</Select.Option>
							<Select.Option value="PERDIDA">Perdida</Select.Option>
							<Select.Option value="NEUTRAL">Neutral</Select.Option>
              		    </Select>
                    </Form.Item>
                    <Form.Item label="Fecha de la creacion de los reportes" name="intervaloFecha">
                        <RangePicker locale={locale} size="large" style={{width:"100%"}}/>
                    </Form.Item>
                    {isReporte ?<Button type="primary" htmlType="submit">Descargar PDF</Button> :<Button type="primary" htmlType="submit">Filtrar movimientos</Button> }
                </Form>
            </Modal>
        </>

    )
}
