import { Button,  message, Modal, Result, Select, Steps, Upload } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from '../../../../hooks/useForm';
import { fetchConToken, fetchConTokenSinJSON } from '../../../../helpers/fetch';
import { ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
//Estilos propios del componente
import "./assets/styleRegistrarUsuario.css";

const { Step } = Steps;
const { confirm } = Modal;


export const RegistrarUsuario = () => {

    const [current, setCurrent] = useState(0);
	const [filesList, setFilesList] = useState([]);
    const [finish, setFinish] = useState({estado:false,producto:null});
	const [uploading, setUploading] = useState(false);
    const [roles, setRoles] = useState([]);
    const navigate = useNavigate();

    //Buscar roles disponibles para el registro del nuevo usuario

    useEffect(() => {
        const fetchData = async() => {
            const resp = await fetchConToken("/usuarios/roles/obtener-roles");
            const body = await resp.json();
            if(resp.status != 200) {
                //No lo dejaremos registrar usuarios ya que NO se encontro roles en la DB
                navigate(-1);
                return message.error(body.msg);
            }
            //Roles encontrados con exito
            setRoles(body);
        }
        fetchData();
    }, []);

    console.log(roles);
    

   //Hook personalizado para el formulario
    const [formValues,handleInputChange,setValues ] = useForm({
        nombre:"",
        correo:"",
        telefono:"",
        rol:"",
        alias:"",
        //Datos detallados del usuario
        RFC:"",
        NSS:"",
        CURP:"",
    });

    const props = {
        onRemove : file => {
            setFilesList([]);
        },
        beforeUpload: file => {
            //Verificar que el fileList sea menos a 2 
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            setFilesList([file]);
            return false;
        },
        listType:"picture",
        maxCount:1,
        fileList : filesList
    };
  
    const onFinish = async () => {                    
        //Checando que todos los campos no esten vacios
        for (const property in formValues){
            if(formValues[property] === "") return message.error("Faltan registros por completar!");
        }

		confirm({
            title:"¿Seguro quieres registrar un nuevo usuario?",
            icon:<ExclamationCircleOutlined />,
            content:"El usuario sera registrado en la plataforma y disponible para acceder en ella",
			okText:"Registrar",
			cancelText:"Volver atras",
            async onOk(){
                //setUploading(true);
        		const formData = new FormData();
                for(const property in formValues) formData.append(property,formValues[property]);
                if(filesList.length > 0){
                    //Anadiendo foto de perfil al form data
                    formData.append("archivo",filesList[0]);
                }
                const resp = await fetchConTokenSinJSON("/usuarios/",formData,"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Usuario creado con exito!
                message.success(body.msg);
                //setUploading(false);
            }
        });
    }

    console.log(formValues);

    const steps = [
        {
            title: 'Informacion basica del usuario',
            content: 
                <div className="d-flex align-items-start flex-column">
                    <label className="form-label">Nombre del usuario: </label>
                	<input
                        className="form-control"
                        value={formValues.nombre}
                        name="nombre" 
                        onChange={handleInputChange}
                        placeholder="Arturito Gonzales Perez" 
                    />

                    <label className="form-label mt-3">Alias del usuario: </label>
                	<input
                        className="form-control"
                        value={formValues.alias}
                        name="alias" 
                        onChange={handleInputChange}
                        placeholder="Arturito jr..."
                    />

                    <label className="form-label mt-3">Correo del usuario: </label>
               	    <input
                        className="form-control"
                        placeholder="Correo del usuario" size="large"
                        value={formValues.correo}
                        name="correo" 
                        onChange={handleInputChange}
                        autoComplete = "disabled"
                        required
                    />

                    <label className="form-label mt-3">Telefono del usuario</label>

               	    <input
                        className="form-control"
                        placeholder="229 223 2323" size="large"
                        value={formValues.telefono}
                        name="telefono" 
                        onChange={handleInputChange}
                        autoComplete = "disabled"
                        required
                    />

                    <label for="estado" className="form-label mt-3">Rol del usuario: </label>
                    <select id="estado" className="form-select" aria-describedby="inventariableHelpBlock" value={formValues.rol} name="rol" onChange={handleInputChange}>
                        {
                            roles.map(rol => (
                                <option value={rol.rol} key={rol._id}>{rol.rol}</option>
                            ))
                        }
                    </select>
                </div>,
        },
        {
            title: 'Informacion detallada del usuario',
            content: 
                <div className="d-flex align-items-start flex-column">
                    <label for="unidad" className="form-label mt-3">RFC: </label>
               	    <input
                        className="form-control"
                        placeholder="VECJ880326 XXX" size="large"
                        value={formValues.RFC}
                        name="RFC" 
                        onChange={handleInputChange}
                        autoComplete = "disabled"
                        required
                    />

                    <label for="unidad" className="form-label mt-3">NSS: </label>
               	    <input
                        className="form-control"
                        placeholder="555-50-1234" size="large"
                        value={formValues.NSS}
                        name="NSS" 
                        onChange={handleInputChange}
                        autoComplete = "disabled"
                        required
                    />

                    <label for="unidad" className="form-label mt-3">CURP: </label>
               	    <input
                        className="form-control"
                        placeholder="960917" size="large"
                        value={formValues.CURP}
                        name="CURP" 
                        onChange={handleInputChange}
                        autoComplete = "disabled"
                        required
                    />
                </div>,

        },
        {
            title: 'Archivos del usuario',
            content: 
                <>
					<Upload {...props}>
	                    <Button icon={<UploadOutlined/>} size="large">Selecciona la imagen del usuario</Button>
                    </Upload>
                </>,
        },
    ];


	
    if(finish.estado){
		return (
			<Result
    			status="success"
    			title="Usuario registrado creado con exito!"
    			subTitle="Usuario creado con exito y ya disponible para acceder a la plataforma.!"
    			extra={[<Link to={`/almacen/productos/`}><Button type="primary" key="console">Ver producto</Button></Link>,<Button onClick={()=>{setFinish({estado:false,producto:null})}}>Registrar un nuevo usuario</Button>,]}
			/>
		)
	}else return (
        <div className="padre">
            <div className="container hijo p-5">
        		<h1 className="nombre-producto text-center">Registrar un nuevo usuario</h1>
                <h1 className="descripcion-producto text-center mb-5">Llenar los siguientes datos para registrar un nuevo usuario en el sistema.</h1>
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
                        <Button type="primary" onClick={onFinish} loading={uploading}>
                            Registrar usuario 
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
