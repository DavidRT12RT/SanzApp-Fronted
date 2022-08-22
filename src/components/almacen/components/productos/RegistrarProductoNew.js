import { Button,  message, Modal, Result, Select, Steps, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { useCategorias } from '../../../../hooks/useCategorias';
import { ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import "./components/assets/style.css";
import { useForm } from '../../../../hooks/useForm';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchConTokenSinJSON } from '../../../../helpers/fetch';
const { Step } = Steps;
const { confirm } = Modal;

export const RegistrarProductoNew = () => {
    const [current, setCurrent] = useState(0);
	const [filesList, setFilesList] = useState([]);
	const { isLoading,categorias } = useCategorias();
	const [finish, setFinish] = useState({estado:false,producto:null});
	const [uploading, setUploading] = useState(false);
    const {uid,name} = useSelector((state) => state.auth);
    //Hook personalizado para el formulario
    const [formValues,handleInputChange,setValues ] = useForm({
        nombre:"",
        marca:"",
        estado:"Nuevo",
        costo:0,
        inventariable:true,
        unidad:"",
        categoria:"",
        descripcion:"",
        cantidad:1,
        aplicaciones:""
    });

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

    const steps = [
        {
            title: 'Informacion basica del producto',
            content: 
                <div className="d-flex align-items-start flex-column">
                    <label className="form-label">Nombre del producto: </label>
                	<input
                        className="form-control"
                        value={formValues.nombre}
                        name="nombre" 
                        onChange={handleInputChange}
                        placeholder="Bote de pintura" 
                    />

                    <label className="form-label mt-3">Marca del producto: </label>
               	    <input
                        className="form-control"
                        placeholder="Marca del producto" size="large"
                        value={formValues.marca}
                        name="marca" 
                        onChange={handleInputChange}
                        autoComplete = "disabled"
                        required
                    />

                    <label for="cantidad" className="form-label mt-3">Cantidad del producto en bodega: </label>
                    <input
                        type="number"
                        className="form-control"
                        id="cantidad"
                        style={{width: "100%"}} 
                        size="large"
                        value={formValues.cantidad}
                        name="cantidad"
                        onChange={handleInputChange}
                        autoComplete="disabled"
                        required
                    />
                    <label for="estado" className="form-label mt-3">Estado del producto: </label>
                    <select id="estado" className="form-select" aria-describedby="inventariableHelpBlock" value={formValues.estado} name="estado" onChange={handleInputChange}>
                        <option value={"Nuevo"}>Nuevo</option>
                        <option value={"Usado"}>Usado</option>
                    </select>
                    <label for="costo" className="form-label mt-3">Costo del producto: </label>
                    <input
                        type="number"
                        className="form-control"
                        id="costo"
                        style={{width: "100%"}} 
                        size="large"
                        value={formValues.costo}
                        name="costo"
                        onChange={handleInputChange}
                        autoComplete="disabled"
                        required
                    />
                    <label for="inventariable" className="form-label mt-3">Inventariable: </label>
                    <select type="number" id="inventariable" className="form-select" aria-describedby="inventariableHelpBlock" value={formValues.inventariable} name={"inventariable"} onChange={handleInputChange}>
                        <option value={true}>Inventariable</option>
                        <option value={false}>NO inventariable</option>
                    </select>
                    <div id="inventariableHelpBlock" class="form-text">
                        Marcar que el producto sea inventariable o NO tendra un impacto a la hora de realizar reportes de inventario, 
                        ya que solo podras contabilizar los productos marcados como inventariables
                    </div>
                </div>,
        },
        {
            title: 'Informacion detallada del producto',
            content: 
                <div className="d-flex align-items-start flex-column">
                    <label for="unidad" className="form-label mt-3">Unidad: </label>
                    <select id="unidad" className="form-select" aria-describedby="inventariableHelpBlock" value={formValues.unidad} name="unidad" onChange={handleInputChange}>
                        <option value={"Metro"}>Metro</option>
                        <option value={"Kilogramo"}>Kilogramo</option>
                        <option value={"Pieza"}>Pieza</option>
                        <option value={"Litro"}>Litro</option>
                    </select>

                    <label className="form-label mt-3">Categoria del producto: </label>
                	<select style={{width:"100%",borderRadius: "0.25rem"}} defaultValue={categorias.length > 0 && categorias[0]._id} className="form-select" value={formValues.categoria} name="categoria" onChange={handleInputChange} placeholder="Categoria a la que pertenece este producto." size="large" >
						{categorias.map(categoria => {
							return (
                  				<option value={categoria._id} key={categoria._id}>{categoria.nombre}</option>
							)
						})}
              		</select>
                    <label for="descripcion" className="form-label mt-3">Descripcion del producto: </label>
                    <textarea class="form-control" id="descripcion" value={formValues.descripcion} name="descripcion" onChange={handleInputChange} rows="4"></textarea>
                    <label for="aplicaciones" className="form-label mt-3">Aplicaciones del producto: </label>
                    <textarea class="form-control" id="aplicaciones" value={formValues.aplicaciones} name="aplicaciones" onChange={handleInputChange} rows="4"></textarea>
                </div>,

        },
        {
            title: 'Archivos del producto',
            content: 
                <>
					<Upload {...props}>
	                    <Button icon={<UploadOutlined/>} size="large">Selecciona la imagen del producto</Button>
                    </Upload>
                </>,
        },
    ];

    //Crear un nuevo producto
    const onFinish = async () =>{                    
        //Checando que todos los campos no esten vacios
        for (const property in formValues){
            if(formValues[property] === "") return message.error("Faltan registros por completar!");
        }

		confirm({
            title:"¿Seguro quieres registrar un nuevo producto?",
            icon:<ExclamationCircleOutlined />,
            content:"El producto sera registrado dentro del almacen y podra ser usado para salidas a obras y resguardos.",
			okText:"Registrar",
			cancelText:"Volver atras",
            async onOk(){
				setUploading(true);
                console.log(formValues);
        		const formData = new FormData();
				formData.append("nombre",formValues.nombre);
				formData.append("cantidad",formValues.cantidad);
				formData.append("descripcion",formValues.descripcion);
				formData.append("marca",formValues.marca);
				formData.append("categoria",formValues.categoria);
				formData.append("costo",formValues.costo);
				formData.append("estado",formValues.estado);
				formData.append("usuarioCreador",uid);
				formData.append("unidad",formValues.unidad);
				formData.append("inventariable",formValues.inventariable);
				formData.append("aplicaciones",formValues.aplicaciones)
        		filesList.forEach(file => {
            		formData.append("archivo",file);
        		});
				//Emitir evento al backend de crear nuevo producto!					
                const resp = await fetchConTokenSinJSON("/productos",formData,"POST");
				const body = await resp.json();
				if(resp.status === 201){
					message.success(body.msg);
					setFinish({estado:true,producto:body.producto});
					//navigate(`/almacen/productos/${body._id}`);
				    setFilesList([]);
				}else{
					message.error(body.msg);
				}
				setUploading(false);
           	},
        });
    }


	if(finish.estado){
		return (
			<Result
    			status="success"
    			title="Producto creado con exito!"
    			subTitle="Producto creado con exito y ya disponible para entradas y salidas.!"
    			extra={[<Link to={`/almacen/productos/${finish.producto._id}`}><Button type="primary" key="console">Ver producto</Button></Link>,<Button onClick={()=>{setFinish({estado:false,producto:null})}}>Registrar un nuevo producto</Button>,]}
			/>
		)
	}else return (
        <div className="padre">
            <div className="container hijo p-5">
        		<h1 className="nombre-producto text-center">Registrar un nuevo producto</h1>
                <h1 className="descripcion-producto text-center mb-5">Llenar los siguientes datos para registrar un nuevo producto a almacen.</h1>
                <Steps current={current}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <div className="steps-content p-5">{steps[current].content}</div>
                <div className="steps-action">
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => setCurrent(current + 1)}>
                            Siguiente
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" onClick={onFinish}>
                            Registrar producto
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{margin: '0 8px',}} onClick={() => setCurrent(current -1)}>
                            Anterior
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
