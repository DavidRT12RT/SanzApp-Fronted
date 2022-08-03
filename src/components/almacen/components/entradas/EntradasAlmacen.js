import { Button, Col, DatePicker, Divider, Drawer, Dropdown, Form, Input, Menu, Modal, Row, Select, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useEntradas } from '../../../../hooks/useEntradas';
import { Loading } from '../../../obras/Loading';
import { ProductoCardAlmacen } from '../salidas/ProductoCardAlmacen';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import "./assets/styleEntradasAlmacen.css"
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ReporteEntradasAlmacen } from '../../../../reportes/Almacen/ReporteEntradasAlmacen';
const { Search } = Input;
const { RangePicker } = DatePicker;

export const EntradasAlmacen = () => {

    const { isLoading,entradas} = useEntradas();
    const [entradasRegistros, setEntradasRegistros] = useState([]);
    const [informacionRegistroParticular, setInformacionRegistroParticular] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
	const [isReporte, setIsReporte] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    useEffect(() => {
        entradas.map(registro => registro.key = registro._id);
        setEntradasRegistros(entradas);
    }, [entradas]);

	const columns = [
		{
			title:"Tipo de entrada",
			dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "sobrante-obra":
                        return (
                            <Tag color="green">{text.toUpperCase()}</Tag>
                        )
                    case "devolucion-resguardo":
                        return (
                            <Tag color="yellow">{text.toUpperCase()}</Tag>
                        )
                    case "normal":
                        return (
                            <Tag color="red">NORMAL</Tag>
                        )
                }
            }
		},
		{
			title:"Fecha creacion",
			dataIndex:"fecha"
		},
		{
			title:"Detalles",
			render:(text,record) => {
				return <a onClick={(e)=>{
					e.preventDefault();
					//Seteando la informacion para ver el registro en particular
					setInformacionRegistroParticular(record);
					setIsDrawerVisible(true);
				}} href="">Datos completos de la entrada</a>
			}
		}
	];

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );

    const renderizarProductoIngresado = (producto) => {
        switch (informacionRegistroParticular.tipo) {
            /*Para caso de devolucion o sobrante de obra, este es un metodo para ejecutar codigo por dos condiciones
            sin usar el || */
            case "devolucion-resguardo":
            case "sobrante-obra" :
                return (
                    <ProductoCardAlmacen producto={producto} key={producto.id} tipo={"devuelto"}/>
                );
            case "normal":
                return (
                    <ProductoCardAlmacen producto={producto} key={producto.id} tipo={"normal"}/>
                )
        }
    }

    const filtrarEntradas = async(values) => {
        const entradasFiltradas = entradasRegistros.filter(entrada => {
            if(moment(entrada.fecha).isBetween(values.intervaloFecha[0].format("YYYY-MM-DD"),values.intervaloFecha[1].format("YYYY-MM-DD")) && (values.tipo.includes(entrada.tipo))) return entrada;
        });

        if(isReporte){
            const blob = await pdf((
                <ReporteEntradasAlmacen intervaloFecha={[values.intervaloFecha[0].format('YYYY-MM-DD'),values.intervaloFecha[1].format('YYYY-MM-DD')]} entradas={entradasFiltradas} categorias={values.tipo}/>
            )).toBlob();
            saveAs(blob,"reporte_entradas.pdf")
            setIsReporte(false);
        }else{
            setEntradasRegistros(entradasFiltradas);
            setIsSearching(true);
        }
        setIsModalVisible(false);
    }

    const filtrarEntradaPorCodigo = (values) => {
    }

    const limpiarFiltros = () => {
        setEntradasRegistros(entradas);
        setIsSearching(false);
    }

    if(isLoading){
       return <Loading/> 
    }else{
        return (
             <div className="container" style={{minHeight:"100vh"}}>
                <div className="text-center p-5">
                    <h1 className="titulo text-success" style={{fontSize:"40px"}}>Entradas del almacen</h1>

                    <div className="d-flex justify-content-center align-items-center gap-3 flex-column">
                        <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                            {isSearching ? <Button type='primary' size="large" danger onClick={limpiarFiltros}>Borrar filtros</Button> :<Button type="primary" size="large" onClick={()=>{setIsModalVisible(true)}}>Filtrar registros</Button>}
                            <Button type="primary" size="large" onClick={()=>{setIsReporte(true);setIsModalVisible(true)}}>Generar reporte de entradas</Button>
                        </div>
                    </div>
                    <Divider/>
					<Table columns={columns} className="mt-3" dataSource={entradasRegistros} bordered/>
                </div>
				{informacionRegistroParticular != null && (
					<Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);}} visible={isDrawerVisible}>
                        <p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada de la entrada a almacen</p>
                    	<p className="site-description-item-profile-p">Informacion sobre el ingreso del almacen</p>
                        <Row>
                       	    <Col span={12}><DescriptionItem title="Fecha de la entrada" content={informacionRegistroParticular.fecha}/></Col>
                       		<Col span={12}><DescriptionItem title="Tipo de entrada" content={informacionRegistroParticular.tipo.toUpperCase()}/></Col>
                            <Divider/>
                    		<p className="site-description-item-profile-p">Lista de productos ingresados a almacen</p>
                        	<div className="d-flex justify-content-center align-items-center container p-5 gap-2 flex-column">
							    {
								    informacionRegistroParticular.listaProductos.map(producto => {
                                        return renderizarProductoIngresado(producto);
								    })
							    }
						    </div>
                        </Row>
                    </Drawer>
                )}
                <Modal visible={isModalVisible} footer={null} onCancel={()=>{setIsModalVisible(false);setIsReporte(false)}} onOk={()=>{setIsModalVisible(false);setIsReporte(false)}}>
                    {isReporte ? <h1 className="titulo" style={{fontSize:"30px"}}>Filtrar registros del reporte</h1> : <h1 className="titulo" style={{fontSize:"30px"}}>Filtrar registros</h1>}
                    {isReporte ? <p className="descripcion">Filtrar los registros de las entradas que tendra el reporte.</p>:<p className="descripcion">Filtrar los registros de las entradas.</p>}
                    <Form onFinish={filtrarEntradas} layout={"vertical"}>
                        <Form.Item label="Intervalo de fecha" name="intervaloFecha" rules={[{required: true,message: 'Ingresa un intervalo de fecha!',},]}>
                            <RangePicker locale={locale} size="large" style={{width:"100%"}}/>
                        </Form.Item>

                        <Form.Item label="Tipo de entrada" name="tipo" rules={[{required: true,message: 'Ingresa un tipo de entrada!',},]}>
                		    <Select mode="multiple" placeholder="Tipo de entrada..." size="large">
							    <Select.Option value="sobrante-obra">Sobrante de obra</Select.Option>
							    <Select.Option value="devolucion-resguardo">Devolucion resguardo</Select.Option>
							    <Select.Option value="normal">Normal</Select.Option>
              		        </Select>
                        </Form.Item>
                        {isReporte ? <Button type="primary" htmlType="submit">Descargar PDF</Button>:<Button type="primary" htmlType="submit">Aplicar filtros</Button>}
                    </Form>
                </Modal>
            </div>
        )
    }
}
