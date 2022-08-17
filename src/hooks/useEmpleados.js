import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useEmpleados = () => {

    const [isLoading,setisloading] = useState(true);
    const [empleados, setEmpleados] = useState([]);
    const [empleadosEstadoInfo, setEmpleadosInfo] = useState({});

    useEffect(() => {
        //Carga de empleados
        setisloading(true);
        fetchConToken("/usuarios",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setEmpleados(resp.usuarios);
                setEmpleadosInfo({empleadosActivos:resp.empleadosActivos,empleadosDesactivados:resp.empleadosDesactivados});
            });
        setisloading(false);
    }, []);
    
    return {
        isLoading,
        empleados,
        empleadosEstadoInfo
    }
}
