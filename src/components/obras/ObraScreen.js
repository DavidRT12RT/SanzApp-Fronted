import { Steps, Button, message, Space } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../../context/SocketContext';
import "./assets/style.css";
import { InfoDesarollo } from './components/InfoDesarollo';
import { InfoObra } from './components/InfoObra';
import { Presupuesto } from './components/Presupuesto';



export const ObraScreen = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  //Rol del usuario
  const rol = useSelector(state => state.auth.rol);

  //Datos de la obra
  const [obraInfo, setObraInfo] = useState({});

  //Sockets events
  const { socket } = useContext(SocketContext);
  const { obraId } = useParams();

  //Solicitando obra por id
  useEffect(()=>{
    socket.emit("obtener-obra-por-id",{obraId},(obra)=>{
      setObraInfo(obra);
    });
  },[]);

  //Escuchar si la obra se actualiza
  useEffect(() => {
    socket.on("obra-actualizada",(obra)=>{
      if(obra._id === obraInfo._id){
        setObraInfo(obra);
      }
    }) 
  }, [socket,setObraInfo,obraInfo]);

const { Step } = Steps;

const steps = [
  {
    title: 'Presupuesto',
    content: <Presupuesto/>,
  },
  {
    title: 'Desarollo de la obra',
    //content: <DesarolloInfo obraInfo={obraInfo}/>,
    content:<InfoDesarollo obraInfo={obraInfo}/>
  },
  {
    title: 'Finalización',
    content: <InfoObra/>,
  },
];

  return (
    <div className="container mt-5">
      <h1>{`${obraInfo.titulo}`}</h1>
      <span className="lead">Pulsa en los botones para navegar en cada etapa de la obra / servicio.</span>

      <Steps current={current} className="mt-5" >
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content mt-sm-2 mt-md-4">{steps[current].content}</div>

      {/* Buttons*/}
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button type="primary" className='mb-3' onClick={() => next()}>
            Siguiente etapa 
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('La obra ha finalizado!')}>
            Finalizado
          </Button>
        )}
        {current > 0 && (
          <Button className="mb-3 mx-3" onClick={() => prev()}>
            Anterior etapa
          </Button>
        )}
      </div>
    </div>
  );
};
