import { Input } from 'antd';
import React from 'react'
import { Link } from 'react-router-dom';
import heroSectionImg from "./assets/imgs/49a7c583-ae81-4340-828b-a5e88706dad2.png";

const HeroSection = () => {
    return (
        <section className="heroSectionEmpresas">
            <div className="content">
                <h1 className="titulo text-warning">Empresas</h1>
                <p className="descripcion"><b>Administra</b> las empresas registradas en el sistema , asi como sus <b>sucursales</b> y <b>obras</b> de cada una.</p>
                <div className="mt-3">
                    <Link to={`/aplicacion/empresas/registrar`}><button className="btn btn-warning">Registrar empresa</button></Link>
                </div>
            </div>
            <img src={heroSectionImg} className="heroSectionImg"/>
        </section>
    )
}

export default HeroSection;