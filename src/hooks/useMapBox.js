import React, { useCallback, useEffect, useRef, useState } from 'react'
import mapboxgl, { maxParallelImageRequests } from "mapbox-gl";
import {Subject} from "rxjs";
import {v4} from "uuid";

mapboxgl.accessToken = "pk.eyJ1IjoicmFiYXdhbiIsImEiOiJjbDJtNjVqbDUwNHdqM2JtdnJoeDAxMmY5In0.yt9PURIK59WRNR7sMtnjhQ";

export const useMapBox = (puntoInicial) => {

    //Referencia al div del mapa
    const mapaDiv = useRef();
    const setRef = useCallback((node)=>{
        mapaDiv.current = node;
    },[]);
    
    //Referencia a los marcadores
    const marcadores = useRef({});

    //Observables RXJS
    const nuevoMarcador = useRef(new Subject());
    const movimientoMarcador = useRef(new Subject());

    //Mantener cordenadas en tiempo real y mapa
    const mapa = useRef();
    const [coords, setCoords] = useState(puntoInicial);



    //función para agregar marcadores
    const agregarMarcador = useCallback((event,id)=>{

        const {lng,lat} = event.lngLat || event;

        //Marcador
        const marker = new mapboxgl.Marker();
        //Establecer el id al marcador
        marker.id = id?? v4();
        marker
            .setLngLat([lng,lat])
            .addTo(mapa.current)
            .setDraggable(true);
        
        //Asignamos al objecto de marcadores
        marcadores.current[marker.id] = marker;

        //Emision de un nuevo evento
        if(!id){
            nuevoMarcador.current.next({
                id:marker.id,
                lng,
                lat
            });
        }
        //Escuchar movimiento del marcador
        marker.on("dragend",(event)=>{
            const id = event.target.id;
            const {lng,lat} = event.target.getLngLat();
            //TODO: Emitir los cambios del marcador al socket server 
            movimientoMarcador.current.next({id,lng,lat});
        });

        //Click event al marker
        /*
        marker.getElement().addEventListener("click",(event)=>{
            console.log(event);
        })
        */
    },[]);



    //Actualizar la ubicación del marcador

    const actualizarPosicion = useCallback(({id,lng,lat})=>{
        marcadores.current[id].setLngLat([lng,lat]);
    },[]);

    useEffect(()=>{
        const map = new mapboxgl.Map({
            container: mapaDiv.current,//Valor actual
            style: 'mapbox://styles/mapbox/streets-v11',
            center:[puntoInicial.lng,puntoInicial.lat],
            zoom:puntoInicial.zoom
            });
            mapa.current = map;
    },[puntoInicial]);

    useEffect(() => {
        //Cuando se mueve el mapa
        mapa.current?.on("move",()=>{

            //Obteniendo lng y lat en tiempo real
            const {lng,lat} = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            });
        });
        //Cuando se destruye este componente devolvemos esto
        return mapa.current?.off("move");
    }, []);


    //Agregar marcadores cuando hacemos click
    //TODO : Escuchar el evento con sockets y cuando llegue el evento agregar marcos con las cordenadas
    useEffect(() => {
        mapa.current?.on("click",agregarMarcador);
    }, [agregarMarcador]);
    


    return {
        agregarMarcador,
        actualizarPosicion,
        coords,
        setRef,
        marcadores,
        nuevoMarcador$:nuevoMarcador.current,
        movimientoMarcador$:movimientoMarcador.current
    }
}
