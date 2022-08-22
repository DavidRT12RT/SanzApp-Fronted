import { Card } from 'antd';
import React,{ useState } from 'react'

import { GastosComprobables } from './GastosComponents/GastosComprobables';
import { GastosGeneral } from './GastosComponents/GastosGeneral';
import { GastosNOComprobables } from './GastosComponents/GastosNOComprobables';
import { GastosOficina } from './GastosComponents/GastosOficina';
import { GastosResumen } from './GastosComponents/GastosResumen';


export const FacturasLista = ({socket,obraInfo}) => {
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');


    const tabList = [
        {
            key: 'tab1',
            tab: 'Gastos comprobables',
        },
        {
            key: 'tab2',
            tab: 'Gastos NO comprobables',
        },
        {
            key:'tab3',
            tab:"Gastos hechos desde la oficina"
        },
        {
            key:'tab4',
            tab:"Resumen de gastos"
        },
    ];

    /*
    const contentList = 
        {
            tab1:<GastosComprobables obraInfo={obraInfo} socket={socket}/>,
            tab2:<GastosNOComprobables obraInfo={obraInfo} socket={socket}/>,
            tab3:<GastosOficina obraInfo={obraInfo} socket={socket}/>,
            tab4:<GastosResumen obraInfo={obraInfo} socket={socket}/>,
            tab5:<GastosGeneral obraInfo={obraInfo} socket={socket} tipo={"comprobables"}/>
        };
    */

    const contentList = {
        tab1:<GastosGeneral obraInfo={obraInfo} socket={socket} tipo={"comprobables"}/>,
        tab2:<GastosGeneral obraInfo={obraInfo} socket={socket} tipo={"NoComprobables"}/>,
        tab3:<GastosGeneral obraInfo={obraInfo} socket={socket} tipo={"oficina"}/>,
        tab4:<GastosResumen obraInfo={obraInfo} socket={socket}/>,
    }

    return (
        <>
            <Card
                className="p-lg-5 container"
                style={{minHeight:"100vh",margin:"0 auto"}}
                tabList={tabList}
                activeTabKey={activeTabKey1}
                onTabChange={key => {
                    setActiveTabKey1(key);
                }}
            >
                {contentList[activeTabKey1]}
            </Card>
        </>
    )
}
