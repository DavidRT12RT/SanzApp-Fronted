import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useEntradas = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [entradas, setEntradas] = useState([]);
    const [entradasInformacion, setEntradasInformacion] = useState({});

    useEffect(() => {
        //Carga de camionetas
        fetchConToken("/entradas",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setEntradas(resp.entradas)
                setEntradasInformacion({total:resp.total});
            })
        setIsLoading(false);
    }, [])
    
    return {
        isLoading,
        entradas,
        entradasInformacion,
        setEntradas
    };
}
