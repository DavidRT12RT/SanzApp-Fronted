import { Button } from 'antd';
import React from 'react'
const Barcode = require('react-barcode');

export const CodigoBarrasProducto = ({informacionProducto}) => {
    return (
        <>
            <div className="d-flex flex-wrap gap-2">
                <h6 className="text-muted">Codigo de barras del producto</h6>
                <span className="d-block">Este codigo de barras sera unico para este producto y servira para poderlo identificar en el almacen</span>
                <Barcode value={informacionProducto._id} />,
            </div>
        </>
    )
}
