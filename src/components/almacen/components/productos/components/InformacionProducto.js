import { Avatar, Row } from 'antd'
import React from 'react'

export const InformacionProducto = ({informacionProducto}) => {
    return (
        <div className="p-5 d-flex align-items-center flex-wrap gap-2 row">
            <Avatar shape="square"  className="col-12" style={{width:"150px",height:"150px"}} src={`http://localhost:4000/api/uploads/productos/${informacionProducto._id}`}/>
            <h5 className="fw-bold col-12">{informacionProducto.nombre}</h5>
            <span className="text-muted col-12">{informacionProducto._id}</span>
        </div>
    )
}
