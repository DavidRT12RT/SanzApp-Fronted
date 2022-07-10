import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useCategorias = () => {

    const [isLoading,setisloading] = useState(true);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        //Carga de empleados
        fetchConToken("/categorias",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setCategorias(resp.categorias);
            });
        setisloading(false);
    }, []);


    
    return {
        isLoading,
        categorias
    }
}