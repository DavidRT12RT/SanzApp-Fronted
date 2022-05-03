    import { SocketContext } from './../context/SocketContext';
    import { useMapBox } from "./useMapBox";
    import { useContext, useEffect } from 'react';
    //Custom hook para tener las coords y establecer en que div queremos que el mapa se renderize

    //Sanz constructora coords 
    const puntoInicial = {
        lng:-96.136439,
        lat:19.151525,
        zoom:18
    };

    export const useSocketMapbox = () => {

        const {setRef,coords,nuevoMarcador$,movimientoMarcador$,agregarMarcador,actualizarPosicion} = useMapBox(puntoInicial);
        const { socket } = useContext(SocketContext);
        
        //Escuchar los marcadores existentes
        useEffect(() => {
            socket.on("marcadores-activos",(marcadores)=>{
                for(const key of Object.keys(marcadores)){
                    agregarMarcador(marcadores[key],key);
                }
            });
        }, [agregarMarcador]);
   


        //Suscribiendome al nuevo marcador
        useEffect(() => {
            nuevoMarcador$.subscribe(marcador =>{
                socket.emit("marcador-nuevo",marcador);
            });
        }, [nuevoMarcador$,socket]);
   
        //Movimiento marcador
        useEffect(() => {
            movimientoMarcador$.subscribe(marcador =>{
            //Emitir movimiento marcador
                socket.emit("marcador-actualizado",marcador);
            });
        }, [socket,movimientoMarcador$]);
    
        //Escuchar nuevos marcadores
        useEffect(() => {
            socket.on("marcador-nuevo",(marcador)=>{
                agregarMarcador(marcador,marcador.id);
            });
        }, [socket,agregarMarcador]);
   
        //Escuchar marcadores actualizados
        useEffect(() => {
            socket.on("marcador-actualizado",(marcador)=>{
                actualizarPosicion(marcador);
            });
        }, [socket,actualizarPosicion]);

     return {
         setRef,
         coords
     }
   }
   