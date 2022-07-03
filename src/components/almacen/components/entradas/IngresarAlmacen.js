import { Button, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useState,useContext } from 'react'
import { EntradaDevolucion } from './EntradaDevolucion';
import { EntradaNormal } from './EntradaNormal';
import { SocketContext } from '../../../../context/SocketContext';
const { Paragraph, Text } = Typography;

export const IngresarAlmacen = () => {

    const [processPhase, setProcessPhase] = useState(1);
    const {socket} = useContext(SocketContext);
  

    switch (processPhase) {
        case 1:
            return (
                <div className="d-flex mt-5 align-items-center flex-column gap-2" style={{height:"100vh",width:"100vw"}}>
                    <h1 className="display-6 fw-bold">Entrada a almacen</h1>
                        <span className="d-block text-center">
                            Selecciona primero el tipo de entrada que el producto o los productos tendra al almacen , <br/>despues comienza 
                            a escanear y listo!.
                        </span>
                        <div className="container p-5 d-flex justify-content-center align-items-center gap-2 flex-wrap mt-3">
                            <div className="card p-5 d-flex justify-content-center align-items-center gap-2 text-center" style={{maxWidth:540,maxHeight:380}}>
                                <img src={require("./assets/devolucionBodega.png")} width="130" className="mb-3" />
                                <h6>Entrada por sobrante de obra o por devolucion de resguardo</h6>
                                <p>Material o herramientas sobrantes de alguna obra o productos <br/> devueltos de un resguardo.</p>
                                <Button type="primary" block onClick={()=>{setProcessPhase(2)}}>Seleccionar</Button>
                            </div>
                            <div className="card p-5 d-flex justify-content-center align-items-center gap-2 text-center" style={{maxWidth:540,maxHeight:380}}>
                                <img src={require("./assets/agregarBodega.png")} width="130" className="mb-3" />
                                <h6>Entrada de productos o producto de forma normal</h6>
                                <p>Entrada de nuevo stock de productos o producto al almacen <br/> ya registrados anteriormente.</p>
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
