import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useSalidas = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [salidas, setSalidas] = useState([]);

    useEffect(() => {
        //Carga de camionetas
        fetchConToken("/salidas",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setSalidas(resp.salidas)
            })
        setIsLoading(false);
    }, [])
    
    return {
        isLoading,
        salidas,
    };
}
