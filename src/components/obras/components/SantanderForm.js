import { Form, Row,Col,Input, Tag, Select, InputNumber, Space, message } from 'antd'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { fetchConToken } from '../../../helpers/fetch';

export const SantanderForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

	const onFinish = async ( values ) => {
        try {
			const resp = await fetchConToken("/obras/",values,"POST"); 
            const body = await resp.json();
            if(resp.status === 200){
                message.success("Obra creada con exito!");
                navigate(`/aplicacion/obra/editor/${body.obra._id}`);
            }
		} catch (error) {
            console.log(error); 
		}
	}

	return (
		<div className='p-lg-5'>
			<span>Campos con <Tag color="red">*</Tag>son obligatorios.</span>
				<Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish} className="mt-3">
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item 
								name="titulo" 
								tooltip="Ingresa el titulo que llevara la obra o servicio"
								label="Titulo del servicio "
								rules={[
								{
									required:true,
									message:"Debes ingresar el nombre de la obra o servicio!",
									whitespace: true
								}
								]}
							>
								<Input placeholder="Obra santander boulevard..."/>
							</Form.Item>
						</Col>

					    <Col span={12}>
						    <Form.Item
								    name="tipoReporte"
								    label="Tipo de reporte"
								    tooltip="Marca que tipo de trabajo se hara"
								    rules={[
									    {
										    required: true,
										    message: 'La obra / servicio necesita tener este parametro',
									    },
								    ]}
						    >
							    <Select placeholder="¿Que tipo de reporte es?">
								    <Select.Option value="correctivo">Correctivo</Select.Option>
								    <Select.Option value="preventivo">Preventivo</Select.Option>
							    </Select>
					        </Form.Item>
				        </Col>

						<Col span={12}>
							<Form.Item 
								label="Numero track" 
								name="numeroTrack"
								tooltip="Numero track"
							>
							<InputNumber style={{width: "100%"}} min={1} />
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item 
									name="plaza" 
									tooltip="Ingresa la plaza"
									label="Plaza" 
									rules={[
										{
											required:true,
											message:"Debes ingresar la plaza!",
											whitespace: true
										}
									]}
							>
								<Input placeholder=""/>
							</Form.Item>
					    </Col>

					    <Col span={24}>
							<Form.Item 
								label="Descripción de la obra"
								name="descripcion"
								tooltip="Ingresa una descripción corta sobre la obra / servicio"
								rules={[
									{
										required:true,
										message:"Debes ingresar una descripción",
										whitespace:true
									}
								]}
							>
								<Input.TextArea allowClear showCount minLength={20} maxLength={60} style={{width:"100%"}} placeholder="Descripción del producto" />
							</Form.Item>
					    </Col>

					    <Col span={12}>
							<Form.Item 
									name="direccionRegional" 
									tooltip="Ingresa la dirección reginal del trabajo!"
									label="Dirección regional"
									rules={[
										{
											required:true,
											message:"Ingresa la dirección regional",
											whitespace: true
										}
									]}
							>
								<Input placeholder=""/>
							</Form.Item>
					    </Col>

					    <Col span={12}>
							<Form.Item 
									name="sucursal" 
									tooltip="Ingresa la sucursal donde se realizara el trabajo"
									label="Sucursal del servicio"
									rules={[
										{
											required:true,
											message:"Ingresa la sucursal del servicio!",
											whitespace: true
										}
									]}
							>
								<Input placeholder=""/>
							</Form.Item>
					    </Col>

					    <Col span={12}>
					        <Form.Item
        						name="jefeObra"
						        rules={[{ required: true, message: 'Selecciona el jefe de la obra / servicio!'}]}
						        tooltip="Ingresa el jefe de este servicio..."
						        label="Jefe de obra"
					        >
						        <Select placeholder="Jefe de obra...">
							        <Select.Option value="ferreteria">Ferreteria</Select.Option>
							        <Select.Option value="vinilos">Vinilos</Select.Option>
							        <Select.Option value="herramientas">Herramientas</Select.Option>
							        <Select.Option value="pisosAzulejos">Pisos y azulejos</Select.Option>
							        <Select.Option value="Fontaneria">Fontaneria</Select.Option>
							        <Select.Option value="Iluminacion">Iluminación</Select.Option>
							        <Select.Option value="electrico">Material electrico</Select.Option>
					            </Select>
				            </Form.Item>
				        </Col>

				        <Col span={12}>
    						<Form.Item
								    name="estadoReporte"
								    label="Estado reporte"
								    tooltip="Marca en que estado se encuentra el reporte"
						    >
							    <Select placeholder="Nuevo">
								    <Select.Option value="nuevo">Nuevo</Select.Option>
								    <Select.Option value="enProceso">En proceso</Select.Option>
								    <Select.Option value="finalizado">Finalizado</Select.Option>
							    </Select>
					        </Form.Item>
				        </Col>

				        <Col span={12}>
						    <Link to="/aplicacion/obras/" className='btn btn-outline-danger rounded p-md-3 mt-4'><i className="fa-solid fa-xmark"></i>   Cancelar registro </Link>
					    </Col>

					    <Col span={12}>
						    <Space direction="horizontal" style={{width: '100%', justifyContent: 'end'}}>
						        <button className='btn btn-outline-warning rounded p-md-3 mt-4' type="submit">Registrar servicio  <i className="fa-solid fa-arrow-right"></i> </button>
						    </Space>
					    </Col>
				    </Row>
				</Form>
			</div>
		)
}
