import React, { useContext, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { EyeOutlined, TeamOutlined, FileOutlined, FileImageOutlined, DollarCircleOutlined, ToolOutlined, TagOutlined, PlusCircleOutlined} from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { MaterialUtilizado } from './components/EditorComponents/MaterialUtilizado';
import { SocketContext } from '../../context/SocketContext';
import { TrabajosEjecutados } from './components/EditorComponents/TrabajosEjecutados';
import { Imagenes } from './components/EditorComponents/Imagenes';
import { FacturasLista } from './components/EditorComponents/FacturasLista';
import { TrabajadoresLista } from './components/EditorComponents/TrabajadoresLista';
import { HorasExtra } from './components/EditorComponents/HorasExtra';
import { AbonosLista } from './components/EditorComponents/AbonosLista';

const { Content, Footer, Sider } = Layout;

export const EditorObra = () => {
    //Datos de la obra
    const [obraInfo, setObraInfo] = useState({});

    //Sockets events
    const { socket } = useContext(SocketContext);
    const { obraId } = useParams();

    //Solicitando obra por id
    useEffect(()=>{
      socket.emit("obtener-obra-por-id",{obraId},(obra)=>{
        obra.materialUtilizado.map((element,index) => {element.key = index});
        setObraInfo(obra);
      });
    },[socket,obraId]);

    //Escuchar si la obra se actualiza
    useEffect(() => {
      socket.on("obra-actualizada",(obra)=>{
        if(obra._id === obraInfo._id){
          obra.materialUtilizado.map((element,index) => {element.key = index});
          setObraInfo(obra);
        }
      }) 
    }, [socket,setObraInfo,obraInfo]);
    
    const [key, setKey] = useState(1);

    const renderizarComponente = () =>{
      switch (key) {
        case "1":
          //Material utilizado
          return <MaterialUtilizado socket = {socket} obraInfo = {obraInfo} />;

        case "2":
          //Observaciones lista
          console.log("Observaciones componenete!");
          break;

       case "3":
          //Trabajadores lista
          return <TrabajadoresLista socket = {socket} obraInfo = {obraInfo} />
        
        case "4":
          //Facturas lista
          return <FacturasLista socket = {socket} obraInfo = {obraInfo} />;
        
        case "5":
          //Abonos lista
          return <AbonosLista socket = {socket} obraInfo = {obraInfo}/>

        case "6":
          return <TrabajosEjecutados socket = {socket} obraInfo = {obraInfo}/>

        case "7":
          return <HorasExtra socket = {socket} obraInfo = {obraInfo}/>;

        case "8":
          return <Imagenes socket = {socket} obraInfo = {obraInfo}/>

        default:
          return <MaterialUtilizado obraInfo = {obraInfo} socket = {socket}/>;
      }
    }
  if(obraInfo === undefined){
    return <h1>Loading...</h1>
  }else{
  return (
  <Layout>
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      onBreakpoint={broken => {
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
        style={{ padding: 24, minHeight:"100vh" }}
        defaultSelectedKeys={['1']}
        onClick={({key}) => setKey(key)}
        items={[
              {
                key: '1',
                icon: <TagOutlined />,
                label: 'Materiales',
              },
              {
                key: '2',
                icon: <EyeOutlined />,
                label: 'Observaciones',
              },
              {
                key: '3',
                icon: <TeamOutlined/>,
                label: 'Trabajadores',
              },
              {
                  key:'4',
                  icon:<FileOutlined/>,
                  label:'Gastos'
              },
              {
                  key:'5',
                  icon:<DollarCircleOutlined />,
                  label:'Abonos'
              },
              {
                  key:'6',
                  icon:<ToolOutlined />,
                  label:'Trabajos'
              },
              {
                key:'7',
                icon :<PlusCircleOutlined />,
                label:"Horas extra"
              },
              {
                  key:'8',
                  icon:<FileImageOutlined />,
                  label:'Imagenes de la obra'
              }

            ]}
      />
    </Sider>
    <Layout>
      <Content style={{ margin: '24px 16px 0' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight:"100vh" }}>
            {renderizarComponente()}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}><b>@Sanz Constructora 2022</b>
      <br/>
            App by David Arcos Melgarejo
      </Footer>
    </Layout>
  </Layout>
  )
  }
}