import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useCategorias = () => {

    const [isLoading,setisloading] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [categoriasInformacion, setCategoriasInformacion] = useState(undefined);


    useEffect(() => {
        //Carga de empleados
        setisloading(true);
        fetchConToken("/categorias",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setCategorias(resp.categorias);
                setCategoriasInformacion({total:resp.total});
            });
        setisloading(false);
    }, []);

    /* 
        async and await method
        useEffect(() => {
        //Carga de empleados
        const fetchData = async() => {
            setisloading(true);
            const resp = await fetchConToken("/categorias",{},"GET")
            const body = await resp.json();
            setCategorias(body.categorias);
            setisloading(false);
        }
        fetchData();
    }, []);
    */




    
    return {
        isLoading,
        categorias,
        setCategorias,
        categoriasInformacion
    }
}