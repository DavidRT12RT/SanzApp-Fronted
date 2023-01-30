import React from "react";

export const CardSalida = ({ tipo, tipoSalidaElegida, cambiarTipoSalida }) => {
    return (
        <div
            className={
                "cardSalida " +
                (tipo.nombre === tipoSalidaElegida.nombre ? "selected" : "")
            }
        >
            <div>
                <h1 className="sub-titulo">{tipo.nombre}</h1>
                <p className="descripcion">{tipo.descripcion}</p>
            </div>
            <input
                type="radio"
                onChange={() => {
                    cambiarTipoSalida(tipo);
                }}
                checked={tipo.nombre === tipoSalidaElegida.nombre}
                value={tipo.nombre === tipoSalidaElegida.nombre}
            />
        </div>
    );
};
