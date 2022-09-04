import { Divider, Table,Button, Tag } from 'antd'
import React, { useEffect, useState } from 'react'

import { Link } from "react-router-dom"
import { fetchConToken } from '../../../../helpers/fetch';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ReporteProductosRetiradosAlmacen } from '../../../../reportes/Obras/ReporteProductosRetiradosAlmacen';

export const ProductosRetiradoAlmacen = ({obraInfo}) => {
    
    const [salidasObra, setSalidasObra] = useState([]);

    const columns = [
        {
            title:<p className="titulo-descripcion">Motivo de la salida</p>,
            render:(text,record) => (<p className="descripcion">{record.motivo}</p>)
        },
        {
            title:<p className="titulo-descripcion">Fecha de la salida</p>,
            render:(text,record) => (<p className="descripcion">{record.fechaCreacion}</p>)
        },
        {
            title:<p className="titulo-descripcion">Cantidad de productos retirados</p>,
            //render:(text,record) =>(<p className="descripcion">{record.listaProductos.length}</p>)
            render:(text,record) => { return record.listaProductos.length === 0 ? <p className="descripcion text-success">Todos los productos devueltos a almacen</p> : <p className="descripcion">{record.listaProductos.length}</p>}
        },
    ];

    useEffect(() => {
        
        //Hacer las peticiones al backend sobre cada salida que tiene la obra registrada
        obraInfo.retiradoAlmacen.forEach(async(salidaId,index) => {
            const resp = await fetchConToken(`/salidas/${salidaId}`);
            const salida = await resp.json();
            salida.key = salida._id;
            setSalidasObra(array => [...array,salida]);
        });

    }, [obraInfo]);

    const expandedRowRender = (record,index,indent,expanded) => {

        //Productos retirados
        record.listaProductos.forEach((producto,index) => producto.key = producto._id)

        //Productos devueltos
        const productosDevueltos = [];
        record.productosDevueltos.forEach((entrada,index) => {
            //Por cada entrada iteraremos la lista de productos
            entrada.listaProductos.forEach((producto,index) => {
                producto.key = producto.id._id;
                producto.fecha = entrada.fecha;
                productosDevueltos.unshift(producto);
            })
        });

        const columnsSalidas = [
            {
                title:<p className="titulo-descripcion">Nombre del producto</p>,
                render:(text,record) => (<p className="descripcion">{record.id.nombre}</p>)
            },
            {
                title:<p className="titulo-descripcion">Categoria del producto</p>,
                render:(text,record)=> (<Tag className="descripcion"  style={{backgroundColor:record.id.categoria.color,borderColor:record.id.categoria.color,padding:"13px",maxWidth:"fit-content"}}>{record.id.categoria.nombre}</Tag>)
            },
            {
                title:<p className="titulo-descripcion">Cantidad retirada</p>,
                render:(text,record) => (<p className="descripcion">{record.cantidad}</p>)
            },
            {
                title:<p className="titulo-descripcion">Ver mas detalles</p>,
                render:(text,record) => (<Link to={`/aplicacion/almacen/${record.id._id}`} className="descripcion text-primary" target="_blank">Ver detalles</Link>)
            }
        ];

        const columnsEntrada = [
            {
                title:<p className="titulo-descripcion">Nombre del producto</p>,
                render:(text,record) => (<p className="descripcion">{record.id.nombre}</p>)
            },
            {
                title:<p className="titulo-descripcion">Categoria del producto</p>,
                render:(text,record)=> (<Tag className="descripcion"  style={{backgroundColor:record.id.categoria.color,borderColor:record.id.categoria.color,padding:"13px",maxWidth:"fit-content"}}>{record.id.categoria.nombre}</Tag>)
            },
            {
                title:<p className="titulo-descripcion">Cantidad devuelta</p>,
                render:(text,record) => (<p className="descripcion">{record.cantidad}</p>)
            },
            {
                title:<p className="titulo-descripcion">Fecha de devolcion</p>,
                render:(text,record) => (<p className="descripcion">{record.fecha}</p>)
            },
            {
                title:<p className="titulo-descripcion">Ver mas detalles</p>,
                render:(text,record) => (<Link to={`/aplicacion/almacen/${record.id._id}`} className="descripcion text-primary" target="_blank">Ver detalles</Link>)
            }
        ];

        return (
            <>
                <Divider/>
                <h1 className="titulo-descripcion text-danger mb-3">Productos retirados</h1>
                <Table columns={columnsSalidas} dataSource={record.listaProductos} bordered/>
                <Divider/>
                <h1 className="titulo-descripcion text-success mb-3">Lista de devoluciones</h1>
                <Table columns={columnsEntrada} dataSource={productosDevueltos} bordered />
            </>
        )
    }

    return (
        <div className="container p-3 p-lg-5" style={{minHeight:"100vh"}}>
            <div className="d-flex justify-content-end align-items-center">
                <PDFDownloadLink  document={<ReporteProductosRetiradosAlmacen salidas={salidasObra}/>} fileName={`reporte_productos_retirados_almacen.pdf`}>
                    {({ blob, url, loading, error }) => (<Button type="primary" loading={loading}>{loading ? "Cargando documento..." : "Descargar resumen"}</Button>)}
                </PDFDownloadLink> 
            </div>
            <h1 className="titulo">Productos retirados de almacen</h1>
            <p className="descripcion">Salidas del almacen que ha tenido la obra, aqui se mostraran todos los productos que se han retirado del almacen <br/> y fueron destinados a la obra , asi como los productos devueltos como sobrante al almacen.</p>
            <Divider/>
            <h1 className="titulo" style={{fontSize:"20px"}}>Lista de salidas</h1>
            <Table columns={columns} dataSource={salidasObra} expandable={{expandedRowRender}}/>
        </div>
    )
}
