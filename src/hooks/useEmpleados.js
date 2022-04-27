import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useEmpleados = () => {

    const [isLoading,setisloading] = useState(true);
    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        //Carga de empleados
        fetchConToken("/usuarios",{},"GET")
            .then(response => response.json())
            .then(resp => setEmpleados(resp.usuarios));
        setisloading(false);
    }, []);


    
    return {
        isLoading,
        empleados
    }
}