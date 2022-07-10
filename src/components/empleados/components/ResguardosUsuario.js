import { Button, Col, Divider, Drawer, Input, message, Row, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { fetchConToken } from '../../../helpers/fetch';
import { ProductoCardAlmacen } from '../../almacen/components/salidas/ProductoCardAlmacen';
import { Loading } from '../../obras/Loading';

export const ResguardosUsuario = ({usuarioInfo,socket}) => {
    
    const [resguardos, setResguardos] = useState(null);
	const [informacionRegistroParticular, setInformacionRegistroParticular] = useState(null);
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    useEffect(() => {

        setResguardos(usuarioInfo.resguardos);

    }, [usuarioInfo]);
   
    const columns = [
        {
            title:"Motivo del resguardo",
            dataIndex:"motivo"
        },
        {
            title:"Fecha",
            dataIndex:"fechaCreacion"
        },
        {
            title:"Estado",
            dataIndex:"devueltoTotal",
            render:(text,record) => {
                return (
                    text ? <Tag color="green">DEVUELTO</Tag> : <Tag color="red">NO DEVUELTO</Tag>
                )
            }
        },
        {
            title:"Detalles del resguardo",
            render:(text,record) => {
                return (
                    <a href="#" onClick={()=>{					
                        setInformacionRegistroParticular(record);
					    setIsDrawerVisible(true);
                    }}>Ver mas detalles</a>

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

    const handleDownloadEvidencia = async () => {
        try {
            const resp = await fetchConToken("/salidas/documento-pdf",{salidaId:informacionRegistroParticular._id},"POST");
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',`${informacionRegistroParticular._id}.pdf`);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    const handleDownloadEvidenciaResguardosTotales = async () => {
        try {
            const resp = await fetchConToken(`/usuarios/documento-pdf-resguardos-totales/${usuarioInfo.uid}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',`resguardosTotales.pdf`);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    if(resguardos === null){
        return <Loading/>
    }else{
        return (
            <>
                <span>Descargar PDF con la lista de resguardos TOTALES que tiene el empleado &gt; <a href="#" onClick={(e)=>{e.preventDefault();handleDownloadEvidenciaResguardosTotales()}}>Click aqui!</a></span>
                <Table columns={columns} dataSource={resguardos} bordered className="mt-3"/>
				{informacionRegistroParticular != null && (
					<Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);}} visible={isDrawerVisible}>
                    	<p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada de la salida de almacen</p>
                    	<p className="site-description-item-profile-p">Informacion sobre el retiro del almacen</p>
						<Row>
                       		<Col span={12}><DescriptionItem title="Fecha de la salida" content={informacionRegistroParticular.fechaCreacion}/></Col>
                            <Col span={12}><DescriptionItem title="Tipo de la salida" content={informacionRegistroParticular.tipo}/></Col>
						</Row>
						<Row>
                       		<Col span={24}><DescriptionItem title="Motivo de la salida" content={informacionRegistroParticular.motivo}/></Col>
						</Row>
						<Divider/>
                    	<p className="site-description-item-profile-p">Lista de productos retirados del almacen</p>
                        <div className="d-flex justify-content-center align-items-center container p-5 gap-2 flex-column">
							{
								informacionRegistroParticular.listaProductos.length > 0 
									? 
										informacionRegistroParticular.listaProductos.map(producto => {
                                    		return <ProductoCardAlmacen key={producto.id._id} producto={producto} tipo={"retirado"}/>
										})
									:
                                	<h2 className="fw-bold text-white text-center bg-success p-3">Todos los productos han sido devueltos!</h2>
							}
						</div>
						<Divider/>
                    	<p className="site-description-item-profile-p">Devoluciones al almacen</p>
						{
							informacionRegistroParticular.productosDevueltos.map(entrada => {
								{
									return (
										<div className="d-flex justify-content-center align-items-center flex-wrap">
											<p className="text-success text-center mt-3">Fecha de devolucion<br/>{entrada.fecha}</p>
											{
												entrada.listaProductos.map(productoDevuelto => {
													//return <ProductoCardDevuelto producto={productoDevuelto} key={productoDevuelto._id}/>
													return <ProductoCardAlmacen producto={productoDevuelto} key={productoDevuelto._id} tipo={"devuelto"}/>
												})
											}
										</div>
									)
								}
							})
						}
						<Divider/>
                    	<p className="site-description-item-profile-p">Documento PDF de la salida</p>
						<Button type="primary" onClick={handleDownloadEvidencia}>Descargar documento de evidencia</Button>
                	</Drawer>
				)}
            </>
        )
    }
}
