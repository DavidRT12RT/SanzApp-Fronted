import { message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchConToken } from '../../../helpers/fetch';

//Components
import { SanzSpinner } from '../../../helpers/spinner/SanzSpinner';
import EmpresaAdvancedInformation from './components/EmpresaAdvancedInformation';
import EmpresaBasicInformation from './components/EmpresaBasicInformation';

//Estilos
import "./style.css";


const EmpresaScreen = () => {
    
    const [empresaInfo, setEmpresaInfo] = useState(null);
    const navigate = useNavigate();
    const { empresaId } = useParams();

    useEffect(() => {
        const fetchDataEmpresa = async() => {
            const resp = await fetchConToken(`/empresas/${empresaId}`);
            const body = await resp.json();
            if(resp.status !== 200) {
                message.error(body.msg);
                return navigate(-1);
            }
            //Todo salio bien y seteamos la informacion de la empresa
            setEmpresaInfo(body);
        }
        fetchDataEmpresa();
    }, []);
    

    if(empresaInfo === null) return <SanzSpinner/>
    else return (
        <div className="row empresaContenedorPrincipal">
            <section className="col-12 col-lg-3">
                <EmpresaBasicInformation empresa={empresaInfo}/> 
            </section>

            <section className="col-12 col-lg-9">
                <EmpresaAdvancedInformation empresa={empresaInfo}/> 
            </section>
        </div>
    )
}

export default EmpresaScreen
