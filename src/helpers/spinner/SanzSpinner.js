import React from "react";
import "./style.css";

export const SanzSpinner = () => {
    return (
        <div
            className="d-flex justify-content-center align-items-center flex-wrap"
            style={{ height: "100vh", width: "100vw" }}
        >
            <div className="loader"></div>
            {/* <p className="titulo">Cargando informacion...</p> */}
        </div>
    );
};
