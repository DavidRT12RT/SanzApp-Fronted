import React from "react";

//Components
import { Tag } from "antd";
import { useNavigate } from "react-router-dom";

const EmpresaCard = ({ empresa }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/aplicacion/empresas/${empresa._id}`);
    };

    return (
        <div className="empresaCard" onClick={handleClick}>
            <div className="contentLeft">
                <div className="logoContainer">
                    <img
                        src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/empresas/empresa/${empresa._id}`}
                    />
                </div>
                <div className="empresaInformation">
                    <h1 className="titulo-descripcion">
                        {empresa.nombre}{" "}
                        <span className="ms-3">
                            <Tag color={empresa.estado ? "green" : "red"}>
                                {empresa.estado ? "Activa" : "Desactiva"}
                            </Tag>
                        </span>
                    </h1>
                    <span className="text-warning">
                        <hr />
                    </span>
                    <p className="descripcion">
                        Sucursales {empresa.sucursales.length} Obras{" "}
                        {empresa.obras.length}
                    </p>
                </div>
            </div>
            <div className="triangulo"></div>
        </div>
    );
};

export default EmpresaCard;
