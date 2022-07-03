import { Button, Col, Divider, Drawer, Input, Row, Table, Tag } from 'antd'
import React, { useState, useEffect } from 'react'

export const SalidasProducto = ({registros}) => {

    const [registrosSalidas, setRegistrosSalidas] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [informacionRetiro, setInformacionRetiro] = useState(null);

    useEffect(() => {
        registros.obra.map(registro => {registro.tipo = "obra"; registro.key = registro._id;});
        registros.merma.map(registro => {registro.tipo = "merma"; registro.key = registro._id});
        registros.resguardo.map(registro => {registro.tipo = "resguardo"; registro.key = registro._id});
        setRegistrosSalidas([...registros.obra,...registros.merma,...registros.resguardo]);
    }, [registros]);

    
    const columns = [            
        {
            title:"Tipo de salida",
            key:"tipoSalida",
            dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "obra":
                        return (
                            <Tag color="green">OBRA</Tag>
                        )
                    case "resguardo":
                        return (
                            <Tag color="yellow">RESGUARDO</Tag>
                        )
                    case "merma":
                        return (
                            <Tag color="red">MERMA</Tag>
                        )
                }
            }
        },
        {
            title:"Beneficiario del producto",
            key:"beneficiario",
            dataIndex:"beneficiario",
            render:(text,record) => {
                switch (record.tipo) {
                    case "obra":
                        return (
                            <span>{record.beneficiario.titulo}</span>
                        )
                    
                    case "resguardo":
                        return (
                            <span>{record.beneficiario.nombre}</span>
                        )

                    case "merma":
                        return (
                            <span>Nadie</span>
                        )
                }
            }
        },
        {
            title:"Cantidad retirada",
            key:"cantidad",
            dataIndex:"cantidad"
        },
        {
            title:"Fecha del retiro",
            key:"fecha",
            dataIndex:"fecha"
        },
        {
            title:"Detalles",
            key:"detalles",
            dataIndex:"beneficiario",
            render: (text,record) => {
                return (
                    <a href="#" onClick={()=>{setInformacionRetiro(record);setIsDrawerVisible(true);}}>Ver mas detalles</a>
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

    const renderizarInformacionBeneficiario = () => {
        switch (informacionRetiro.tipo) {
            case "obra":
                return (
                    <>
                        <Row>
                            <Col span={12}><DescriptionItem title="Nombre de la obra" content={informacionRetiro.beneficiario.titulo}/></Col>
                            <Col span={12}><DescriptionItem title="Jefe de la obra" content={informacionRetiro.beneficiario.jefeObra}/></Col>
                        </Row>
                        <Row>
                            <Col span={12}><DescriptionItem title="Sucursal de la obra" content={informacionRetiro.beneficiario.sucursal}/></Col>
                            <Col span={12}><DescriptionItem title="Direccion regional de la obra" content={informacionRetiro.beneficiario.direccionRegional}/></Col>
                        </Row>
                        <Row>
                            <Col span={12}><DescriptionItem title="Tipo de reporte de la obra" content={informacionRetiro.beneficiario.tipoReporte}/></Col>
                            <Col span={12}><DescriptionItem title="Numero de track" content={informacionRetiro.beneficiario.numeroTrack}/></Col>
                        </Row>
                    </>
                )        
            case "resguardo":
                return (
                    <>
                        <Row>
                            <Col span={12}><DescriptionItem title="Nombre del empleado" content={informacionRetiro.beneficiario.nombre}/></Col>
                            <Col span={12}><DescriptionItem title="Correo electronico" content={informacionRetiro.beneficiario.correo}/></Col>
                        </Row>
                    </>
                )
            case "merma":
                return (
                    <p>Al ser merma no hay ninguna persona o obra que reciba el producto</p>
                );
        }
    }

    return (
        <>
            <h6 className="text-muted mt-3">Salidas del producto</h6>
            <Input.Search 
                placeholder="Busca un registro por su concepto"
                enterButton
                className="search-bar-class mt-3"
            />
            <Table columns={columns} dataSource={registrosSalidas} pagination={{pageSize:4}} className="mt-3" size="large"/>

            {/*El usuario seteo informacion de algun retiro es decir vera el drawer*/}
            {informacionRetiro != null && (
                <Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);setInformacionRetiro(null)}} visible={isDrawerVisible}>
                    <p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada del retiro</p>
                    <p className="site-description-item-profile-p">Informacion sobre el beneficiario</p>
                    {/*Informacion acerca del beneficiario */}
                    {renderizarInformacionBeneficiario()}
                    <Divider/>
                    {/*Informacion sobre la cantidad y motivo del retiro del producto del almacen*/}
                    <p className="site-description-item-profile-p">Detalles del retiro</p>
                    <Row>
                        <Col span={12}><DescriptionItem title="Fecha del retiro" content={informacionRetiro.fecha}/></Col>
                        <Col span={12}><DescriptionItem title="Cantidad retirada del producto" content={informacionRetiro.cantidad}/></Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <DescriptionItem title="Motivo del retiro" content={informacionRetiro.motivo}/>
                        </Col>
                    </Row>
                    {informacionRetiro.evidencia && (
                        <>
                            <Divider/>
                            <p>Evidencia del producto</p>
                        </>
                    )}
                    <Divider/>
                </Drawer>
            )}
        </>
    )
}
