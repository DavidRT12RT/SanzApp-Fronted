import { Button, Form, Input, InputNumber, message, Modal, Result, Select, Tag, Upload } from 'antd'
import React, { useState } from 'react'
import { Row, Col } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import { fetchConTokenSinJSON } from '../../../../helpers/fetch';
import { useCategorias } from '../../../../hooks/useCategorias';
const { confirm } = Modal;

export const RegistrarProducto = () => {
    const [form] = Form.useForm();
	const [uploading, setUploading] = useState(false);
	const [filesList, setFilesList] = useState([]);
	const [finish, setFinish] = useState(false);
	const { isLoading,categorias } = useCategorias()

    const {uid,name} = useSelector((state) => state.auth);

    const props = {
        onRemove : file => {
            setFilesList([]);
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma función*/
        },
        beforeUpload: file => {
            //Verificar que el fileList sea menos a 2 
            if(filesList.length < 1){
                setFilesList(files => [...files,file]);
            }else{
                message.error("Solo puedes subir 1 archivo en total");
            }
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            return false;
        },
        listType:"picture",
        maxCount:2,
        fileList : filesList
    };


    //Crear un nuevo producto
    const onFinish = async ( values ) =>{                    

		confirm({
            title:"¿Seguro quieres registrar un nuevo producto?",
            icon:<ExclamationCircleOutlined />,
            content:"El producto sera registrado dentro del almacen y podra ser usado para salidas a obras y resguardos.",
			okText:"Registrar",
			cancelText:"Volver atras",
            async onOk(){
				setUploading(true);
        		const formData = new FormData();
				formData.append("nombre",values.nombre);
				formData.append("cantidad",values.cantidad);
				formData.append("descripcion",values.descripcion);
				formData.append("marcaProducto",values.marcaProducto);
				formData.append("categorias",JSON.stringify(values.categorias));
				formData.append("costo",values.costo);
				formData.append("estadoProducto",values.estadoProducto);
				formData.append("usuarioCreador",uid);
				formData.append("unidad",values.unidad);
				formData.append("inventariable",values.inventariable);
        		filesList.forEach(file => {
            		formData.append("archivo",file);
        		});
				//Emitir evento al backend de crear nuevo producto!
				try {
					const resp = await fetchConTokenSinJSON("/productos",formData,"POST");
					const body = await resp.json();
					if(resp.status === 201){
						message.success("Producto creado con exito!");
						return setFinish(true);
						//navigate(`/almacen/productos/${body._id}`);
					}else{
						return message.error(body.msg);
					}
				} catch (error) {
					message.error("Error creando el producto!");	
				}
				setUploading(false);
				setFilesList([]);
				form.resetFields();
           	},
        });
    }


    
	if(finish){
		return (
			<Result
    			status="success"
    			title="Producto creado con exito!"
    			subTitle="Producto creado con exito y ya disponible para entradas y salidas.!"
    			extra={[<Link to={`/almacen/productos/`}><Button type="primary" key="console">Ver producto</Button></Link>,<Button onClick={()=>{setFinish(false)}}>Registrar un nuevo producto</Button>,]}
			/>
		)
	}else{
		//Cargando categorias totales
	    return (
			<div className="container p-5 shadow rounded">
				<div className="d-flex justify-content-end">
                	<img src={require("../../../auth/assets/logo.png")} width="100" alt="logo"/>
            	</div>
        		<h2 className="fw-bold text-center py-lg-5 py-3">Registrar un nuevo producto</h2>
        		<span>Campos con <Tag color="red">*</Tag>son obligatorios.</span>
        		<div className="mt-3">
					<Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>

          				<Row gutter={16}>
            				<Col span={24}>
              					<Form.Item 
                					name="nombre" 
                					tooltip="Ingresa el nombre del producto"
                					label="Nombre producto"
				                	rules={[
	                  					{
                    						required:true,
                    						message:"Debes ingresar el nombre del producto",
                    						whitespace: true
                  						}
                					]}
                				>
                					<Input placeholder="Bote de pintura" size="large"/>
              					</Form.Item>
            				</Col>
            				<Col span={24}>
								<Form.Item 
				                	name="marcaProducto" 
                					tooltip="Ingresa la marca del producto"
                					label="Marca del producto"
                					rules={[
	                  					{
                    						required:true,
                    						message:"Debes ingresar la marca del producto, ingresa desconocido si no la sabes",
                    						whitespace: true
                  						}
                					]}
                				>
                					<Input placeholder="Comex" size="large" />
              					</Form.Item>
            				</Col>
			            	<Col span={24}>
								<Form.Item
									name="unidad"
									rules={[{ required: true, message: 'Porfavor selecciona la unidad del producto'}]}
									tooltip="¿Como se mide el producto?"
									label="Unidad del producto"
								>
                					<Select placeholder="Metro,Kilogramo,Pieza,etc." size="large">
										<Select.Option value="metro">Metro</Select.Option>
										<Select.Option value="kilogramo">Kilogramo</Select.Option>
										<Select.Option value="pieza">Pieza</Select.Option>
										<Select.Option value="litro">Litro</Select.Option>
              						</Select>
            					</Form.Item>
            				</Col>

              				<Col span={24}>
								<Form.Item
				                	name="categorias"
                					rules={[{ required: true, message: 'Porfavor selecciona la o las categorias del producto!', type: 'array' }]}
                					tooltip="Ingresa la categoria o las categorias del producto"
                					label="Categorias"
              					>
                					<Select mode="multiple" placeholder="Categoria o categorias a la que pertenece este producto." size="large">
										{categorias.map(categoria => {
											return (
                  								<Select.Option value={categoria._id}>{categoria.nombre}</Select.Option>
											)
										})}
              						</Select>
            					</Form.Item>
            				</Col>
            				<Col span={24}>
				        		<Form.Item 
                  					label="Cantidad en bodega :" 
                  					name="cantidad"
                  					tooltip="Ingresa la cantidad de unidades del producto en bodega..."
                  				>
                  					<InputNumber style={{width: "100%"}} min={1} size="large"/>
              					</Form.Item>
            				</Col>

            				<Col span={24}>
								<Form.Item 
                  					label="Costo del producto " 
                  					name="costo"
                  					tooltip="Ingresa el costo del producto medio"
                  				>
                  					<InputNumber style={{width: "100%"}} size="large"/>
              					</Form.Item>
            				</Col>
							<Col span={24}>
              					<Form.Item 
				                	label="Descripción del producto"
                  					name="descripcion"
                  					tooltip="Ingresa una descripció sobre el producto"
                  					rules={[{required:true,message:"Debes ingresar una descripción",whitespace:true}]}
				  				>
                					<Input.TextArea allowClear showCount minLength={40} style={{width:"100%"}} placeholder="Descripción del producto"  size="large"/>
              					</Form.Item>
            				</Col>
							<Col span={24}>
								<Form.Item
              						name="estadoProducto"
				              		label="Estado del producto"
              						rules={[
	            						{
                							required: true,
                  							message: 'Selecciona el estado del producto!',
                						},
                					]}
              					>
									<Select placeholder="¿Como se encuentra el producto?" size="large">
					                	<Select.Option value="nuevo">Nuevo</Select.Option>
                						<Select.Option value="usado">Usado</Select.Option>
              						</Select>
              					</Form.Item>
            				</Col>
							<Col span={24}>
			            		<Form.Item
                  					name="inventariable"
                  					label="Inventariable"
									tooltip="Los productos NO invetariables son aquellos que NO son de valor o que son muy pequeños ejemplo serian tornillos,tuercas,etc."
                  					rules={[
				                		{
                  							required: true,
                  							message: 'El producto necesita tener este parametro',
                						},
                					]}
              					>
              						<Select placeholder="¿El producto es inventariable?" size="large">
                						<Select.Option value="inventariable">Inventariable</Select.Option>
                						<Select.Option value="no-inventariable">NO inventariable</Select.Option>
              						</Select>
              					</Form.Item>
							<Col span={24}>
								<Upload {...props}>
	                            	<Button icon={<UploadOutlined/>} size="large">Selecciona la imagen del producto</Button>
									<span className="text-muted">(Podras cambiar la imagen despues en los ajustes en la pagina del producto)</span>
                       			</Upload>
							</Col>
            				</Col>
              				<Col span={24}>
								<Button type="primary" block htmlType="submit" size="large" disabled={filesList.length === 0}>{uploading ? "Registrando informacion..." : "Registrar producto"}</Button>
              				</Col>
          				</Row>
        			</Form>
          	</div>
      	</div>
    	)
	}
}
