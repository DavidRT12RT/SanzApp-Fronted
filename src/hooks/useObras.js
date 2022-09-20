import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useObras = () => {

    const [isLoading,setisloading] = useState(true);
    const [obras, setObras] = useState([]);

    useEffect(() => {
        //Carga de empleados
        fetchConToken("/obras",{},"GET")
            .then(response => response.json())
            .then(resp => setObras(resp.obras));
        setisloading(false);
    }, []);


    
    return {
        isLoading,
        obras,
        setObras
    }
}