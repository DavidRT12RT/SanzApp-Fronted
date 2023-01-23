import React from "react";
import { ProductoCard } from "./ProductoCard";

export const ProductosList = ({ productos }) => {
    return (
        <div className="productosList">
            {productos.map((producto) => {
                return <ProductoCard producto={producto} key={producto._id} />;
            })}
        </div>
    );
};
