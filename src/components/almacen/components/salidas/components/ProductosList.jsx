//Component's
import { ProductoCard } from "./ProductoCard";

export const ProductosList = ({
    productos,
    cambiarCantidadProducto=false,
    eliminarProducto=false,
}) => {
    return (
        <div className="productosList">
            {productos.map((producto) => {
                return (
                    <>
                        <ProductoCard
                            producto={producto}
                            key={producto._id}
                            cambiarCantidadProducto={cambiarCantidadProducto}
                            eliminarProducto={eliminarProducto}
                        />
                        <hr />
                    </>
                );
            })}
        </div>
    );
};
