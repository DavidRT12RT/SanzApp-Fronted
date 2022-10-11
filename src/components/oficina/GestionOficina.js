import { Menu, Button , message, Layout } from 'antd';
import { InfoCircleOutlined,TeamOutlined } from '@ant-design/icons';
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { SocketContext } from '../../context/SocketContext';
import { FacturasGeneralOficina } from './components/FacturasGeneralOficina';
import { fetchConToken } from '../../helpers/fetch';
import moment from "moment";

//Estilos del componente
import "./assets/styleGestionOficina.css";
import { SanzSpinner } from '../../helpers/spinner/SanzSpinner';
import { DashboardOficina } from './components/DashboardOficina';

const { Content, Footer, Sider } = Layout;

export const GestionOficina = () => {
    const startOfMonth = moment().startOf('month').locale('es').format("YYYY-MM-DD");
    const endOfMonth   = moment().endOf('month').locale('es').format("YYYY-MM-DD");
    const [activeTabKey1, setActiveTabKey1] = useState('tab1');
    const { rol } = useSelector(store => store.auth);
    const [oficinaInfo, setOficinaInfo] = useState(null);
    //const [oficinaInfoGastosMes,setOficinaInfoGastosMes] = useState({});
    const { socket } = useContext(SocketContext);
    const [key, setKey] = useState(1);
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


    const renderizarComponente = () => {
        switch (key) {
            case "1":
                return (<DashboardOficina oficinaInfo={oficinaInfo}/>) 
            
            case "2":
                return <h1>Subir facturas</h1>

            default:
                return (<DashboardOficina oficinaInfo={oficinaInfo}/>) 
        }
    }

    if(oficinaInfo === null){
        return <SanzSpinner/>
    }else{
        return (
            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={(broken) => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <div className="logo" />
                    <Menu
                        theme="light"
                        mode="inline"
                        style={{ padding: 24, minHeight: "100vh" }}
                        defaultSelectedKeys={["1"]}
                        onClick={({ key }) => setKey(key)}
                        items={[
                            {
                                key: "1",
                                icon:<InfoCircleOutlined style={{fontSize:"18px"}}/>,
                                label: "Dashboard",
                            },

                            {
                                key: "2",
                                icon: <TeamOutlined />,
                                label: "Subir facturas",
                            },
                      ]}
                    />
                </Sider>
            <Layout>
                    <Content>
                            {renderizarComponente()}
                    </Content>
               </Layout>
            </Layout>
        );
    }
}
