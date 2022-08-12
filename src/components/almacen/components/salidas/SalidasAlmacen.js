import { Button, Col, DatePicker, Divider, Drawer, Dropdown, Form, Input, Menu, message, Modal, Row, Select, Table, Tag } from 'antd'
import { DownloadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { fetchConToken } from '../../../../helpers/fetch';
import { useSalidas } from '../../../../hooks/useSalidas';
import { Loading } from '../../../obras/Loading';
import { ProductoCardAlmacen } from './ProductoCardAlmacen';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { useObras } from '../../../../hooks/useObras';
import { useEmpleados } from '../../../../hooks/useEmpleados';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import "./assets/styles.css";
import { ReporteSalidasAlmacen } from '../../../../reportes/Almacen/ReporteSalidasAlmacen';
import { Link } from 'react-router-dom';
const { Search } = Input;
const { RangePicker } = DatePicker;


export const SalidasAlmacen = () => {

	//Hooks personalizados
    const { isLoading,salidas} = useSalidas();
	const {isLoading:isLoadingObras,obras} = useObras();
	const { isLoading:isLoadingEmpleados,empleados } = useEmpleados();
	const [categorias, setCategorias] = useState([]);
	//Hooks react
    const [registrosSalidas, setRegistrosSalidas] = useState([]);
	const [isSearching, setIsSearching] = useState(false);
	//State para informacion de un registro en particular selecciona por el usuario
	const [informacionRegistroParticular, setInformacionRegistroParticular] = useState(null);
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [isReporte, setIsReporte] = useState(false);
    const [form] = Form.useForm();


    useEffect(() => {
		salidas.map(registro => registro.key = registro._id);
        setRegistrosSalidas(salidas)
    }, [salidas]);
   
	const columns = [
		{
			title:<p className="titulo-descripcion text-danger">Tipo de salida</p>,
			dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "obra":
                        return (
                            <Tag color="green" style={{fontSize:"13px",padding:"13px"}}>OBRA</Tag>
                        )
                    case "resguardo":
                        return (
                            <Tag color="yellow" style={{fontSize:"13px",padding:"13px"}}>RESGUARDO</Tag>
                        )
                    case "merma":
                        return (
                            <Tag color="red" style={{fontSize:"13px",padding:"13px"}}>MERMA</Tag>
                        )
                }
            }
		},
		{
			title:<p className="titulo-descripcion text-danger">Fecha creacion</p>,
			render:(text,record) => {
				return <p className="descripcion">{record.fechaCreacion}</p>
			}

		},
		{
			title:<p className="titulo-descripcion text-danger">Beneficiario</p>,
			render:(text,record) => {
				switch (record.tipo) {
					case "resguardo":
						return (<p className="descripcion">{record.beneficiarioResguardo.nombre}</p>);
					case "obra":
						return (<p className="descripcion">{record.beneficiarioObra.titulo}</p>);
					case "merma":
						return (<p className="descripcion">Nadie por ser merma</p>)
				}
			}
		},
		{
			title:<p className="titulo-descripcion text-danger">Detalles</p>,
			render:(text,record) => {
				return <a onClick={(e)=>{
					e.preventDefault();
					//Seteando la informacion para ver el registro en particular
					setInformacionRegistroParticular(record);
					setIsDrawerVisible(true);
				}} href="" className="descripcion text-primary">Datos completos de la salida</a>
			}
		}
	];

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );

	const renderizarInformacionBeneficiario = () => {
		switch (informacionRegistroParticular.tipo) {
			case "obra":
				return (
                    <>
                        <Row>
                            <Col span={12}><DescriptionItem title="Nombre de la obra" content={informacionRegistroParticular.beneficiarioObra.titulo}/></Col>
                            <Col span={12}><DescriptionItem title="Jefe de la obra" content={informacionRegistroParticular.beneficiarioObra.jefeObra}/></Col>
                        </Row>
                        <Row>
                            <Col span={12}><DescriptionItem title="Sucursal de la obra" content={informacionRegistroParticular.beneficiarioObra.sucursal}/></Col>
                            <Col span={12}><DescriptionItem title="Direccion regional de la obra" content={informacionRegistroParticular.beneficiarioObra.direccionRegional}/></Col>
                        </Row>
                        <Row>
                            <Col span={12}><DescriptionItem title="Tipo de reporte de la obra" content={informacionRegistroParticular.beneficiarioObra.tipoReporte}/></Col>
                            <Col span={12}><DescriptionItem title="Numero de track" content={informacionRegistroParticular.beneficiarioObra.numeroTrack}/></Col>
                        </Row>
                        <Row>
                            <Col span={12}><DescriptionItem title="Estado de la obra" content={informacionRegistroParticular.beneficiarioObra.estadoReporte}/></Col>
                            <Col span={12}><DescriptionItem title="Plaza de la obra" content={informacionRegistroParticular.beneficiarioObra.plaza}/></Col>
                        </Row>
						<Row>
							<Col span={24}>
                            	<DescriptionItem title="Descripcion de la obra" content={informacionRegistroParticular.beneficiarioObra.descripcion}/>
							</Col>
						</Row>
                    </>
				)
            case "resguardo":
                return (
                    <>
                        <Row>
                            <Col span={12}><DescriptionItem title="Nombre del empleado" content={informacionRegistroParticular.beneficiarioResguardo.nombre}/></Col>
                            <Col span={12}><DescriptionItem title="Correo electronico" content={informacionRegistroParticular.beneficiarioResguardo.correo}/></Col>
                        </Row>
                    </>
                )
            case "merma":
                return (
                    <p>Al ser merma no hay ninguna persona o obra que reciba el producto</p>
                );
		}
	}

    const handleDownloadEvidencia = async () => {
        try {
            const resp = await fetchConToken("/salidas/documento-pdf",{salidaId:informacionRegistroParticular._id},"POST");
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',`${informacionRegistroParticular._id}.pdf`);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    const renderizarOpcionesBeneficiario = () => {
        if(categorias.includes("resguardo") && categorias.includes("obra")){
            return (
                <>
                    <Form.Item label="Selecciona el empleado" name="beneficiarioResguardo">
                        <Select mode="multiple" placeholder="Selecciona el empleado" size="large">
				            {empleados.map(empleado => {
					            return (
							        <Select.Option key={empleado.uid} value={empleado.uid}>{empleado.nombre}</Select.Option>
						        )
					        })}
              	        </Select>
                    </Form.Item>
                    
                    <Form.Item label="Selecciona la obra" name="beneficiarioObra">
                        <Select mode="multiple" placeholder="Selecciona la obra" size="large">
				            {obras.map(obra => {
					            return (
						            <Select.Option key={obra._id} value={obra._id}>{obra.titulo}</Select.Option>
					            )
				            })}
                        </Select>
                    </Form.Item>
                </>
            )
        }
        if(categorias.includes("obra")){
            return (
                <Form.Item label="Selecciona la obra" name="beneficiarioObra">
                    <Select placeholder="Selecciona la obra" size="large">
				        {obras.map(obra => {
					        return (
						        <Select.Option key={obra._id} value={obra._id}>{obra.titulo}</Select.Option>
					        )
				        })}
                    </Select>
                </Form.Item>
            )
        }
        if(categorias.includes("resguardo")){
            return (
                <Form.Item label="Selecciona el empleado" name="beneficiarioResguardo">
                    <Select placeholder="Selecciona el empleado" size="large">
				        {empleados.map(empleado => {
					        return (
							    <Select.Option key={empleado.uid} value={empleado.uid}>{empleado.nombre}</Select.Option>
						    )
					    })}
              	    </Select>
                </Form.Item>
           )
        }
    }

	const filtrarRegistros = async(values) => {
        let salidasFiltradas = [];

        if((values.beneficiarioObra === undefined || values.beneficiarioObra.length === 0) && values.tipo.includes("obra")){
            //Buscara por todas las obras
            values.beneficiarioObra = obras.map(obra => obra._id);
        }
        
        if((values.beneficiarioResguardo === undefined || values.beneficiarioResguardo.length === 0) && values.tipo.includes("resguardo")){
            //Buscara por todos los empleados 
            values.beneficiarioResguardo = empleados.map(empleado => empleado.uid);
        }

        salidasFiltradas = registrosSalidas.filter(salida => {
            if((moment(salida.fechaCreacion).isBetween(values.intervaloFecha[0].format("YYYY-MM-DD"),values.intervaloFecha[1].format("YYYY-MM-DD"))) && (values.tipo.includes(salida.tipo))){
                if(salida.tipo === "obra" && values.beneficiarioObra.includes(salida.beneficiarioObra._id)) return salida;
                if(salida.tipo === "resguardo" && values.beneficiarioResguardo.includes(salida.beneficiarioResguardo._id)) return salida;
            }
        });
		if(isReporte){
            const blob = await pdf((
				<ReporteSalidasAlmacen intervaloFecha={[values.intervaloFecha[0].format('YYYY-MM-DD'),values.intervaloFecha[1].format('YYYY-MM-DD')]} categorias={values.tipo} salidas={salidasFiltradas}/>
            )).toBlob();
            saveAs(blob,"reporte_salidas.pdf")
			setIsReporte(false);
		}else{
			setRegistrosSalidas(salidasFiltradas);
			setIsSearching(true);
		}
		setIsModalVisible(false);
	}

	const limpiarFiltros = () => {
		setIsSearching(false);
		setRegistrosSalidas(salidas);
	}

	const filtrarSalidaPorCodigo = (values) => {
		const salidaFiltrada = salidas.filter(salida => salida._id === values);
		setRegistrosSalidas(salidaFiltrada);
	}

	if(isLoading || isLoadingEmpleados || isLoadingObras){
		return <Loading/>
	}else{
		return (				
			<>

             	<div className="container text-center p-5"  style={{minHeight:"100vh"}}>
					<div className="d-flex justify-content-end align-items-center my-3">
						<Link to={"/almacen/retirar"}><Button type="primary">Retirar del almacen</Button></Link>
					</div>
					<p className="descripcion" style={{fontSize:"27px"}}>Salidas <b>totales</b> que se han registrado en el almacen , aqui podras hacer <b>reportes</b> sobre las salidas y ver <b>detalles</b> sobre cada una de las salidas.</p>

					<div className="d-flex justify-content-center gap-3 flex-wrap align-items-center mt-3">
	                    <Search
                    	    placeholder="Ingresa el codigo de barras de la salida"
                    	    allowClear
                    	    autoFocus
                    	    enterButton="Buscar"
							size="large"
							onSearch={filtrarSalidaPorCodigo}
							onChange={(e)=>{
								if(e.target.value === "") return setRegistrosSalidas(salidas);
							}}
                	    /> 
                		{isSearching ? <Button type="primary" danger onClick={limpiarFiltros}>Borrar filtros</Button> : <Button type="primary" onClick={()=>{setIsModalVisible(true)}}>Filtrar registros</Button>}
						<Button type="primary" icon={<DownloadOutlined />} onClick={()=> {setIsReporte(true);setIsModalVisible(true)}}>Generar reporte de salidas</Button>
					</div>
					<Divider/>
					<Table columns={columns} className="mt-3" dataSource={registrosSalidas} bordered/>
				</div>

				<Modal footer={null} onCancel={()=>{setIsModalVisible(false);setIsReporte(false)}} onOk={()=>{setIsModalVisible(false);setIsReporte(false)}} visible={isModalVisible}>
					{isReporte ? <h1 className="titulo"  style={{fontSize:"30px"}}>Filtrar registros del reporte</h1> : <h1 className="titulo" style={{fontSize:"30px"}}>Filtrar registros</h1>}
					{isReporte ? <p className="descripcion">Filtrar los registros que tendra el reporte.</p> : <p className="descripcion">Filtrar los registros de las salidas.</p>}	


					<Form onFinish={filtrarRegistros} layout="vertical" form={form}>
						<Form.Item name="intervaloFecha" label="Intervalo de fecha del registro(s)" rules={[{required: true,message: 'Ingresa la fecha del filtro',},]}>
                			<RangePicker size="large" locale={locale} />
						</Form.Item>
                    	<Form.Item label="Tipo de salida" name="tipo" rules={[{required: true,message: 'Ingresa un tipo de salida!',},]}>
                			<Select mode="multiple" placeholder="Tipo de salida..." size="large" onChange={(e)=>{setCategorias(e)}}>
								<Select.Option value="obra">Obra</Select.Option>
								<Select.Option value="resguardo">Resguardo</Select.Option>
								<Select.Option value="merma">Merma</Select.Option>
              				</Select>
            			</Form.Item>
						{renderizarOpcionesBeneficiario()}
						<p>(Por defecto la fecha sera la del mes actual)</p>
						{isReporte ? <Button type="primary" htmlType="submit">Descargar PDF</Button>: <Button type="primary" htmlType="submit">Aplicar filtros</Button>}
					</Form>
				</Modal>

				{informacionRegistroParticular != null && (
					<Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);}} visible={isDrawerVisible}>
                    	<p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada de la salida de almacen</p>
                    	<p className="site-description-item-profile-p">Informacion sobre el beneficiario</p>
						{renderizarInformacionBeneficiario()}
						<Divider/>
                    	<p className="site-description-item-profile-p">Informacion sobre el retiro del almacen</p>
						<Row>
                       		<Col span={12}><DescriptionItem title="Fecha de la salida" content={informacionRegistroParticular.fechaCreacion}/></Col>
                            <Col span={12}><DescriptionItem title="Tipo de la salida" content={informacionRegistroParticular.tipo}/></Col>
						</Row>
						<Row>
                       		<Col span={24}><DescriptionItem title="Motivo de la salida" content={informacionRegistroParticular.motivo}/></Col>
						</Row>
						<Divider/>
                    	<p className="site-description-item-profile-p">Lista de productos retirados del almacen</p>
                        <div className="d-flex justify-content-center align-items-center container p-5 gap-2 flex-column">
							{
								informacionRegistroParticular.listaProductos.length > 0 
								? 
									informacionRegistroParticular.listaProductos.map(producto => {
                                    	return <ProductoCardAlmacen key={producto.id._id} producto={producto} tipo={"retirado"}/>
									})
								:
                                	<h2 className="fw-bold text-white text-center bg-success p-3">Todos los productos han sido devueltos!</h2>
							}
						</div>
						<Divider/>
                    	<p className="site-description-item-profile-p">Devoluciones al almacen</p>
						{informacionRegistroParticular.productosDevueltos.length === 0 && <p className="text-danger">
							Ningun producto devuelto al almacen por el momento...</p>}
						{
							informacionRegistroParticular.productosDevueltos.map(entrada => {
								{
									return (
										<div className="d-flex justify-content-center align-items-center flex-column gap-2">
											<p className="text-success text-center mt-3">Fecha de devolucion<br/>{entrada.fecha}</p>
											{
												entrada.listaProductos.map(productoDevuelto => {
													return <ProductoCardAlmacen producto={productoDevuelto} key={productoDevuelto._id} tipo={"devuelto"}/>
												})
											}
										</div>
									)
								}
							})
						}
						<Divider/>
						{/* 
						<p className="site-description-item-profile-p">Documento PDF de la salida</p>
						<Button type="primary" onClick={handleDownloadEvidencia}>Descargar documento de evidencia</Button>
						*/}
						<p className="site-description-item-profile-p">Detalles completos de la salida</p>
						<Link to={`/almacen/salidas/${informacionRegistroParticular._id}/`}><Button type="primary">Ir a la pagina de la salida</Button></Link>
                	</Drawer>
				)}
			</>
    	)
	}
}
