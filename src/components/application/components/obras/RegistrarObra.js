import React, { useEffect, useState } from 'react';
import { Navigate,useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import queryString from 'query-string'
import { Button,  message, Modal, Steps, DatePicker } from 'antd';
import { ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import { useEmpleados } from '../../../../hooks/useEmpleados';
import { useForm } from '../../../../hooks/useForm';
import { fetchConToken } from '../../../../helpers/fetch';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';

//Fechas
import locale from "antd/es/date-picker/locale/es_ES";
import moment from "moment";

const { Step } = Steps;
const { confirm } = Modal;

export const RegistrarObra = () => {

    //Cargar empleados con solo el rol de empleados o ingenieros 
    const { isLoading:isLoadingEmpleados,empleados } = useEmpleados();
	const [filesList, setFilesList] = useState([]);
    const [current, setCurrent] = useState(0);
	const location = useLocation();
    const [isUploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const [formValues,handleInputChange,setValues ] = useForm({
		titulo:"",
		descripcion:"",
        observaciones:"",
		empresa:"",
		sucursal:"",
		tipoReporte:"CORRECTIVO",
		numeroTrack:0,
		estado:"PRESUPUESTO-CLIENTE",
        fechaCreacionServicio:moment(),
        jefeObra:empleados.length && empleados[0].uid
	});


    useEffect(() => {

        if(empleados.length > 0) return setValues({...formValues,jefeObra:empleados[0].uid});

    }, [empleados]);
    

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

    useEffect(() => {
        /*El hook useLocation nos devuelve un objecto donde esta el pathName y el search que estan los query params */
        const { empresa="",sucursal="" } = queryString.parse(location.search);
        formValues.empresa = empresa;
	    formValues.sucursal = sucursal;
    }, []);
    

	const registrarObra = () => {
        //Validamos que este TODA la informacion
        for (const property in formValues){
            if(formValues[property] === "") return message.error("Faltan registros por completar!");
        }

        //Limpiamos fecha de registro y finalizacion del servicio de la obra en tiempo de SANZ NO DEL PROGRAMA
        formValues.fechaCreacionServicio = moment(formValues.fechaCreacionServicio).format("YYYY-MM-DD");

        if(formValues.estado === "FINALIZADA") formValues.fechaFinalizacionServicio = moment(formValues.fechaFinalizacionServicio).format("YYYY-MM-DD");


		confirm({
            title:"¿Seguro quieres registrar la obra en el sistema?",
            icon:<ExclamationCircleOutlined />,
            content:"La obra sera registrada en el sistema y solo podra ser eliminada por alguna persona con rango 'Administractivo'.",
			okText:"Registrar obra",
			cancelText:"Volver atras",
            async onOk(){
				setUploading(true);
                const resp = await fetchConToken("/obras",formValues,"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Obra creada con exito!
                message.success(body.msg);
				setUploading(false);
                navigate(`/aplicacion/obras/editor/${body.obra._id}`);
           	},
        });
	}

    const steps = [
        {
            title: 'Informacion basica de la obra',
            content:
                <div className="d-flex align-items-start flex-column">
                    <label className="form-label">Titulo de la obra: </label>
                	<input
                        className="form-control"
                        value={formValues.titulo}
                        name="titulo" 
                        onChange={handleInputChange}
                        placeholder="Obra de remodelacion para..." 
                    />
                    <label className="form-label mt-3">Descripcion o motivo de la obra: </label>
                	<textarea
					    rows={5}
                        className="form-control"
                        value={formValues.descripcion}
                        name="descripcion" 
                        onChange={handleInputChange}
                        placeholder="Se remodelara la sucursal tal de tal para..." 
                    />

                    <label className="form-label mt-3">Observaciones de la obra: </label>
                	<textarea
					    rows={5}
                        className="form-control"
                        value={formValues.observaciones}
                        name="observaciones" 
                        onChange={handleInputChange}
                        placeholder="Se remodelo y hubo 3 percanses y no se que..." 
                    />


			</div>
        },
        {
            title: 'Informacion detallada de la obra',
            content:
                <div className="d-flex align-items-start flex-column">
                    <label className="form-label">Empresa: </label>
                	<input
                        readonly
                        className="form-control"
                        value={formValues.empresa}
                        name="empresa" 
                    />
                    <label className="form-label mt-3">Sucursal: </label>
                	<input
                        readonly
                        className="form-control"
                        value={formValues.sucursal}
                        name="sucursal" 
                    />
                    <label className="form-label mt-3">Numero track: </label>
                	<input
                        className="form-control"
                        value={formValues.numeroTrack}
                        name="numeroTrack" 
                        onChange={handleInputChange}
                    />
                    <label className="form-label mt-3">Jefe de obra: </label>
                    <select className="form-select" aria-describedby="inventariableHelpBlock" value={formValues.jefeObra} name="jefeObra" onChange={handleInputChange}>
                        {
                            empleados.map(empleado => (
                                <option value={empleado.uid} key={empleado.uid}>{empleado.nombre}</option>
                            ))
                        }
					</select>

                    <label className="form-label mt-3">Tipo de reporte: </label>
                    <select className="form-select" aria-describedby="inventariableHelpBlock" value={formValues.tipoReporte} name="tipoReporte" onChange={handleInputChange}>
	                	<option value={"CORRECTIVO"} key={"CORRECTIVO"}>Correctivo</option>
                        <option value={"PREVENTIVO"} key={"PREVENTIVO"}>Preventivo</option>
					</select>
				</div>
        },
		{
			title:'Estado de la obra y fecha de servicios',
			content:
                <div className="d-flex align-items-start flex-column">
                	<label className="form-label mt-3">Estado del reporte: </label>
                    <select className="form-select" aria-describedby="inventariableHelpBlock" value={formValues.estado} name="estado" onChange={handleInputChange}>
	                	<option value={"PRESUPUESTO-CLIENTE"} key={"PRESUPUESTO-CLIENTE"}>Presupuesto con el cliente</option>
                        <option value={"EN-PROGRESO"} key={"EN-PROGRESO"}>En progreso</option>
                        <option value={"FINALIZADA"} key={"FINALIZADA"}>Finalizada</option>
					</select>
                    <label className="form-label mt-3">Fecha de creacion servicio</label>
                    <DatePicker size="large" className="form-select" locale={locale} format={"YYYY-MM-DD"} value={formValues.fechaCreacionServicio} onChange={(date,dateString) => {
                        handleInputChange({
                            target:{
                                name:"fechaCreacionServicio",
                                value:date
                            }
                        })
                    }}/>
					{formValues.estado === "FINALIZADA" && 
					    <>
                			<label className="form-label mt-3">Fecha finalizacion del servicio: </label>
                            <DatePicker size="large" className="form-select" locale={locale} format={"YYYY-MM-DD"}  value={formValues?.fechaFinalizacionServicio || moment()} onChange={(date,dateString) => {
                                handleInputChange({
                                    target:{
                                        name:"fechaFinalizacionServicio",
                                        value:date
                                    }
                                })
                            }}/>
						</>
					}
				</div>
		}
    ];

    if(isLoadingEmpleados === true){
        return <SanzSpinner/>
    }else{
        return (
		    <div className="container text-center p-5">
			    <h1 className="titulo">Registrar una nueva obra</h1> 
			    <p className="descripcion mb-5">Registrar una nueva obra al sistema , llena el siguiente formulario con la informacion y etapa que se encuentra la obra nueva.</p>	            
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
                        <Button type="primary" onClick={registrarObra}>
                            Registrar obra
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{margin: '0 8px',}}onClick={() => setCurrent(current - 1)}>
                            Anterior
                        </Button>
                    )}
                </div>
      	    </div>
        )
    }
}
