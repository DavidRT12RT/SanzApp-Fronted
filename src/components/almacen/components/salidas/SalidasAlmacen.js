import { Button, Col, DatePicker, Divider, Drawer, Dropdown, Form, Input, Menu, message, Modal, Row, Select, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { fetchConToken } from '../../../../helpers/fetch';
import { useSalidas } from '../../../../hooks/useSalidas';
import { Loading } from '../../../obras/Loading';
import { ProductoCardAlmacen } from './ProductoCardAlmacen';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { useObras } from '../../../../hooks/useObras';
import { useEmpleados } from '../../../../hooks/useEmpleados';
const { Search } = Input;
const { RangePicker } = DatePicker;


export const SalidasAlmacen = () => {

    const startOfMonth = moment().startOf('month').locale('es').format("YYYY-MM-DD");
    const endOfMonth   = moment().endOf('month').locale('es').format("YYYY-MM-DD");
	//Hooks personalizados
    const { isLoading,salidas} = useSalidas();
	const {isLoading:isLoadingObras,obras} = useObras();
	const { isLoading:isLoadingEmpleados,empleados } = useEmpleados();
	//Hooks react
    const [salidasRegistros, setSalidasRegistros] = useState([]);
	//State para informacion de un registro en particular selecciona por el usuario
	const [informacionRegistroParticular, setInformacionRegistroParticular] = useState(null);
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [isModalFiltradorVisible, setIsModalFiltradorVisible] = useState(false);
	const [categoria, setCategoria] = useState(null);
    const [form] = Form.useForm();


    useEffect(() => {
        salidas.map(registro => registro.key = registro._id);
        setSalidasRegistros(salidas)
    }, [salidas]);
   
	const columns = [
		{
			title:"Tipo de la salida",
			dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "obra":
                        return (
                            <Tag color="green">OBRA</Tag>
                        )
                    case "resguardo":
                        return (
                            <Tag color="yellow">RESGUARDO</Tag>
                        )
                    case "merma":
                        return (
                            <Tag color="red">MERMA</Tag>
                        )
                }
            }
		},
		{
			title:"Motivo de la salida",
			dataIndex:"motivo"
		},
		{
			title:"Fecha creacion",
			dataIndex:"fechaCreacion"
		},
		{
			title:"Beneficiario",
			render:(text,record) => {
				switch (record.tipo) {
					case "resguardo":
						return (<span>{record.beneficiarioResguardo.nombre}</span>);
					case "obra":
						return (<span>{record.beneficiarioObra.titulo}</span>)
					case "merma":
						return (<span>Nadie por ser merma</span>)
				}
			}
		},
		{
			title:"Detalles",
			render:(text,record) => {
				return <a onClick={(e)=>{
					e.preventDefault();
					//Seteando la informacion para ver el registro en particular
					setInformacionRegistroParticular(record);
					setIsDrawerVisible(true);
				}} href="">Datos completos de la salida</a>
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
		switch (categoria) {
			case "obra":
				return (
                	<Select placeholder="Selecciona la obra" size="large">
						{obras.map(obra => {
							return (
								<Select.Option key={obra._id} value={obra._id}>{obra.titulo}</Select.Option>
							)
						})}
              		</Select>
				)
			case "resguardo":
				return (
                	<Select placeholder="Selecciona el empleado" size="large">
						{empleados.map(empleado => {
							return (
								<Select.Option key={empleado.uid} value={empleado.uid}>{empleado.nombre}</Select.Option>
							)
						})}
              		</Select>
				)
		}
	}

	const filtrarRegistros = (values) => {
		setCategoria(null);
		setIsModalFiltradorVisible(false);
		if(values.fecha === undefined || values.fecha === null){
			//Usaremos la del mes
			const nuevosRegistros = salidas.map(salida => {
				if(values.beneficiario === undefined) values.beneficiario = salida.beneficiario;
				if(moment(salida.fechaCreacion).isBetween(startOfMonth,endOfMonth) && (salida.tipo === values.categoria ) && (salida.beneficiarioObra === values.beneficiario || salida.beneficiarioResguardo === values.beneficiario)){
					return salida;
				}
			})
			return setSalidasRegistros(nuevosRegistros);
		}else{
			//Usaremos la que nos mando el usuario
			const nuevosRegistros = salidas.map(salida => {
				if(values.beneficiario === undefined) values.beneficiario = salida.beneficiario;
				if(moment(salida.fechaCreacion).isBetween(values.fecha[0],values.fecha[1]) && (salida.tipo === values.categoria) && (salida.beneficiarioObra === values.beneficiario || salida.beneficiarioResguardo === values.beneficiario)){
					return salida;
				}
			})
			return setSalidasRegistros(nuevosRegistros);
		}
	}

	if(isLoading && isLoadingEmpleados && isLoadingObras){
		return <Loading/>
	}else{
		return (
        	<>
            	<div className="d-flex mt-5 align-items-center flex-column gap-2" style={{height:"100vh",width:"100vw"}}>				
                	<h1 className="display-5 fw-bold">Salidas del almacen</h1>
                	<span className="d-block text-center">
						Aqui se mostraran el recuento total de todas los registros de las salidas de el almacen, donde podras <br/>checar
						detalles como el beneficiario ,fecha ,motivo ,etc.
                	</span>

                    <div className="container p-5 d-flex gap-2 justify-content-center align-items-center mt-3 flex-column">
						<Table columns={columns} dataSource={[...salidasRegistros.slice(0,5)]} bordered/>
                    </div>

                    <div className="container p-5 d-flex gap-2 justify-content-center align-items-center mt-3 flex-column ">
						<div className="d-flex justify-content-center gap-2 flex-wrap align-items-center">
	                		<Search
                    			placeholder="Ingresa el codigo de barras de la salida..."
                    			allowClear
                    			autoFocus
                    			enterButton="Buscar"
								size="large"
                			/> 
							 <div className="d-flex justify-content-center gap-3 flex-wrap align-items-center mt-3">
								<Button type="primary" size="large" onClick={()=>{setIsModalFiltradorVisible(true)}}>Filtrar registros</Button>
								<Button type="primary" danger size="large" onClick={()=>{setSalidasRegistros(salidas)}}>Limpiar filtros</Button>
							 </div>
						</div>
						<Table columns={columns} className="mt-3" dataSource={salidasRegistros} bordered/>
						{informacionRegistroParticular != null && (
							<Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);}} visible={isDrawerVisible}>
                    			<p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada de la salida de almacen</p>
                    			<p className="site-description-item-profile-p">Informacion sobre el beneficiario</p>
								{renderizarInformacionBeneficiario()}
								<Divider/>
                    			<p className="site-description-item-profile-p">Informacion sobre el retiro del almacen</p>
								<Row>
                       				<Col span={12}><DescriptionItem title="Fecha de la salida" content={informacionRegistroParticular.fecha}/></Col>
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
								{
									informacionRegistroParticular.productosDevueltos.map(entrada => {
										{
											return (
												<div className="d-flex justify-content-center align-items-center flex-wrap">
													<p className="text-success text-center mt-3">Fecha de devolucion<br/>{entrada.fecha}</p>
													{
														entrada.listaProductos.map(productoDevuelto => {
															//return <ProductoCardDevuelto producto={productoDevuelto} key={productoDevuelto._id}/>
															return <ProductoCardAlmacen producto={productoDevuelto} key={productoDevuelto._id} tipo={"devuelto"}/>
														})
													}
												</div>
											)
										}
									})
								}
								<Divider/>
                    			<p className="site-description-item-profile-p">Documento PDF de la salida</p>
								<Button type="primary" onClick={handleDownloadEvidencia}>Descargar documento de evidencia</Button>
                			</Drawer>
						)}
                    </div>
				</div>
				<Modal footer={null} onCancel={()=>{setIsModalFiltradorVisible(false)}} visible={isModalFiltradorVisible}>
					<h2 className="fw-bold">Filtrar registros</h2>
					<Form onFinish={filtrarRegistros} layout="vertical">
						<Form.Item name="categoria" label="Categoria de el registro" >
                			<Select placeholder="Obra,resguardo,etc." size="large" onChange={(e)=>{setCategoria(e)}}>
								<Select.Option value="obra">Obra</Select.Option>
								<Select.Option value="resguardo">Resguardo</Select.Option>
								<Select.Option value="merma">Merma</Select.Option>
              				</Select>
            			</Form.Item>
						{categoria != null && 
						 	<>
								<Form.Item name="beneficiario" label="Beneficiario">
									{renderizarOpcionesBeneficiario()}
								</Form.Item>
								<p>(Por defecto seran todas las salidas de la categoria marcada)</p>
							</>
						}
						<Form.Item name="fecha" label="Intervalo de fecha del registro(s)">
                			<RangePicker size="large" locale={locale} />
						</Form.Item>
						<p>(Por defecto la fecha sera la del mes actual)</p>
						<Button type="primary" htmlType="submit">Aplicar filtros</Button>
					</Form>
				</Modal>
        	</>
    	)
	}

}
