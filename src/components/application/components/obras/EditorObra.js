import React, { useContext, useEffect, useState } from "react";
import { Layout, Menu, message } from "antd";
import {
    TeamOutlined,
    FileOutlined,
    DollarCircleOutlined,
    ToolOutlined,
    PlusCircleOutlined,
    AuditOutlined,
    CheckSquareOutlined,
    CloudServerOutlined,
    InfoCircleOutlined,
    ShoppingCartOutlined,
    FrownOutlined,
    AreaChartOutlined
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { TrabajosEjecutados } from "./components/EditorComponents/TrabajosEjecutados";
import { FacturasLista } from "./components/EditorComponents/FacturasLista";
import { TrabajadoresLista } from "./components/EditorComponents/TrabajadoresLista";
import { HorasExtra } from "./components/EditorComponents/HorasExtra";
import { AbonosLista } from "./components/EditorComponents/AbonosLista";
import { CobrosObra } from "./components/EditorComponents/CobrosObra";
import { ComentariosObra } from "./components/EditorComponents/ComentariosObra";
import { ArchivosGenerales } from "./components/EditorComponents/ArchivosGenerales";
import { FinalizarObra } from "./components/EditorComponents/FinalizarObra";
import { RetiradoAlmacen } from "./components/EditorComponents/RetiradoAlmacen";
import { InformacionGeneral } from "./components/EditorComponents/InformacionGeneral";
import { ProductosRetiradoAlmacen } from "./components/EditorComponents/ProductosRetiradosAlmacen";
import { IncidentesObra } from "./components/EditorComponents/IncidentesObra";
import { EstadisticasObra } from "./components/EditorComponents/EstadisticasObra";

//Estilos CSS
import "./assets/styleEditor.css";
import { SocketContext } from "../../../../context/SocketContext";

const { Content, Sider } = Layout;

export const EditorObra = () => {
    //Datos de la obra
    const [obraInfo, setObraInfo] = useState({});
    const navigate = useNavigate();

    //Sockets events
    const { socket } = useContext(SocketContext);
    const { obraId } = useParams();

    //Solicitando obra por id
    useEffect(() => {
        socket.emit("obtener-obra-por-id", { obraId }, (obra) => { setObraInfo(obra)});
    }, [socket, obraId]);

    //Escuchar si la obra se actualiza
    useEffect(() => {
        socket.on("obra-actualizada", (obra) => {
            if(JSON.stringify(obra._id) === JSON.stringify(obraInfo._id)) setObraInfo(obra);
        });
    }, [socket, setObraInfo, obraInfo]);
    const [key, setKey] = useState(1);

    const renderizarComponente = () => {
        switch (key) {
            case "1":
                //Informacion general de la obra
                return (
                    <InformacionGeneral obraInfo={obraInfo} socket={socket}/>
                ) 
            
            case "2":
                //Obsericiones lista
                return (
                    <ComentariosObra obraInfo={obraInfo} socket={socket}/>
                )

            case "3":
                //Trabajadores lista
                return (
                    <TrabajadoresLista socket={socket} obraInfo={obraInfo} />
                );

            case "4":
                //Facturas lista
                return <FacturasLista socket={socket} obraInfo={obraInfo} />;

            case "5":
                //Abonos lista
                return <AbonosLista socket={socket} obraInfo={obraInfo} />;

            case "6":
                return (
                    <TrabajosEjecutados socket={socket} obraInfo={obraInfo} />
                );

            case "7":
                return <HorasExtra socket={socket} obraInfo={obraInfo} />;


            case "9":
                return <CobrosObra socket={socket} obraInfo={obraInfo} />;


            case "11":
                return <ArchivosGenerales socket={socket} obraInfo={obraInfo}/>
            
            case "12":
                //return ( <MaterialUtilizado socket={socket} obraInfo={obraInfo} />);
                return <ProductosRetiradoAlmacen socket={socket} obraInfo={obraInfo}/>
                    
            case "13":
                return <FinalizarObra socket={socket} obraInfo={obraInfo}/>
            
            case "14":
                //Material y herramientas retiradas de almacen
                return ( <RetiradoAlmacen obraInfo={obraInfo}/>) 

            case "15":
                return (<IncidentesObra obraInfo={obraInfo} socket={socket}/>)
            
            case "16":
                return (<EstadisticasObra obraInfo={obraInfo} socket={socket}/>)
            default:
                //Informacion general de la obra
                return (
                    <InformacionGeneral obraInfo={obraInfo} socket={socket}/>
                ) 
        }
    };
    if (Object.keys(obraInfo).length === 0 ) {
        return <h1>Cargando informacion de la obra..</h1>;
    }else if(obraInfo.estado === "FINALIZADA"){
        navigate("/aplicacion/obras");
        return message.error("Obra se encuentra finalizada NO puedes editarla");
    }
    else{
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
                                icon:<InfoCircleOutlined />,
                                label: "Informacion general",
                            },

                            {
                                key: "3",
                                icon: <TeamOutlined />,
                                label: "Trabajadores",
                            },
                            {
                                key: "4",
                                icon: <FileOutlined />,
                                label: "Gastos",
                            },
                            {
                                key: "5",
                                icon: <AuditOutlined />,
                                label: "Abonos",
                            },
                            {
                                key: "7",
                                icon: <PlusCircleOutlined />,
                                label: "Horas extra",
                            },
                            {
                                key: "9",
                                icon: <DollarCircleOutlined />,
                                label: "Cobros de la obra",
                            },
                            {
                                key: "16",
                                icon: <AreaChartOutlined />,
                                label: "Estadistica",
                            },
                            {
                                key: "6",
                                icon: <ToolOutlined />,
                                label: "Trabajos",
                            },
 
                            /*
                            {
                                key: "8",
                                icon:<CameraOutlined />,
                                label: "Imagenes de la obra",
                            },
                            */
                            /*
                            {
                                key: "2",
                                icon: <EyeOutlined />,
                                label: "Observaciones",
                            },
                            */
                            {
                                key:"11",
                                icon:<CloudServerOutlined />,
                                label:"Archivos en general"
                            },
                            {
                                key:"12",
                                icon:<ShoppingCartOutlined />,
                                label:"Productos retirados del almacen"
                            },
                            {
                                key:"15",
                                icon:<FrownOutlined />,
                                label:"Incidentes de la obra"
                            },
                            {
                                key:"13",
                                icon:<CheckSquareOutlined />,
                                label:"Finalizar obra"

                            }
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
};

