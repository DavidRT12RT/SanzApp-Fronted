import { Button, Table } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { useInventarios } from '../../../../hooks/useInventarios';
import "./assets/style.css";

export const Inventarios = () => {


    const { isLoading,inventarios } = useInventarios();
    const columns = [
        {
            title:"Titulo",
            dataIndex:"titulo"
        },
        {
            title:"Tipo de inventario",
            dataIndex:"tipo"
        },
        {
            title:"Intervalo de fecha",
            render:(text,record)=>{
                return (
                    <p>{record.intervaloFecha[0]} --- {record.intervaloFecha[1]}</p>
                )
            }
        },
        {
            title:"Estatus",
            dataIndex:"estatus"
        },
        {
            title:"Detalles",
            render:(text,record)=>{
                return <Link to={`/almacen/inventarios/${record._id}`}>Ver mas detalles</Link>
            }
        }
    ];

    if(isLoading){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-5 text-center" style={{height:"1500px"}}>
                <div className="d-flex justify-content-end flex-wrap gap-2 align-items-center">
                    <Link to="/almacen/inventarios/registrar-inventario/"><Button type="primary" className="my-3">Crear un nuevo inventario</Button></Link>
                </div>          
                <h1 className="titulo" style={{fontSize:"40px"}}>Inventarios totales del almacen</h1>
                <h1 className="descripcion">Inventarios totales que ha tenido el almacen.</h1>
                <Table columns={columns} dataSource={inventarios} bordered className="mt-4"/>
            </div>
        )
    }
}
