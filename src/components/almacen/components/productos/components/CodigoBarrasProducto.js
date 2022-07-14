import { Button } from 'antd';
import React from 'react'
const Barcode = require('react-barcode');

export const CodigoBarrasProducto = ({informacionProducto}) => {
    return (
        <>
            <div className="d-flex flex-wrap gap-2">
                <Barcode value={informacionProducto._id} />,
            </div>
        </>
    )
}
