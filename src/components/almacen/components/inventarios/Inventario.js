import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {  message,Divider,Input,Tag,Table,Button } from 'antd';
import { fetchConToken } from '../../../../helpers/fetch';
import "./assets/style.css";
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';

export const Inventario = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [inventario, setInventario] = useState({});

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
            //La busqueda salio con exito
            setInventario(body);
        }
        fetchData();
    }, []);

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

    const columns = [
        {
            title:"Nombre",
            render:(text,record)=>{
                return <span>{record.id.nombre}</span>
            }
        },
        {
            title:"Marca",
            render:(text,record)=>{
                return <span>{record.id.marca}</span>
            }
        },
        {
            title:"Categoria(s)",
            render:(text,record)=>{
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
            render:(text,record)=>{
                return <span>{record.id.unidad}</span>
            }
        },
        {
            title:"Cantidad teorica",
            render:(text,record)=>{
                return (<Input value={record.cantidadTeorica}></Input>)
            }
        },
        {
            title:"Cantidad contada",
            render:(text,record)=>{
                return (<Input></Input>)
            }
        }
    ];
    

    if(Object.keys(inventario).length === 0){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-3 p-lg-5">
                <div className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                    <Button type="primary" className="my-3 my-lg-0">Descargar PDF</Button>
                </div>
                <h1 className="titulo" style={{fontSize:"42px"}}>{inventario.titulo}</h1>
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <h1 className="titulo">Descripcion</h1>
                        <h1 className="descripcion">{inventario.descripcion}</h1>
                    </div>
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <h1 className="titulo">Informacion del inventario</h1>
                        <div className='row'>
                            <h1 className="titulo-descripcion col-6">Estatus: </h1>
                            {inventario.estatus ==="En progreso" ? <h1 className="col-6 descripcion text-success">{inventario.estatus}</h1> : <h1 className="col-6 descripcion text-danger">{inventario.estatus}</h1> }
                            <h1 className="titulo-descripcion col-6">Inventario de: </h1>
                            <h1 className="col-6 descripcion">{inventario.tipo}</h1>
                            <h1 className="titulo-descripcion col-6">Intervalo fecha: </h1>
                            <h1 className="col-6 descripcion">{inventario.intervaloFecha[0]} --- {inventario.intervaloFecha[1]}</h1> 
                            <h1 className="titulo-descripcion col-6">Fecha del reporte: </h1>
                            <h1 className="col-6 descripcion">{inventario.fechaRegistro}</h1> 
                            
                        </div>
                    </div>
                </div>
                <Divider/>
                <h1 className="titulo">Lista de productos</h1>
                {/*<Button type="primary">Guardar cambios</Button>*/}
                <Table columns={columns} dataSource={inventario.productosInventariados} className="my-3"/>
            </div>
        )
    }
}
