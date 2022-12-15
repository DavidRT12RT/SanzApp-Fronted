import { Avatar, Divider, List } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const UsuarioResguardos = ({userInfo}) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        let resguardos = userInfo.resguardos.map(resguardo => (
            {
                motivo:resguardo.motivo,
                devueltoTotal:resguardo.devueltoTotal,
                fechaCreacion:resguardo.fechaCreacion,
                cantidadProductosRetirados:resguardo.listaProductos.length,
                costoTotal:resguardo.costoTotal,
                key:resguardo._id
            }
        ));
        setData(resguardos);
    }, [userInfo]);
    
    return (
        <div className="userInfoContainer mt-4">
            <h1 className="titulo">Resguardos almacen</h1>
            {
                data.length > 0
                    ?
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={(item) => (
                            <List.Item key={item.key}>
                                <List.Item.Meta
                                    title={<Link target="_blank" to={`/almacen/salidas/${item.key}`}>SALIDA ALMACEN</Link>}
                                    description={item.fechaCreacion.toUpperCase()}
                                />
                                <p className="text-warning">Motivo salida:</p>
                                {item.motivo}
                                <p className="text-warning">Productos retirados:</p>
                                {item.cantidadProductosRetirados}
                                <p className="text-warning">Costo de salida:</p>
                                <p className="text-success">${item.costoTotal}</p>
                                <p className="text-warning">Devuelto TOTAL:</p>
                                {item.devueltoTotal ? <p className="text-success">DEVUELTO</p> : <p className="text-danger">NO-DEVUELTO</p>}
                            </List.Item>
                        )}
                    />
                :
                <p className="titulo-descripcion text-danger">Ningun resguardo registrado aun...</p>
            }
       </div>
    )
}

export default UsuarioResguardos