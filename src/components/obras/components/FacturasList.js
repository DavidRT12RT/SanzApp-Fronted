import React, { useEffect, useState } from 'react'
import {Input , Table, Modal} from 'antd';
import 'antd/dist/antd.css';

export const FacturasList = ({obraInfo}) => {

    const { Search } = Input;

    useEffect(() => {
        setValuesTable(obraInfo?.materialUtilizado); 
    }, [obraInfo]);
    
    const [dataSource, setValuesTable] = useState([{}]);

  
    const columns = [
        {
            title:"Cantidad",
            dataIndex:"cantidad",
            key:"cantidad",
        },
        {
            title:"Medida",
            dataIndex:"unidad",
            key:"unidad"
        },
        {
            title:"Concepto",
            key:"concepto",
            dataIndex:"concepto",
        },


        {
            title:"Observaciones",
            key:"observaciones",
            dataIndex:"observaciones",
        },
    ];



    return (
      <>
            <p className='lead'>Facturas de la obra / servicio</p>
            <div className="mt-3">
                <Table columns={columns} dataSource={[...dataSource]} pagination={{pageSize:"50"}} scroll={{y:240}}/>
            </div>

  </>
  )
}