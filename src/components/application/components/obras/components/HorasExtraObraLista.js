import React, { useEffect, useState } from 'react'
import { Table, Badge } from "antd";

export const HorasExtraObraLista = ({obraInfo}) => {

    const [dataSource, setDataSource] = useState([]);
    const [empleadosObra, setEmpleadosObra] = useState([]);

    useEffect(() => {
        for(let index = 0;index < obraInfo.horasExtra.length; index++){
            //Por cada elemento de horas extra añadimos un elemento key 
            obraInfo.horasExtra[index].key = obraInfo.horasExtra[index]._id;
            for (let j = 0; j < obraInfo.horasExtra[index].registros.length; j++) {
                //Por cada registro del element añadimos un elemento key
                obraInfo.horasExtra[index].registros[j].key = obraInfo.horasExtra[index].registros[j]._id;
            }
        }
        setEmpleadosObra(obraInfo.empleados);
        setDataSource(obraInfo.horasExtra);
    }, []);
   
    useEffect(() => {
        
        for(let index = 0;index < obraInfo.horasExtra.length; index++){
            //Por cada elemento de horas extra añadimos un elemento key 
            obraInfo.horasExtra[index].key = obraInfo.horasExtra[index]._id;
            for (let j = 0; j < obraInfo.horasExtra[index].registros.length; j++) {
                //Por cada registro del element añadimos un elemento key
                obraInfo.horasExtra[index].registros[j].key = obraInfo.horasExtra[index].registros[j]._id;
            }
        }
        setDataSource(obraInfo.horasExtra);
        setEmpleadosObra(obraInfo.empleados);
    }, [obraInfo]);

    const expandedRowRender = (record,index,indent,expanded) => {
        const columns = [
        {
            title: 'Fecha de registro',
            dataIndex: 'fecha',
            key: 'date',
        },
        {
            title: 'Motivo',
            dataIndex: 'motivo',
            key: 'motivo',
            render:(text,record) => {
                    return <p>{text}</p>
            }
        },
        {
            title:"Horas",
            dataIndex:"horas",
            key:"horas",
            render:(text,record) =>{
                    return <p>{text}</p>
            }
        },
        {
            title: 'Estatus',
            key: 'estatus',
            dataIndex:"estatus",
            render: (text,record) => {
                    if(text){
                        return (<span><Badge status="success"/>Pagadas</span>)
                    }else{
                        return (<span><Badge status="error"></Badge>NO Pagadas</span>)
                    }
           }
        },
    ];


        return <Table columns={columns} dataSource={record.registros} pagination={false} with="100%"/>
    };
    const columns = [
        {
            title:"Trabajador",
            dataIndex:"trabajador",
            with:"50%",
        },
        {
            title:"Cantidad de horas extra totales",
            dataIndex:"horasTotales",
            with:"50%",
        },
        {
            title:"Cantidad de registros",
            dataIndex:"numeroRegistros",
        },
        {
            title:"Horas totales pagadas",
            dataIndex:"pagadasTodas",
            render:(text,record) =>{
                if(text){
                    return (<span><Badge status="success"/>Pagadas</span>)
                }else{
                    return (<span><Badge status="error"></Badge>NO Pagadas</span>)
                }

            }
        }
    ];

    return (
        <>
        <p className="lead">Horas extra de la obra</p>
                    <Table
                        columns = {columns}
                        dataSource = {dataSource}
                        expandable={{expandedRowRender}}
                        className="fix"
                        with="100%"
                    />
        </>
    )
}
