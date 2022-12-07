import { Button, Col, DatePicker, Divider, Drawer, Dropdown, Form, Input, Menu, Modal, Row, Select, Table, Tag } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { useEntradas } from '../../../../hooks/useEntradas';
import { ProductoCardAlmacen } from '../salidas/ProductoCardAlmacen';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import "./assets/styles.css"
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ReporteEntradasAlmacen } from '../../../../reportes/Almacen/ReporteEntradasAlmacen';
import { Link } from 'react-router-dom';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
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
			title:<p className="titulo-descripcion text-success">Tipo de entrada</p>,
			dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "sobrante-obra":
                        return (
                            <Tag color="green" style={{fontSize:"13px",padding:"13px"}}>{text.toUpperCase()}</Tag>
                        )
                    case "devolucion-resguardo":
                        return (
                            <Tag color="yellow" style={{fontSize:"13px",padding:"13px"}}>{text.toUpperCase()}</Tag>
                        )
                    case "compra-directa":
                        return (
                            <Tag color="red" style={{fontSize:"13px",padding:"13px"}}>COMPRA-DIRECTA</Tag>
                        )
                }
            }
		},
		{
			title:<p className="titulo-descripcion text-success">Fecha de creacion</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.fecha}</p>
            }
		},
		{
			title:<p className="titulo-descripcion text-success">Cantidad de productos ingresados</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.listaProductos.length}</p>
            }
		},
		{
			title:<p className="titulo-descripcion text-success">Detalles</p>,
			render:(text,record) => {
				return <a onClick={(e)=>{
					e.preventDefault();
					//Seteando la informacion para ver el registro en particular
					setInformacionRegistroParticular(record);
					setIsDrawerVisible(true);
				}} className="descripcion text-primary" href="">Datos completos de la entrada</a>
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
            case "compra-directa":
                return (
                    <ProductoCardAlmacen producto={producto} key={producto.id} tipo={"compra-directa"}/>
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
       return <SanzSpinner/> 
    }else{
        return (
            <>
                <div className="container p-5 text-center" style={{minHeight:"100vh"}}>
			        <div className="d-flex justify-content-end align-items-center my-3">
					    <Link to={"/almacen/ingresar"}><Button type="primary">Ingresar al almacen</Button></Link>
				    </div>
                    <p className="descripcion" style={{fontSize:"27px"}}>Entradas <b>totales</b> registradas en el almacen , donde podras generar <b>reportes</b> y ver <b>detalles</b> de cada una de las entradas.</p>
                    <div className="d-flex justify-content-center align-items-center gap-3 flex-column">
                        <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                            {isSearching ? <Button type='primary' danger onClick={limpiarFiltros}>Borrar filtros</Button> :<Button type="primary" onClick={()=>{setIsModalVisible(true)}}>Filtrar registros</Button>}
                            <Button type="primary" icon={<DownloadOutlined />} onClick={()=>{setIsReporte(true);setIsModalVisible(true)}}>Generar reporte de entradas</Button>
                        </div>
                    </div>
                    <Divider/>
				    <Table columns={columns} className="mt-3" dataSource={entradasRegistros} bordered/>
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
							        <Select.Option value="compra-directa">Compra directa</Select.Option>
              		            </Select>
                            </Form.Item>
                            {isReporte ? <Button type="primary" htmlType="submit">Descargar PDF</Button>:<Button type="primary" htmlType="submit">Aplicar filtros</Button>}
                        </Form>
                    </Modal>
                </div>
            </>
        )
    }
}
