import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {  message,Divider,Input,Tag,Table,Button,InputNumber, Modal } from 'antd';
import { ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { fetchConToken } from '../../../../helpers/fetch';
import "./assets/style.css";
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { useForm } from '../../../../hooks/useForm';
import { ReporteInventarioAlmacen } from '../../../../reportes/Almacen/ReporteInventarioAlmacen';
import { useSelector } from 'react-redux';
const { confirm } = Modal;

export const Inventario = () => {

    const { id } = useParams();
    const {auth} = useSelector(store => store);
    const navigate = useNavigate();
    const [inventario, setInventario] = useState({});
    const [inventarioInitialValue, setInventarioInitialValue] = useState({});
    const [isEditingProductos, setIsEditingProductos] = useState(false);
    const [isEditingInformacion, setIsEditingInformacion] = useState(false);
    const [values,handleInputChange,setValues] = useForm({});
    

    useEffect(() => {
        //Hacer peticion de la informacion del inventario por id
        const fetchData = async() => {
            const resp = await fetchConToken(`/inventarios/${id}`);
            const body = await resp.json();
            //Si el inventario NO existe
            if(resp.status != 200) {
                message.error(body.msg);
                return navigate(-1);
            }
            //Guardaremda salio con exito
            body.productosInventariados.map(producto => producto.key = producto._id);
            setInventario(JSON.parse(JSON.stringify(body)));
            setInventarioInitialValue(JSON.parse(JSON.stringify(body)));
        }
        fetchData();
    }, []);

    const guardarCambiosInventario = () => {
		confirm({
            title:"¿Seguro quieres editar la informacion del inventario?",
            icon:<ExclamationCircleOutlined />,
            content:"Se editara la informacion del inventario y no podras regresar al estado anterior",
			okText:"Editar",
			cancelText:"Volver atras",
            async onOk(){
                const resp = await fetchConToken("/inventarios/actualizar-informacion-inventario",{...inventario,...values,id},"PUT");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);
                //Informacion actualizada con exito
                message.success(body.msg);
                body.inventario.productosInventariados.map(producto => producto.key = producto._id);
                isEditingInformacion ? setIsEditingInformacion(false) : setIsEditingProductos(false);
                setInventario(JSON.parse(JSON.stringify(body.inventario)));
                setInventarioInitialValue(JSON.parse(JSON.stringify(body.inventario)));
            }
        })

    }

    const finalizarInventario = () => {
		confirm({
            title:"¿Seguro quieres finalizar el inventario?",
            icon:<ExclamationCircleOutlined />,
            content:"El inventario quedara registrado y NO PODRAS activarlo de nuevo , es decir que todos los productos contados ya no se podran editar y nada de la informacion podra ser editada",
			okText:"Finalizar",
			cancelText:"Volver atras",
            async onOk(){
                const resp = await fetchConToken("/inventarios/finalizar-inventario",{id},"PUT");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);
                //Informacion actualizada con exito
                message.success(body.msg);
                body.inventario.productosInventariados.map(producto => producto.key = producto._id);
                setInventario(JSON.parse(JSON.stringify(body.inventario)));
                setIsEditingInformacion(false);
                setIsEditingProductos(false);
            }
        })
    }

    const crearReporteInventario = async() => {
        const blob = await pdf((
            <ReporteInventarioAlmacen inventario={inventario}/>
        )).toBlob();
        saveAs(blob,`reporte_inventario_${inventario._id}.pdf`)
    }

    const columns = [
        {
            title:<p className="titulo-descripcion">Nombre</p>,
            render:(text,record) => (<p className="descripcion">{record.id.nombre}</p>)
        },
        {
            title:<p className="titulo-descripcion">Marca</p>,
            render:(text,record) => (<p className="descripcion">{record.id.marca}</p>)
        },
        {
            title:<p className="titulo-descripcion">Categoria</p>,
            render:(text,record)=> (<Tag className="descripcion my-3" style={{backgroundColor:record.id.categoria.color,borderColor:record.id.categoria.color,padding:"13px",maxWidth:"fit-content"}}>{record.id.categoria.nombre}</Tag>)
        },
        {
            title:<p className="titulo-descripcion">Unidad</p>,
            render:(text,record) => (<p className="descripcion">{record.id.unidad}</p>)
        },
        {
            title:<p className="titulo-descripcion">Cantidad teorica</p>,
            render:(text,record) => (<p className="descripcion">{record.cantidadTeorica}</p>)
        },
        {
            title:<p className="titulo-descripcion">Cantidad contada</p>,
            render:(text,record)=> {
                return isEditingProductos 
                ? <InputNumber onChange={(e)=>{
                    const newInventarioValues = inventario.productosInventariados.map(producto => {
                        if(producto.id._id === record.id._id) producto.cantidadContada = e;
                        return producto;
                    });
                    setInventario({...inventario,productosInventariados:newInventarioValues});
                }} className={record.cantidadContada != record.cantidadTeorica && "text-primary"} defaultValue={record.cantidadContada}></InputNumber> 
                : <p className={record.cantidadContada != record.cantidadTeorica ? "text-primary descripcion" : null}>{record.cantidadContada}</p>
            }
       },
    ];

    useEffect(() => {
        if(Object.keys(inventario).length > 0){
            setValues({
                titulo:inventario.titulo,
                descripcion:inventario.descripcion
            })
        }
    }, [inventario]);

    const reactivarInventario = () => {
		confirm({
            title:"¿Seguro quieres reactivar el inventario?",
            icon:<ExclamationCircleOutlined />,
            content:"El inventario sera reactivado y podras hacer cambios en la cantidad contada y la informacion basica de este mismo",
			okText:"Reactivar",
			cancelText:"Volver atras",
            async onOk(){
                const resp = await fetchConToken(`/inventarios/reactivar-inventario/`,{id},"PUT");
                const body = await resp.json();
                console.log(body);
                if(resp.status != 200) return message.error(body.msg);
                body.inventario.productosInventariados.map(producto => producto.key = producto._id);
                setInventario(JSON.parse(JSON.stringify(body.inventario)));
                //Reactivacion con exito
                message.success(body.msg);
            }
        })

    }

    const renderizarBotonesEditarInformacion = () => {
        if(inventario.estatus === "En progreso"){
            return isEditingInformacion 
                ?                 
                <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                    <Button type="primary"danger onClick={()=>{setIsEditingInformacion(false)}}>Descartar cambios</Button>
                    <Button type="primary" onClick={guardarCambiosInventario}>Guardar cambios</Button>
                </div>
                :
                <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
                    <Button type="primary" onClick={()=>{setIsEditingInformacion(true)}}>Editar informacion</Button>
                    <Button type="primary" danger onClick={finalizarInventario}>Finalizar inventario</Button>
                </div>
        }else if(inventario.estatus === "Finalizado"){
            return (
                <div className="d-flex justify-content-center align-items-center gap-2">
                    {/*<Button type="primary" style={{backgroundColor:"#ffc107",borderColor:"#ffc107"}}>Activar inventario</Button>*/}
                    <Button type="primary" onClick={crearReporteInventario}>Descargar PDF inventario</Button>
                    {auth.rol === "ADMIN_ROLE" && <Button type="primary" danger onClick={reactivarInventario}>Reactivar inventario</Button>}
                </div>
            )
        }
    }

    const renderizarBotonesEditarCantidadProductos = () => {
        if(inventario.estatus === "En progreso"){
            return isEditingProductos
            ? 
                <div className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
                    <Button type="primary" danger onClick={()=>{
                        setIsEditingProductos(false);
                        setInventario(JSON.parse(JSON.stringify(inventarioInitialValue)));
                    }}>Descartar cambios</Button>
                    <Button type="primary" onClick={guardarCambiosInventario}>Guardar cambios</Button>
                </div> 
            : 
                <Button type="primary" onClick={()=>{setIsEditingProductos(true)}}>Editar</Button>
        }
    } 

    if(Object.keys(inventario).length === 0){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-3 p-lg-5">

                <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap my-3">
                    {
                        renderizarBotonesEditarInformacion()
                    }
                </div>
                {isEditingInformacion ? <Input className="titulo" value={values.titulo} onChange={handleInputChange} name="titulo" style={{fontSize:"42px"}}></Input> : <h1 className="titulo" style={{fontSize:"42px"}}>{inventario.titulo}</h1>}
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <h1 className="titulo" style={{fontSize:"32px"}}>Descripcion</h1>
                        {isEditingInformacion ? <Input.TextArea rows={5} className="descripcion" value={values.descripcion} onChange={handleInputChange} name="descripcion"></Input.TextArea> : <h1 className="descripcion">{inventario.descripcion}</h1>}
                    </div>
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <h1 className="titulo" style={{fontSize:"32px"}}>Informacion del inventario</h1>
                        <div className='row'>
                            <h1 className="titulo-descripcion col-6">Estatus: </h1>
                            {inventario.estatus ==="En progreso" ? <h1 className="col-6 descripcion text-success">{inventario.estatus}</h1> : <h1 className="col-6 descripcion text-danger">{inventario.estatus}</h1> }
                            <h1 className="titulo-descripcion col-6">Inventario de: </h1>
                            <h1 className="col-6 descripcion">{inventario.tipo.toUpperCase()}</h1>
                            {
                                inventario.tipo === "POR-CATEGORIA" && 
                                <>
                                    <h1 className="titulo-descripcion col-6">Categoria del inventario: </h1>
                                    <h1 className="col-6 descripcion">{inventario.categoria.nombre}</h1>
                                </>
                            }
                            <h1 className="titulo-descripcion col-6">Intervalo fecha: </h1>
                            <h1 className="col-6 descripcion">{inventario.intervaloFecha[0]} --- {inventario.intervaloFecha[1]}</h1> 
                            <h1 className="titulo-descripcion col-6">Fecha del reporte: </h1>
                            <h1 className="col-6 descripcion">{inventario.fechaRegistro}</h1> 
                            
                        </div>
                    </div>
                </div>
                <Divider/>
                <h1 className="titulo" style={{fontSize:"32px"}}>Lista de productos</h1>
                {
                    renderizarBotonesEditarCantidadProductos()
                }
                {inventario.estatus === "Finalizado" && columns.push(
                    {
                        title:<p className="titulo-descripcion">Diferencia</p>,
                        render:(text,record) => {
                            if(record.tipo === "GANANCIA") return <p className="text-success descripcion">{record.diferencia}</p>
                            if(record.tipo === "PERDIDA") return <p className="text-danger descripcion">{record.diferencia}</p>
                            if(record.tipo === "NEUTRAL") return <p className="text-info descripcion">{record.diferencia}</p>
                        }
                    },
                    {
                        title:<p className="titulo-descripcion">Resultado</p>,
                        render:(text,record) =>{
                            if(record.tipo === "GANANCIA") return <Tag color={"green"} style={{fontSize:"13px",padding:"13px"}}>{record.tipo}</Tag>
                            if(record.tipo === "PERDIDA") return <Tag color={"red"} style={{fontSize:"13px",padding:"13px"}}>{record.tipo}</Tag>
                            if(record.tipo === "NEUTRAL") return <Tag color={"cyan"} style={{fontSize:"13px",padding:"13px"}}>{record.tipo}</Tag>
                        }
                    },
                    )
                }
                <Table columns={columns} dataSource={inventario.productosInventariados} className="my-3"/>
            </div>
        )
    }
}
