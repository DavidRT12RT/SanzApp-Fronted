import { useEffect , useState } from 'react'
import { fetchConToken } from '../helpers/fetch';

export const useCamionetas = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [camionetas, setCamionetas] = useState([]);
    const [camionetasInfo, setcamionetasInfo] = useState({});

    useEffect(() => {
        //Carga de camionetas
        fetchConToken("/camionetas",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setCamionetas(resp.camionetas);
                setcamionetasInfo({camionetasTotales:resp.camionetasTotales});
            })
        setIsLoading(false);
    }, [])
   
    return {
        isLoading,
        camionetas,
        camionetasInfo
    };
}
