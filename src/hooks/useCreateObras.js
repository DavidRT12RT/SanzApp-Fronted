import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useCreateObras = () => {

    const [isLoading,setisloading] = useState(true);
    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        //Carga de empleados
        fetchConToken("/obras",{},"POST")
            .then(response => response.json())
            .then(resp => setEmpleados(resp.usuarios));
        setisloading(false);
    }, []);


    
    return {
        isLoading,
        empleados
    }
}
