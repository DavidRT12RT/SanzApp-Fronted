import React, { useState, useEffect } from "react";

//Custom hooks
import { useEmpleados } from "../../../../../hooks/useEmpleados";
import { useObras } from "../../../../../hooks/useObras";

//Component's
import { BeneficiarioCard } from "./BeneficiarioCard";

export const Beneficiarios = ({
    tipoSalida,
    cambiarBeneficiario,
    beneficiarioElegido,
}) => {
    const [beneficiarios, setBeneficiarios] = useState([]);
    const { isLoading: isLoadingObras, obras } = useObras();
    const { isLoading: isLoadingEmpleados, empleados } = useEmpleados();

    const setearBeneficiarios = () => {
        switch (tipoSalida.nombre) {
            case "obra":
                setBeneficiarios(obras);
                break;

            case "resguardo":
                setBeneficiarios(empleados);
                return;

            case "merma":
                return;
        }
    };

    useEffect(() => {
        setearBeneficiarios();
    }, [tipoSalida, isLoadingObras, isLoadingEmpleados]);

    const filtrarBeneficiarios = (e) => {
        e.preventDefault();
        const beneficiarioSearch = e.target[0].value.toLowerCase();

        if (beneficiarioSearch.length === 0) return setearBeneficiarios();

        let beneficiariosFiltro = [];

        switch (tipoSalida.nombre) {
            case "obra":
                beneficiariosFiltro = obras;
                break;
            case "resguardo":
                beneficiariosFiltro = empleados;
        }

        const beneficiariosFiltrados = beneficiariosFiltro.filter(
            (beneficiario) => {
                if (
                    (beneficiario.nombre || beneficiario.titulo)
                        .toLowerCase()
                        .includes(beneficiarioSearch)
                )
                    return beneficiario;
            }
        );

        setBeneficiarios(beneficiariosFiltrados);
    };

    if (isLoadingEmpleados || isLoadingObras)
        return (
            <p className="descripcion text-danger">
                Cargando informacion de los beneficiarios...
            </p>
        );
    else
        return (
            <>
                {tipoSalida.nombre !== "merma" && (
                    <>
                        <form onSubmit={filtrarBeneficiarios}>
                            <input
                                className="form-control descripcion barraBusqueda"
                                placeholder="Busca el beneficiario"
                                name="beneficiarioSearch"
                            ></input>
                        </form>
                    </>
                )}
                {/* <BeneficiarioCard /> */}
                {tipoSalida.nombre !== "merma" ? (
                    beneficiarios.length > 0 ? (
                        beneficiarios.map((beneficiario) => (
                            <BeneficiarioCard
                                beneficiarioElegido={beneficiarioElegido}
                                tipo={tipoSalida.nombre}
                                beneficiario={beneficiario}
                                key={beneficiario._id}
                                cambiarBeneficiario={cambiarBeneficiario}
                            />
                        ))
                    ) : (
                        <p className="descripcion text-danger">
                            Ningun beneficiario de esa categoria registrado en
                            el sistema aun!...
                        </p>
                    )
                ) : (
                    <p className="descripcion">
                        Ningun beneficiario por ser merma...
                    </p>
                )}
            </>
        );
};
