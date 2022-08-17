import { Breadcrumb, Button, Divider, Modal } from 'antd';
import { ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { useEmpleados } from '../../../../hooks/useEmpleados';
import { useForm } from '../../../../hooks/useForm';
const { confirm } = Modal;

export const InformacionGeneral = ({obraInfo}) => {
    //Cargar empleados con solo el rol de empleados o ingenieros 
    const { isLoading:isLoadingEmpleados,empleados } = useEmpleados();
	const [isEditing, setIsEditing] = useState(false);
    const [formValues,handleInputChange,setValues ] = useForm({
		titulo:obraInfo.titulo,
		descripcion:obraInfo.descripcion,
		tipoReporte:obraInfo.tipoReporte,
		numeroTrack:obraInfo.numeroTrack,
		estado:obraInfo.estado,
        jefeObra:obraInfo.jefeObra.nombre
	});

    const actualizarInformacionObra = () => {
		confirm({
            title:"¿Quieres editar la informacion de la obra?",
            icon:<ExclamationCircleOutlined />,
            content:"La informacion de la obra sera edita y se guarda un registro de tu accion.",
			okText:"Actualizar informacion",
			cancelText:"Volver atras",
            async onOk(){
           	},
        });
    }

    if(isLoadingEmpleados){
        return <SanzSpinner/>
    }else{
        return (
            <div className="p-5 container">
                <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                    <Breadcrumb>
                        {/* El ultimo breadcrumb sera el activo*/}
                        <Breadcrumb.Item><Link to={`/aplicacion/empresas/${obraInfo.empresa._id}`}>{obraInfo.empresa.nombre}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={`/aplicacion/empresas/${obraInfo.empresa._id}/sucursales/${obraInfo.sucursal._id}`}>{obraInfo.sucursal.nombre}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{obraInfo.titulo}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="d-flex gap-2">
                        {isEditing ? <><Button type="primary" danger onClick={()=>{setIsEditing(false)}}>Salir sin guardar</Button><Button type="primary" onClick={actualizarInformacionObra}>Editar informacion</Button></>: <Button type="primary" danger onClick={()=>{setIsEditing(true)}}>Editar informacion</Button>}
                    </div>
            </div>
                {isEditing ? <input style={{width:"100%"}} name="titulo" onChange={handleInputChange} value={formValues.titulo} className="mt-3 titulo form-control"></input>:<h1 className="titulo">{obraInfo.titulo}</h1>}
                <Divider/>
                <h1 className="titulo">Descripcion:</h1>
                {isEditing ? <textarea style={{width:"100%"}} rows="5" name="descripcion" onChange={handleInputChange} value={formValues.descripcion} className="descripcion form-control"/> : <p className="descripcion">{obraInfo.descripcion}</p>}
                <Divider/>
                <h1 className="titulo">Informacion de la obra:</h1>
                <div className="row">
                    <h1 className="col-6 titulo-descripcion">Estado de la obra:</h1>
                    {isEditing 
                        ? 
                        <>
                            <select className="form-select descripcion" style={{width:"50%"}} aria-describedby="inventariableHelpBlock" value={formValues.estado} name="estado" onChange={handleInputChange}>
	                	        <option value={"PRESUPUESTO-CLIENTE"} key={"PRESUPUESTO-CLIENTE"}>Presupuesto con el cliente</option>
                                <option value={"EN-PROGRESO"} key={"EN-PROGRESO"}>En progreso</option>
                                <option value={"FINALIZADA"} key={"FINALIZADA"}>Finalizada</option>
					        </select>
                        </>
                    :
                    <>
                            <p className="col-6 descripcion">{obraInfo.estado}</p>
                        </> 
                    }
                    <h1 className="col-6 titulo-descripcion">Dinero total empleado:</h1>
                    <p className="col-6 descripcion text-success">${22323.53}</p>
                    <h1 className="col-6 titulo-descripcion">Fecha de creacion:</h1>
                    <p className="col-6 descripcion">{obraInfo.fechaCreacion}</p>
                    {obraInfo.fechaFinalizado && (
                        <>
                            <h1 className="col-6 titulo-descripcion">Fecha de finalizado:</h1>
                            <p className="col-6 descripcion text-danger">{obraInfo.fechaFinalizado}</p>
                        </>
                    )}
                    <h1 className="col-6 titulo-descripcion">Numero track:</h1>
                    {isEditing 
                        ?
                            <input
                                className="form-control descripcion col-6"
                                style={{width:"50%"}}
                                value={formValues.numeroTrack}
                                name="numeroTrack" 
                                onChange={handleInputChange}
                            />
                        : 
                            <p className="col-6 descripcion">{obraInfo.numeroTrack}</p>
                    }
                    <h1 className="col-6 titulo-descripcion">Tipo de reporte:</h1>
                    {isEditing 
                        ? 
                        <>
                            <select className="form-select descripcion" style={{width:"50%"}}  aria-describedby="inventariableHelpBlock" value={formValues.tipoReporte} name="tipoReporte" onChange={handleInputChange}>
	                	        <option value={"CORRECTIVO"} key={"CORRECTIVO"}>Correctivo</option>
                                <option value={"PREVENTIVO"} key={"PREVENTIVO"}>Preventivo</option>
					        </select>
                        </>
                    :
                    <>
                            <p className="col-6 descripcion">{obraInfo.tipoReporte}</p>
                        </> 
                    }
                    <h1 className="col-6 titulo-descripcion">Jefe de obra:</h1>
                    {isEditing 
                        ?
                            <select className="form-select col-6 w-50 descripcion" aria-describedby="inventariableHelpBlock" value={formValues.jefeObra} name="jefeObra" onChange={handleInputChange}>
                                {
                                    empleados.map(empleado => (
                                        <option value={empleado.uid} key={empleado.uid}>{empleado.nombre}</option>
                                    ))
                                }
					        </select>
                        : 
                            <p className="col-6 descripcion">{obraInfo.jefeObra.nombre}</p>}
                    <h1 className="col-6 titulo-descripcion">Empresa:</h1>
                    <p className="col-6 descripcion">{obraInfo.empresa.nombre}</p>
                    <h1 className="col-6 titulo-descripcion">Sucursal:</h1>
                    <p className="col-6 descripcion">{obraInfo.sucursal.nombre}</p>
                </div>
            </div>
        )
    }
}