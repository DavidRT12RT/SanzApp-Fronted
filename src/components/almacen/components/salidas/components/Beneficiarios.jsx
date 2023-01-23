import React, { useEffect, useState } from "react";

//Beneficiarios

export const Beneficiarios = ({ tipoSalida }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [beneficiarios, setBeneficiarios] = useState(null);

    switch (tipoSalida) {
        case "obra":
            break;

        case "resguardo":
            return;

        case "merma":
            return;
    }

    if (isLoading)
        return (
            <p className="descripcion text-danger">
                Cargando informacion de los beneficiarios...
            </p>
        );
    return <div className="BeneficiariosContainer"></div>;
};
