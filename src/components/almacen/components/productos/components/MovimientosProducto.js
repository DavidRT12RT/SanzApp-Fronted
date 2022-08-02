import { Col, Divider, Drawer, Row, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export const MovimientosProducto = ({registros,informacionProducto}) => {
    const [registrosMovimientos, setRegistrosMovimientos] = useState([]);
    const [informacionInventario, setInformacionInventario] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    useEffect(() => {
        setRegistrosMovimientos(registros);
    }, [registros]);

    const columns = [
        {
            title:"Titulo del inventario",
            render:(text,record) => {
                return (
                    <span>{record.inventario.titulo}</span>
                )
            }
        },
        {
            title:"Fecha del inventario",
            render:(text,record) => {
                return <span>{record.inventario.fechaRegistro}</span>
            }
        },
        {
            title:"Tipo",
            render:(text,record) => {
                if(record.tipo === "GANANCIA") return <Tag color={"green"} style={{fontSize:"13px",padding:"13px"}}>{record.tipo}</Tag>
                if(record.tipo === "PERDIDA") return <Tag color={"red"} style={{fontSize:"13px",padding:"13px"}}>{record.tipo}</Tag>
                if(record.tipo === "NEUTRAL") return <Tag color={"cyan"} style={{fontSize:"13px",padding:"13px"}}>{record.tipo}</Tag>
            },
        },
        {
            title:"Detalles",
            render:(text,record) => {
                return (
                    <a href="#" onClick={()=>{setInformacionInventario(record);setIsDrawerVisible(true);}}>Ver mas detalles</a>
                )
            }
        }
    ];

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );
    
    return (
        <>
            <Table columns={columns} bordered dataSource={registrosMovimientos}/>
            {informacionInventario != null && (
            <Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);setInformacionInventario(null)}} visible={isDrawerVisible}>
                <p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada del inventario</p>
                <Row>
                    <Col span={24}><DescriptionItem title="Titulo" content={informacionInventario.inventario.titulo}/></Col>
                    <Col span={24}><DescriptionItem title="Descripcion" content={informacionInventario.inventario.descripcion}/></Col>
                    <Col span={24}><DescriptionItem title="Tipo de inventario" content={informacionInventario.inventario.tipo}/></Col>
                    <Col span={24}><DescriptionItem title="Estatus del inventario" content={informacionInventario.inventario.estatus}/></Col>
                    <Divider/>
                    <Col span={12}><DescriptionItem title="Cantidad teorica" content={informacionInventario.cantidadTeorica}/></Col>
                    <Col span={12}><DescriptionItem title="Cantidad contada" content={informacionInventario.cantidadContada}/></Col>
                    <Divider/>
                    <Col span={24}><DescriptionItem title="Fecha del inventario" content={informacionInventario.inventario.fechaRegistro}/></Col>
                    <Col span={24}><DescriptionItem title="Intervalo de fecha del inventario" content={informacionInventario.inventario.intervaloFecha.join(" --- ")}/></Col>
                    <Divider/>
                    <Link to={`/almacen/inventarios/${informacionInventario.inventario._id}`}>Ver detalles completos del inventario</Link>
                </Row>
            </Drawer>
            )}
        </>

    )
}
