import { Breadcrumb, Button, Divider, message, Modal } from 'antd';
import { ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { useEmpleados } from '../../../../hooks/useEmpleados';
import { useForm } from '../../../../hooks/useForm';
import { useSelector } from 'react-redux';
const { confirm } = Modal;

export const InformacionGeneral = ({obraInfo,socket}) => {
    //Cargar empleados con solo el rol de empleados o ingenieros 
    const { uid } = useSelector(store => store.auth);
    const { isLoading:isLoadingEmpleados,empleados } = useEmpleados();
	const [isEditing, setIsEditing] = useState(false);
    const [formValues,handleInputChange,setValues ] = useForm({
		titulo:obraInfo.titulo,
		descripcion:obraInfo.descripcion,
		tipoReporte:obraInfo.tipoReporte,
		numeroTrack:obraInfo.numeroTrack,
		estado:obraInfo.estado,
        jefeObra:obraInfo.jefeObra.uid
	});

    const actualizarInformacionObra = () => {
		confirm({
            title:"¿Quieres editar la informacion de la obra?",
            icon:<ExclamationCircleOutlined />,
            content:"La informacion de la obra sera edita y se guarda un registro de tu accion.",
			okText:"Actualizar informacion",
			cancelText:"Volver atras",
            async onOk(){
                socket.emit("actualizar-informacion-obra",{...formValues,uid,obraId:obraInfo._id},(confirmacion)=>{
                    if(!confirmacion.ok) return message.error(confirmacion.msg);
                    //Informacion de obra actualizada con exito!
                    message.success(confirmacion.msg);
                    setIsEditing(false);
                });
           	},
        });
    }

    if(isLoadingEmpleados){
        return <SanzSpinner/>
    }else{
        return (
            <div className="p-5 container"  style={{minHeight:"100vh"}}>
                <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                    <Breadcrumb>
                        {/* El ultimo breadcrumb sera el activo*/}
                        <Breadcrumb.Item><Link to={`/aplicacion/empresas/${obraInfo.empresa._id}`}>{obraInfo.empresa.nombre}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to={`/aplicacion/empresas/${obraInfo.empresa._id}/sucursales/${obraInfo.sucursal._id}`}>{obraInfo.sucursal.nombre}</Link></Breadcrumb.Item>
                        <Breadcrumb.Item>{obraInfo.titulo}</Breadcrumb.Item>
                    </Breadcrumb>

            </div>
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
                    {isEditing ? <input style={{width:"100%"}} name="titulo" onChange={handleInputChange} value={formValues.titulo} className="mt-3 titulo form-control w-50"></input>:<h1 className="titulo">{obraInfo.titulo}</h1>}
                    {isEditing ? <div className="d-flex justify-content-start align-items-center gap-2"><Button type="primary" danger onClick={()=>{setIsEditing(false)}}>Salir sin guardar</Button><Button type="primary" onClick={actualizarInformacionObra}>Editar informacion</Button></div>: <Button type="primary" danger onClick={()=>{setIsEditing(true)}}>Editar informacion</Button>}
                </div>
                <Divider/>
                <h1 className="titulo col-6">Descripcion:</h1>
                {isEditing ? <textarea style={{width:"100%"}} rows="5" name="descripcion" onChange={handleInputChange} value={formValues.descripcion} className="descripcion form-control"/> : <p className="descripcion">{obraInfo.descripcion}</p>}
                <Divider/>
                <h1 className="titulo col-6">Informacion de la obra:</h1>
                <div className="row">
                    <h1 className="col-6 titulo-descripcion">Estado de la obra:</h1>
                    {isEditing 
                        ? 
                        <>
                            <select className="form-select descripcion" style={{width:"50%"}} aria-describedby="inventariableHelpBlock" value={formValues.estado} name="estado" onChange={handleInputChange}>
	                	        <option value={"PRESUPUESTO-CLIENTE"} key={"PRESUPUESTO-CLIENTE"}>Presupuesto con el cliente</option>
                                <option value={"EN-PROGRESO"} key={"EN-PROGRESO"}>En progreso</option>
					        </select>
                        </>
                    :
                    <>
                            <p className="col-6 descripcion">{obraInfo.estado}</p>
                        </> 
                    }
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
