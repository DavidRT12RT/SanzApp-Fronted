
import { useSocketMapbox } from "../../../../../hooks/useSocketMapbox";
import "../assets/index.css";

/*Un observable es un objecto que emite valores
Yo me puedo suscribir a el y ser notificado cuando algo pase*/
//Contenedor para renderizar el mapa
export const MapaPage = () => {


    const {setRef,coords} = useSocketMapbox();

    return (
        <>
            <div className='infoWindow'>Lng: {coords.lng} | {coords.lat} | zoom: {coords.zoom}</div>
            <div className="mapContainer" ref={setRef}/>
        </>
    )
}
