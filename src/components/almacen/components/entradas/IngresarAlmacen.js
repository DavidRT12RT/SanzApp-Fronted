import { Button, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState,useContext } from 'react'
import { EntradaDevolucion } from './EntradaDevolucion';
import { EntradaNormal } from './EntradaNormal';
import { SocketContext } from '../../../../context/SocketContext';
import "./assets/styles.css";
const { Paragraph, Text } = Typography;

export const IngresarAlmacen = () => {

    const [processPhase, setProcessPhase] = useState(1);
    const {socket} = useContext(SocketContext);
  

    switch (processPhase) {
        case 1:
            return (
                <div className="d-flex text-center align-items-center flex-column gap-2 p-5" style={{minHeight:"100vh"}}>
                    <h1 className="titulo" style={{fontSize:"42px"}}>Entrada a almacen</h1>
                        <span className="descripcion">
                            Selecciona primero el tipo de entrada que el producto o los productos tendra al almacen , <br/>despues comienza 
                            a escanear y listo!
                        </span>
                        <div className="container p-5 d-flex justify-content-center align-items-center gap-2 flex-wrap mt-3">
                            <div className="card p-5 d-flex justify-content-center align-items-center gap-2 text-center" style={{maxWidth:540}}>
                                <img src={require("./assets/devolucionBodega.png")} width="130" className="mb-3" />
                                <h1 className="titulo-descripcion"  style={{fontSize:"25px"}}>Entrada por devolucion </h1>
                                <p className="descripcion" style={{fontSize:"18px"}}>Material o herramientas sobrantes de alguna obra o productos devueltos de un resguardo.</p>
                                <Button type="primary" block onClick={()=>{setProcessPhase(2)}}>Seleccionar</Button>
                            </div>
                            <div className="card p-5 d-flex justify-content-center align-items-center gap-2 text-center" style={{maxWidth:540,}}>
                                <img src={require("./assets/agregarBodega.png")} width="130" className="mb-3" />
                                <h1 className="titulo-descripcion" style={{fontSize:"25px"}}>Entrada por compra directa</h1>
                                <p className="descripcion" style={{fontSize:"18px"}}>Entrada de nuevo stock de productos o producto al almacen ya registrados anteriormente.</p>
                                <Button type="primary" block onClick={()=>{setProcessPhase(3)}}>Seleccionar</Button>
                            </div>
                        </div>
                        <div className="container p-5 mt-3">
                            <Paragraph>
                                <Text strong style={{fontSize: 16,}}>
                                    Ten en cuenta las siguientes pautas antes de empezar de introducir un producto a almacen
                                </Text>
                            </Paragraph>
                            <Paragraph>
                                <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                                Si el tipo de entrada es de algun sobrante de obra o la devolucion de un resguardo, asegurate de tener 
                                el codigo de barras de la salida <br/> para poder escanearla y marcar que productos se devolveran a almacen de 
                                los retirados anteriormente
                            </Paragraph>
                            <Paragraph>
                                <InfoCircleOutlined style={{backgroundColor:"yellow",marginRight:"10px"}}/>
                                Si el tipo de entrada es NORMAL asegurate de marcar el precio de las unidades que meteras al almacen 
                            </Paragraph>
                        </div>
                </div>
            )
        case 2:
            return (
                <EntradaDevolucion socket={socket}/>
            )
        case 3:
            return (
                <EntradaNormal socket={socket}/>
            )
    }

}
