import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useInventarios = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [inventarios, setInventarios] = useState([]);

    useEffect(() => {
        //Carga de todos los inventarios
        fetchConToken("/inventarios",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setInventarios(resp.inventarios);
            })
        setIsLoading(false);
    }, [])
    
    return {
        isLoading,
        inventarios
    };
}