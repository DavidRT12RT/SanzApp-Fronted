import { Button, Divider, message, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchConToken } from '../../../../helpers/fetch';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import "./assets/styles.css";


export const SalidaScreen = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [informacionSalida, setinformacionSalida] = useState(null);

    useEffect(() => {
        const fetchData = async() => {
            const resp = await fetchConToken(`/salidas/${id}`);
            const body = await resp.json();
            if(resp.status != 200) return navigate(-1);
            body.listaProductos.map(producto => producto.key = producto._id);
            setinformacionSalida(body);
        }
        fetchData();
    }, []);

    const renderizarInformacionBeneficiario = () => {
        switch (informacionSalida.tipo) {
            case "obra": 
                return (
                    <>
                        <h1 className="titulo-descripcion col-6">Titulo de la obra:</h1>
                        <h1 className="col-6 descripcion">{informacionSalida.beneficiarioObra.titulo}</h1>
                        <h1 className="titulo-descripcion col-6">Sucursal obra:</h1>
                        <h1 className="col-6 descripcion">{informacionSalida.beneficiarioObra.sucursal}</h1>
                        <h1 className="titulo-descripcion col-6">Direccion regional:</h1>
                        <h1 className="col-6 descripcion">{informacionSalida.beneficiarioObra.direccionRegional}</h1>
                        <h1 className="titulo-descripcion col-6">Numero track:</h1>
                        <h1 className="col-6 descripcion">{informacionSalida.beneficiarioObra.numeroTrack}</h1>
                    </>
                )
            
            case "resguardo":
                return (
                    <>
                        <h1 className="titulo-descripcion col-6">Nombre del empleado:</h1>
                        <h1 className="col-6 descripcion">{informacionSalida.beneficiarioResguardo.nombre}</h1>
                        <h1 className="titulo-descripcion col-6">Correo electronico:</h1>
                        <h1 className="col-6 descripcion">{informacionSalida.beneficiarioResguardo.correo}</h1>
                        <h1 className="titulo-descripcion col-6">Telefono:</h1>
                        <h1 className="col-6 descripcion">{informacionSalida.beneficiarioResguardo.telefono}</h1>
                    </>
                )
            
            case "merma":
                return (<h1 className="titulo-descripcion col-12">Nadie por ser merma...</h1>)
        }
    }

    const handleDownloadEvidencia = async () => {
        try {
            const resp = await fetchConToken("/salidas/documento-pdf",{salidaId:id},"POST");
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',`${id}.pdf`);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    const categoriaColor = (categoria) => {
        switch (categoria.toLowerCase()) {
            case "ferreteria":
                return <Tag color="cyan" style={{fontSize:"13px",padding:"13px"}} key="ferreteria">{categoria}</Tag> 
            case "vinilos":
                return <Tag color="green" style={{fontSize:"13px",padding:"13px"}} key="vinilos">{categoria}</Tag> 
            case "herramientas":
                return <Tag color="blue" style={{fontSize:"13px",padding:"13px"}} key="herramientas">{categoria}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" style={{fontSize:"13px",padding:"13px"}} key="pisosAzulejos">{categoria}</Tag>
            case "fontaneria":
                return <Tag color="red" style={{fontSize:"13px",padding:"13px"}} key="fontaneria">{categoria}</Tag>
            case "iluminacion":
                return <Tag color="yellow" style={{fontSize:"13px",padding:"13px"}} key="iluminacion">{categoria}</Tag>
            case "materialElectrico":
                return <Tag color="gold" style={{fontSize:"13px",padding:"13px"}} key="materialElectrico">{categoria}</Tag>
            case "selladores":
                return <Tag color="gold" style={{fontSize:"13px",padding:"13px"}} key="selladores">{categoria}</Tag>
            default:
                return <Tag color="green" style={{fontSize:"13px",padding:"13px"}} key="categoria">{categoria}</Tag> 
        }
    }

    const columnsProductosRetirados = [
        {
            title:"Nombre del producto",
            render:(text,record) => {
                return <span>{record.id.nombre}</span>
            }
        },
        {
            title:"Marca del producto",
            render:(text,record) => {
                return <span>{record.id.marca}</span>
            }
        },
        {
            title:"Categoria(s)",
            render:(text,record) => {
                return (
                    <div className="d-flex justify-content-start align-items-center gap-2">
                        {
                            record.id.categorias.map(categoria => {
                                return categoriaColor(categoria.nombre);
                            })
                        }
                    </div>
                )
            }
        },
        {
            title:"Unidad",
            render:(text,record) => {
                return (
                    <span>{record.id.unidad}</span>
                ) 
            }
        },
        {
            title:"Cantidad retirada",
            render:(text,record) => {
                return (
                    <span>{record.cantidad}</span>
                )
            }
        },
        {
            title:"Informacion del producto",
            render:(text,record) => {
                return (
                    <a href={`/almacen/productos/${record.id._id}`} target="blank">Ver producto</a>
                )
            }
        }
    ];

    const columnsProductosDevueltos= [
        {
            title:"Fecha de la devolucion",
            dataIndex:"fecha"
        },
        {
            title:"Tipo",
            dataIndex:"tipo",
            render:(text,record) => {
                return <Tag color={"green"}>{text.toUpperCase()}</Tag>
            }
        },
        {
            title:"Cantidad de productos devueltos",
            render:(text,record) => {
                return <span>{record.listaProductos.length}</span>
            }
        },
    ];


    const expandedRowRender = (record,index,indent,expanded) => {
        const columns = columnsProductosRetirados.slice(0,4);
        columns.push({title:"Cantidad ingresada",render:(text,record)=>{return <span>{record.cantidad}</span>}},{title:"Informacion del producto",render:(text,record)=>{                return (
                    <a href={`/almacen/productos/${record.id._id}`} target="blank">Ver producto</a>
                )}});

        return (<Table columns={columns} dataSource={record.listaProductos}/>)
    }
    
    if(informacionSalida === null){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-5" style={{minHeight:"100vh"}}>
                <div className="d-flex justify-content-end align-items-center">
                    <Button type="primary" onClick={handleDownloadEvidencia} className="my-3">Descargar PDF</Button>
                </div>
                <h1 className="titulo" style={{fontSize:"45px"}}>Salida del almacen</h1>
                <h1 className="descripcion">{informacionSalida.motivo}</h1> 
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <div className="row">
                            <h1 className="titulo" style={{fontSize:"32px"}}>Informacion de la salida</h1>
                            <h1 className="titulo-descripcion col-6">Tipo de la salida: </h1>
                            <h1 className="col-6 descripcion">{informacionSalida.tipo.toUpperCase()}</h1>
                            <h1 className="titulo-descripcion col-6">Fecha creacion: </h1>
                            <h1 className="col-6 descripcion">{informacionSalida.fechaCreacion}</h1>
                            {informacionSalida.tipo === "resguardo" && (
                                <>
                                    <h1 className="titulo-descripcion col-6">Devuelto total: </h1>
                                    {informacionSalida.devueltoTotal ? <h1 className="col-6 descripcion text-success">DEVUELTO</h1>: <h1 className="col-6 descripcion text-danger">NO DEVUELTO</h1>}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <h1 className="titulo" style={{fontSize:"32px"}}>Informacion del beneficiario</h1>
                        <div className='row'>
                                {renderizarInformacionBeneficiario()}
                        </div>
                    </div>
                </div>
                <Divider/>
                <h1 className="titulo">Lista de productos retirados</h1>
                <Table columns={columnsProductosRetirados} dataSource={informacionSalida.listaProductos}/>
                <Divider/>
                <h1 className="titulo">Lista de productos devueltos</h1>
                <Table columns={columnsProductosDevueltos} dataSource={informacionSalida.productosDevueltos} expandable={{expandedRowRender}}/>
            </div>
        )
    }
}
