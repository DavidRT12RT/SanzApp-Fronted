import { Button, Col, DatePicker, Divider, Drawer, Form, Input, Modal, Row, Select, Table, Tag } from 'antd'
import React, { useState, useEffect } from 'react'
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ReporteSalidas } from '../../../../../reportes/Productos/ReporteSalidas';
import { useLocation } from 'react-router-dom';
import { useSalidas } from '../../../../../hooks/useSalidas';
import { useObras } from '../../../../../hooks/useObras';
import { SanzSpinner } from '../../../../../helpers/spinner/SanzSpinner';
import { useEmpleados } from '../../../../../hooks/useEmpleados';
const { RangePicker } = DatePicker;

export const SalidasProducto = ({registros,informacionProducto}) => {
    const [registrosSalidas, setRegistrosSalidas] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleReporte, setIsModalVisibleReporte] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [informacionRetiro, setInformacionRetiro] = useState(null);
    const [form] = Form.useForm();
    const location = useLocation();
    //Informacion beneficiarios
    const [categorias, setCategorias] = useState([]);
    const {isLoading:isLoadingEmpleados,empleados} = useEmpleados();
	const {isLoading:isLoadingObras,obras} = useObras();

    useEffect(() => {
        setRegistrosSalidas([...registros.obra,...registros.merma,...registros.resguardo]);
    }, [registros]);

    const filtrarSalidas = async(values) => {
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
            if((moment(salida.fecha).isBetween(values.intervaloFecha[0].format("YYYY-MM-DD"),values.intervaloFecha[1].format("YYYY-MM-DD"))) && (values.tipo.includes(salida.tipo))){
                if(salida.tipo === "obra" && values.beneficiarioObra.includes(salida.beneficiario._id)) return salida;
                if(salida.tipo === "resguardo" && values.beneficiarioResguardo.includes(salida.beneficiario._id)) return salida;
            }
        });

        if(values.reporte){
            const blob = await pdf((
                <ReporteSalidas informacionProducto={informacionProducto} intervaloFecha={[values.intervaloFecha[0].format('YYYY-MM-DD'),values.intervaloFecha[1].format('YYYY-MM-DD')]}  salidas={salidasFiltradas} salidasCategorias={values.tipo} />
            )).toBlob();
            saveAs(blob,"reporte_salidas.pdf")
            setIsModalVisibleReporte(false);
        }else{
            setIsSearching(true);
            setRegistrosSalidas(salidasFiltradas);
            setIsModalVisible(false);
        }
    }

    const limpiarFiltros = () => {

        setIsSearching(false);
        setRegistrosSalidas([...registros.obra,...registros.merma,...registros.resguardo]);
        
    }
    
    const columns = [            
        {
            title:"Tipo de salida",
            key:"tipoSalida",
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
            title:"Beneficiario del producto",
            key:"beneficiario",
            dataIndex:"beneficiario",
            responsive: ["xs"],
            render:(text,record) => {
                switch (record.tipo) {
                    case "obra":
                        return (
                            <span>{record.beneficiario.titulo}</span>
                        )
                    
                    case "resguardo":
                        return (
                            <span>{record.beneficiario.nombre}</span>
                        )

                    case "merma":
                        return (
                            <span>Nadie</span>
                        )
                }
            }
        },
        {
            title:"Cantidad retirada",
            key:"cantidad",
            dataIndex:"cantidad"
        },
        {
            title:"Fecha del retiro",
            key:"fecha",
            dataIndex:"fecha"
        },
        {
            title:"Detalles",
            key:"detalles",
            dataIndex:"beneficiario",
            render: (text,record) => {
                return (
                    <a href="#" onClick={()=>{setInformacionRetiro(record);setIsDrawerVisible(true);}}>Ver mas detalles</a>
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

    const renderizarInformacionBeneficiario = () => {
        switch (informacionRetiro.tipo) {
            case "obra":
                return (
                    <>
                        <Row>
                            <Col span={12}><DescriptionItem title="Nombre de la obra" content={informacionRetiro.beneficiario.titulo}/></Col>
                            <Col span={12}><DescriptionItem title="Jefe de la obra" content={informacionRetiro.beneficiario.jefeObra}/></Col>
                        </Row>
                        <Row>
                            <Col span={12}><DescriptionItem title="Sucursal de la obra" content={informacionRetiro.beneficiario.sucursal}/></Col>
                            <Col span={12}><DescriptionItem title="Direccion regional de la obra" content={informacionRetiro.beneficiario.direccionRegional}/></Col>
                        </Row>
                        <Row>
                            <Col span={12}><DescriptionItem title="Tipo de reporte de la obra" content={informacionRetiro.beneficiario.tipoReporte}/></Col>
                            <Col span={12}><DescriptionItem title="Numero de track" content={informacionRetiro.beneficiario.numeroTrack}/></Col>
                        </Row>
                    </>
                )        
            case "resguardo":
                return (
                    <>
                        <Row>
                            <Col span={12}><DescriptionItem title="Nombre del empleado" content={informacionRetiro.beneficiario.nombre}/></Col>
                            <Col span={12}><DescriptionItem title="Correo electronico" content={informacionRetiro.beneficiario.correo}/></Col>
                        </Row>
                    </>
                )
            case "merma":
                return (
                    <p>Al ser merma no hay ninguna persona o obra que reciba el producto</p>
                );
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

    if(isLoadingObras || isLoadingEmpleados) 
        return <SanzSpinner/>
    else
        return (
        <>
            <div className="d-flex justify-content-start align-items-center flex-wrap gap-2 mb-3">
                {isSearching ? <Button type="primary" danger onClick={limpiarFiltros}>Borrar filtros</Button> : <Button type="primary" onClick={()=>{setIsModalVisible(true)}}>Filtrar registros</Button>}
                {location.pathname.startsWith("/almacen") && <Button type="primary" onClick={()=>{setIsModalVisibleReporte(true)}}>Crear reporte de salidas</Button>}
            </div>
            <Table columns={columns} dataSource={registrosSalidas} pagination={{pageSize:4}} size="large" bordered/>
            {/*El usuario seteo informacion de algun retiro es decir vera el drawer*/}
            {informacionRetiro != null && (
                <Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);setInformacionRetiro(null)}} visible={isDrawerVisible}>
                    <p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada del retiro</p>
                    <p className="site-description-item-profile-p">Informacion sobre el beneficiario</p>
                    {/*Informacion acerca del beneficiario */}
                    {renderizarInformacionBeneficiario()}
                    <Divider/>
                    {/*Informacion sobre la cantidad y motivo del retiro del producto del almacen*/}
                    <p className="site-description-item-profile-p">Detalles del retiro</p>
                    <Row>
                        <Col span={12}><DescriptionItem title="Fecha del retiro" content={informacionRetiro.fecha}/></Col>
                        <Col span={12}><DescriptionItem title="Cantidad retirada del producto" content={informacionRetiro.cantidad}/></Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem title="Motivo del retiro" content={informacionRetiro.motivo}/>
                        </Col>
                    </Row>
                    {informacionRetiro.evidencia && (
                        <>
                            <Divider/>
                            <p>Evidencia del producto</p>
                        </>
                    )}
                    <Divider/>
                </Drawer>
            )}
            <Modal visible={isModalVisible} footer={null} onCancel={()=>{setIsModalVisible(false)}} onOk={()=>{setIsModalVisible(false)}}>
                <Form onFinish={filtrarSalidas} layout="vertical" form={form}>
                    <h1 className="titulo" style={{fontSize:"30px"}}>Filtrar los registros</h1>
                    <Form.Item label="Intervalo de fecha" name="intervaloFecha" rules={[{required: true,message: 'Ingresa un intervalo de fecha!',},]}>
                        <RangePicker locale={locale} size="large" style={{width:"100%"}}/>
                    </Form.Item>

                    <Form.Item label="Tipo de salida" name="tipo" rules={[{required: true,message: 'Ingresa un tipo de salida!',},]}>
                		<Select mode="multiple" placeholder="Tipo de salida..." size="large" onChange={(e)=>{setCategorias(e)}}>
							<Select.Option value="obra">Obra</Select.Option>
							<Select.Option value="resguardo">Resguardo</Select.Option>
							<Select.Option value="merma">Merma</Select.Option>
              		    </Select>
                    </Form.Item>
                    {renderizarOpcionesBeneficiario()}
                    <p className="text-muted">(NO seleccionar ningun beneficiario en alguna categoria regresara todos los registros de esa categoria)</p>

                    <Button type="primary" htmlType="submit" size="large">Filtrar salidas</Button>
                </Form>

            </Modal>

            <Modal visible={isModalVisibleReporte} footer={null} onCancel={()=>{setIsModalVisibleReporte(false)}} onOk={()=>{setIsModalVisibleReporte(false)}}>
                <Form onFinish={(values)=>{values.reporte = true; filtrarSalidas(values)}} layout="vertical" form={form}>
                    <h1 className="titulo" style={{fontSize:"30px"}}>Filtrar los registros del reporte</h1>
                    <p className="descripcion">Marca en las siguientes casillas que informacion quieras que contengan el reporte de salidas del producto</p>
                    <Form.Item label="Intervalo de fecha" name="intervaloFecha" rules={[{required: true,message: 'Ingresa un intervalo de fecha!',},]}>
                        <RangePicker locale={locale} size="large" style={{width:"100%"}}/>
                    </Form.Item>

                    <Form.Item label="Tipo de salida" name="tipo" rules={[{required: true,message: 'Ingresa un tipo de salida!',},]}>
                		<Select mode="multiple" placeholder="Tipo de salida..." size="large" onChange={(e)=>{setCategorias(e)}}>
							<Select.Option value="obra">Obra</Select.Option>
							<Select.Option value="resguardo">Resguardo</Select.Option>
							<Select.Option value="merma">Merma</Select.Option>
              		    </Select>
                    </Form.Item>
                    {renderizarOpcionesBeneficiario()}
                    <p className="text-muted">(NO seleccionar ningun beneficiario en alguna categoria regresara todos los registros de esa categoria)</p>

                    <Button type="primary" htmlType="submit" size="large">Descargar PDF</Button>
                </Form>
            </Modal>
        </>
    )
}
