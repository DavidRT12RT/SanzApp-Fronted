import React from "react";

export const BeneficiarioCard = ({
    beneficiario,
    cambiarBeneficiario,
    beneficiarioElegido,
}) => {
    return (
        <div
            className={
                "beneficiarioCard " +
                (beneficiarioElegido === (beneficiario.uid || beneficiario._id)
                    ? "selected"
                    : "")
            }
        >
            <div>
                <h1 className="sub-titulo">
                    {beneficiario.nombre || beneficiario.titulo}
                </h1>
                <p className="descripcion">
                    {beneficiario.rol || beneficiario.sucursal.nombre}
                </p>
            </div>

            <input
                type="radio"
                onChange={() =>
                    cambiarBeneficiario(beneficiario.uid || beneficiario._id)
                }
                checked={
                    beneficiarioElegido ===
                    (beneficiario.uid || beneficiario._id)
                }
                value={
                    beneficiarioElegido ===
                    (beneficiario.uid || beneficiario._id)
                }
            />
        </div>
    );
};
