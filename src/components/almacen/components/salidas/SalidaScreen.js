import { Button, Divider, message, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
                        <h1 className="titulo-descripcion col-6">Numero track:</h1>
                        <h1 className="col-6 descripcion">{informacionSalida.beneficiarioObra.numeroTrack}</h1>
                        <h1 className="titulo-descripcion col-6">Sucursal obra:</h1>
                        <Link to={`/aplicacion/empresas/${informacionSalida.beneficiarioObra.sucursal.empresa}/sucursales/${informacionSalida.beneficiarioObra.sucursal._id}`} target="_blank" className="col-6 descripcion">{informacionSalida.beneficiarioObra.sucursal.nombre}</Link>
                        <h1 className="titulo-descripcion col-6">Delegacion de la sucursal:</h1>
                        <h1 className="col-6 descripcion">{informacionSalida.beneficiarioObra.sucursal.delegacion}</h1>

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


    const columnsProductosRetirados = [
        {
            title:<p className="titulo-descripcion">Nombre del producto</p>,
            render:(text,record) => (
                <p className="descripcion">{record.id.nombre}</p>
            )
        },
        {
            title:<p className="titulo-descripcion">Marca del producto</p>,
            render:(text,record) => (
                <p className="descripcion">{record.id.marca}</p>
            )
        },
        {
            title:<p className="titulo-descripcion">Categoria</p>,
            render:(text,record)=> (<Tag className="descripcion"  style={{backgroundColor:record.id.categoria.color,borderColor:record.id.categoria.color,padding:"13px",maxWidth:"fit-content"}}>{record.id.categoria.nombre}</Tag>)
        },
        {
            title:<p className="titulo-descripcion">Unidad</p>,
            render:(text,record) => (
                <p className="descripcion">{record.id.unidad}</p>
            )
        },
        {
            title:<p className="titulo-descripcion">Cantidad retirada</p>,
            render:(text,record) => (
                <p className="descripcion">{record.cantidad}</p>
            )
        },
        {
            title:<p className="titulo-descripcion">Costo por unidad</p>,
            render:(text,record) => (
                <p className="descripcion">${record.costoXunidad}</p>
            )
        },
        {
            title:<p className="titulo-descripcion">Costo total del producto</p>,
            render:(text,record) => (
                <p className="descripcion text-success">${record.costoXunidad * record.cantidad}</p>
            )
        },
        {
            title:<p className="titulo-descripcion">Informacion del producto</p>,
            render:(text,record) => (
                <a className="descripcion text-primary" href={`/almacen/productos/${record.id._id}`} target="blank">Ver producto</a>
            )
        }
    ];

    const columnsProductosDevueltos= [
        {
            title:<p className="titulo-descripcion">Fecha de devolucion</p>,
            render:(text,record) => (<p className="descripcion">{record.fecha}</p>)
        },
        {
            title:<p className="titulo-descripcion">Tipo</p>,
            render:(text,record) => (<Tag className="descripcion" color={"green"} style={{padding:"13px"}}>{record.tipo.toUpperCase()}</Tag>)
        },
        {
            title:<p className="titulo-descripcion">Cantidad de productos devueltos</p>,
            render:(text,record) => (<p className="descripcion">{record.listaProductos.length}</p>)
        },
    ];
    


    const expandedRowRender = (record,index,indent,expanded) => {
        const columns = columnsProductosRetirados.slice(0,4);
        columns.push({title:<p className="titulo-descripcion">Cantidad ingresada</p>,render:(text,record)=>{return <p className="descripcion">{record.cantidad}</p>}},{title:<p className="titulo-descripcion">Informacion del producto</p>,render:(text,record)=>{ return (<Link to={`/almacen/productos/${record.id._id}`} className="descripcion text-primary" target="_blank">Ver producto</Link>)}});
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
                <h1 className="titulo" style={{fontSize:"42px"}}>Salida del almacen</h1>
                <Divider/>
                <h1 className="titulo">Motivo</h1>
                <h1 className="descripcion">{informacionSalida.motivo}</h1> 
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <div className="row">
                            <h1 className="titulo" style={{fontSize:"32px"}}>Informacion de la salida</h1>
                            <h1 className="titulo-descripcion col-6">Tipo de la salida: </h1>
                            <h1 className="col-6 descripcion">{informacionSalida.tipo.toUpperCase()}</h1>
                            <h1 className="titulo-descripcion col-6">Costo TOTAL de la salida: </h1>
                            <h1 className="col-6 descripcion text-success">${informacionSalida.costoTotal}</h1>
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
