import { Tag } from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ObraCard = ({obra}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/aplicacion/obras/editor/${obra._id}`);
    }

    return (
        <div className="obraCard" onClick={handleClick}>
            <div className="contentLeft">
                <div className="logoContainer">
                    <img src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/empresas/empresa/${obra.empresa._id}`}/>
                </div>
                <div className="obraInformation">
                    <h1 className="titulo-descripcion">{obra.titulo} <span className="ms-3"><Tag color={obra.estado === "FINALIZADA" ? "red" : "green"}>{obra.estado}</Tag><span className="ms-2"><Tag color={obra.tipoReporte == "CORRECTIVO" ? "yellow" : "blue"}>{obra.tipoReporte}</Tag></span></span></h1>
                    <span className="text-warning"><hr/></span>
                    <p className="descripcion">{obra.empresa.nombre} <span className="text-warning">----</span> {obra.sucursal.nombre}</p> 
                </div>
            </div>
            <div className="contentRight">
                <p className="descripcion">No.Track {obra.numeroTrack}</p>
                <p className="descripcion">Fecha creacion {obra.fechaCreacion}</p>
            </div>
            <div className="triangulo"></div>
       </div>
    )
}

export default ObraCard;