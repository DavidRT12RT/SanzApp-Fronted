import { Button, Divider, Dropdown, Input, Menu, DatePicker, Card, Statistic, message } from 'antd';
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { SocketContext } from '../../context/SocketContext';
import { FacturasGeneralOficina } from './components/FacturasGeneralOficina';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { fetchConToken } from '../../helpers/fetch';

export const GestionOficina = () => {
    const startOfMonth = moment().startOf('month').locale('es').format("YYYY-MM-DD");
    const endOfMonth   = moment().endOf('month').locale('es').format("YYYY-MM-DD");
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const { rol } = useSelector(store => store.auth);
    const [oficinaInfo, setOficinaInfo] = useState(null);
    //const [oficinaInfoGastosMes,setOficinaInfoGastosMes] = useState({});
    const { socket } = useContext(SocketContext);
    //const colecciones = ["Agua","Luz","Gas","Luz","Material","Otros","Papeleria","Predial"];
    //let totalMes = 0,numeroRegistrosMes = 0;



    //Obtener información de la oficina cuando el componente se monte
    useEffect(() => {
        const fetchData = async() => {
            const resp = await fetchConToken("/oficina");
            const body = await resp.json();
            if(resp.status === 200) return setOficinaInfo(body);
            //Hubo un error en la busqueda
            return message.error(body.msg);
        }
        fetchData();
    }, []);
   
    //Obtener la información de la oficina cuando se actualize por otro cliente
    useEffect(() => {
        socket.on("informacion-oficina-actualizada",(oficina)=>{
            setOficinaInfo(oficina);
        });
    }, [socket,setOficinaInfo]);



    const menuReporte = (
        <Menu>
            <Menu.Item key={1}>Reporte de gastos de este mes</Menu.Item>
            <Menu.Item key={2}>Reporte de gastos de una cierta colección este mes</Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="Limpiar">Limpiar filtros</Menu.Item>
        </Menu>
    );

    const onTab1Change = key => {
        setActiveTabKey1(key);
    };

	const tabList = [
        {
        	key: 'tab1',
        	tab: 'Facturas Luz',
        },
        {
        	key: 'tab2',
        	tab: 'Facturas Agua',
        },
        {
            key:'tab3',
            tab: 'Facturas Gas'
        },
        {
            key:'tab4',
            tab:'Facturas Papeleria'
        },
        {
            key:'tab5',
            tab:'Facturas de material de construcción'
        },
        {
            key:'tab6',
            tab:'Facturas Predial'
        },
        {
            key:'tab7',
            tab:'Facturas de otros tipos'
        }
    ];

    const contentList = 
        {
		    tab1:<FacturasGeneralOficina coleccion={"Luz"} socket={socket} oficinaInfo={oficinaInfo}/>,
		    tab2:<FacturasGeneralOficina coleccion={"Agua"} socket={socket} oficinaInfo={oficinaInfo}/>,
		    tab3:<FacturasGeneralOficina coleccion={"Gas"} socket={socket} oficinaInfo={oficinaInfo}/>,
            tab4:<FacturasGeneralOficina coleccion={"Papeleria"} socket={socket} oficinaInfo={oficinaInfo}/>,
            tab5:<FacturasGeneralOficina coleccion={"Material"} socket={socket} oficinaInfo={oficinaInfo}/>,
            tab6:<FacturasGeneralOficina coleccion={"Predial"} socket={socket} oficinaInfo={oficinaInfo}/>,
            tab7:<FacturasGeneralOficina coleccion={"Otros"} socket={socket} oficinaInfo={oficinaInfo}/>
        };

    if(oficinaInfo === null){
        return <h1>Loading</h1>
    }else{
        return (
            <div className="container p-5 shadow rounded">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <h1 className="display-5 fw-bold">Gestion de gastos de oficina</h1>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <Dropdown overlay={menuReporte}>
                            <Button onClick={(e)=> e.preventDefault()}>...</Button>
                        </Dropdown>
                    </div>
                    {/*Tarjetas de información*/}
                    <div className="d-flex justify-content-start flex-wrap mt-3 gap-2">
                        <Card style={{width:"300px"}}>
                            <Statistic
                                title="Numero de facturas registradas totales de todas las categorias"
                                value={oficinaInfo.gastos.registrosTotales}
                                precision={0}
                                prefix="Total:"
                            />
                        </Card>
                        <Card style={{width:"300px"}}>
                            <Statistic
                                title="Gasto totales de oficina de todas las categorias"
                                value={oficinaInfo.gastos.gastosTotales}
                                precision={2}
                                prefix="Total:"
                            />
                        </Card>
                    </div>
                    <Divider/>
                </div>
                <Card
                    className="col-12 mt-3"
				    bordered={false}
            	    tabList={tabList}
            	    activeTabKey={activeTabKey1}
            	    onTabChange={key => {
            	        onTab1Change(key);
            	    }}
        	    >
                    {contentList[activeTabKey1]}
        	    </Card>
            </div>
        )
    }
}
