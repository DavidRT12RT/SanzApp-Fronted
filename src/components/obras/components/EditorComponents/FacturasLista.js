import { Card } from 'antd';
import React,{ useState } from 'react'

import { GastosComprobables } from './GastosComponents/GastosComprobables';
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
            }

        ];

    const onTab1Change = key => {
         setActiveTabKey1(key);
    };

    const contentList = 
        {
            tab1:<GastosComprobables obraInfo={obraInfo} socket={socket}/>,
            tab2:<GastosNOComprobables obraInfo={obraInfo} socket={socket}/>,
            tab3:<GastosOficina obraInfo={obraInfo} socket={socket}/>,
            tab4:<GastosResumen obraInfo={obraInfo} socket={socket}/>
        };

    return (
        <>
            <Card
                className="p-lg-3 shadow"
                tabList={tabList}
                activeTabKey={activeTabKey1}
                onTabChange={key => {
                onTab1Change(key);
                }}
            >
                {contentList[activeTabKey1]}
            </Card>
        </>
    )
}
