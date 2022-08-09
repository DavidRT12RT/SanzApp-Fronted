import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useEmpresas = () => {

    const [isLoading,setisloading] = useState(true);
    const [empresas, setEmpresas] = useState([]);
    const [empresasInfo, setEmpresasInfo] = useState({});

    useEffect(() => {
        //Carga de empresas 
        setisloading(true);
        fetchConToken("/empresas/",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setEmpresas(resp.empresas);
            });
        setisloading(false);
    }, []);


    
    return {
        isLoading,
        empresas
    }
}
