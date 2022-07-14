import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useSalidas = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [salidas, setSalidas] = useState([]);
    const [salidasInformacion, setSalidasInformacion] = useState({});

    useEffect(() => {
        //Carga de camionetas
        setIsLoading(true);
        fetchConToken("/salidas",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setSalidas(resp.salidas);
                setSalidasInformacion({total:resp.total});
            })
        setIsLoading(false);
    }, [])
    
    return {
        isLoading,
        salidas,
        salidasInformacion
    };
}
