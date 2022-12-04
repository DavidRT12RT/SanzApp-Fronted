import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useObras = () => {

    const [isLoading,setisloading] = useState(true);
    const [obras, setObras] = useState([]);
    const [informacionObras, setInformacionObras] = useState({});

    useEffect(() => {
        //Carga de empleados
        const fetchData = async() => {
            setisloading(true);
            const resp = await fetchConToken("/obras");
            const body = await resp.json();

            setObras(body.obras);
            setInformacionObras({
                totalObrasActivas:body.totalObrasActivas,
                totalObrasFinalizadas:body.totalObrasFinalizadas,
                totalObrasEncontradas:body.totalObrasEncontradas
            });
            setisloading(false);
        }
        fetchData();
    }, []);


    
    return {
        isLoading,
        obras,
        setObras,
        informacionObras,
        setInformacionObras
    }
}