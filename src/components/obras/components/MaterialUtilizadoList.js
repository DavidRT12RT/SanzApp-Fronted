import React, { useEffect, useState } from 'react'
import {Input , Table } from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import 'antd/dist/antd.css';

export const MaterialUtilizadoList = ({obraInfo}) => {



    useEffect(() => {
        setValuesTable(obraInfo?.materialUtilizado); 
    }, [obraInfo]);
    
    const [dataSource, setValuesTable] = useState([{}]);

  
    const columns = [
        {
            title:"Concepto",
            key:"concepto",
            dataIndex:"concepto",
            filterDropdown:({setSelectedKeys,selectedKeys,confirm,clearFilters})=>{
                return (
                    <Input 
                    autoFocus 
                    placeholder='Filtrar por concepto...' 
                    onChange = {(e)=>{setSelectedKeys(e.target.value ? [e.target.value] : [] )}}
                    value = {selectedKeys}
                    onPressEnter = {()=> {
                        confirm()
                    }} 
                    onBlur = {()=>{
                        confirm()
                    }}>
                    </Input>
                );
            },
            filterIcon:()=>{
                return <SearchOutlined/>
            },
            onFilter:(value,record)=>{
                return record.concepto.toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            title:"Unidad",
            dataIndex:"unidad",
            key:"unidad"
        },
        {
            title:"Cantidad",
            dataIndex:"cantidad",
            key:"cantidad",
        },
        {
            title:"Motivo",
            key:"motivo",
            dataIndex:"motivo",
        },
    ];



    return (
      <>
            <p className='lead'>Material utilizado</p>
            <div className="mt-3">
                <Table columns={columns} dataSource={[...dataSource]} pagination={{pageSize:"50"}} scroll={{y:240}}/>
            </div>

  </>
  )
}