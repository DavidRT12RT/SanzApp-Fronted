import { Button, Card, Divider, Dropdown, Input, Menu, Statistic, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useCamionetas } from '../../hooks/useCamionetas'
import { Loading } from '../empleados/Loading';
import { DownOutlined } from '@ant-design/icons';


export const GestionCamionetas = () => {

	const { isLoading,camionetas,camionetasInfo } = useCamionetas();
	const [camionetasInformacion, setCamionetasInformacion] = useState([]);
	const { rol } = useSelector(store => store.auth);

	useEffect(() => {
		camionetas.map(camioneta => camioneta.key = camioneta.uid);
		setCamionetasInformacion(camionetas);
	}, [camionetas]);
	
	const columns = [
		{
			title:"Marca de la camioneta",
			dataIndex:"marca",
		},
		{
			title:"Modelo de la camioneta",
			dataIndex:"modelo"
		},
		{
			title:"Fecha de compra de la camioneta",
			dataIndex:"fechaCompra"
		},
		{
			title:"Fecha registro sistema",
			dataIndex:"fechaRegistroSistema"
		},
		{
			title:"Acciones",
			render:(text,record) => {
				return <Button type="primary"><Link to={`/aplicacion/camionetas/gestion/${record.uid}`}>Ver mas detalles de la camioneta</Link></Button>
			}
		}
	];

	const menuReporte = (
		<Menu>
			<Menu.Item key={1}>Crear reporte de camionetas en general</Menu.Item>
			<Menu.Item key={2}>Crear reporte de total de gasolinas en este mes</Menu.Item>
		</Menu>
	);

	const menu = (
		<Menu>
			<Menu.Item key={1}>Chevrolet</Menu.Item>
			<Menu.Item key={2}>Nissan</Menu.Item>
			<Menu.Item key={3}>Toyota</Menu.Item>
		</Menu>
	);

	return (
		<div className="mt-lg-5 container p-5 shadow rounded">
			<div className="d-flex justify-content-between align-items-center flex-wrap">
				<h1 className="display-5">Registro total de camionetas</h1>
				<div className="d-flex justify-content-center align-items-center gap-2">
                	<Dropdown overlay={menuReporte}>
                        <Button onClick={(e)=> e.preventDefault()}>...</Button>
                    </Dropdown>
                    {(rol === "ADMIN_ROLE" || rol === "INGE_ROLE") && <Button type="primary" rounded><Link to="/aplicacion/camionetas/registro">Registrar una nueva camioneta</Link></Button>}
                </div>
			</div>
            {/*Tarjetas de información*/}
            <div className="d-flex justify-content-start flex-wrap mt-3 gap-2">
                <Card style={{width:"300px"}}>
                    <Statistic
                        title="Numero total de camionetas registradas"
                        value={23}
                        precision={0}
                        prefix="Total:"
                    />
                </Card>
                <Card style={{width:"300px"}}>
                    <Statistic
                        title="Numero total de facturas de gasolina hechas este mes"
                        value={23}
                        precision={0}
                        prefix="Total:"
                    />
                </Card>
            </div>
            <Divider/>
            <div className="d-flex justify-content-center align-items-center flex-wrap gap-2 mt-4">
                <Input.Search 
                    size="large" 
                    style={{width:"100%"}}
                    placeholder="Busca una camioneta por marca o modelo" 
                    enterButton
                    className="search-bar-class mb-3"
                />
            </div>
            <div className="d-flex justify-content-start gap-2 flex-wrap">
                <Dropdown overlay={menu} className="d-flex justify-content-center align-items-center">
                    <Button type="primary" size="large">Filtrar por marca: <DownOutlined /></Button>
                </Dropdown>
            </div>
            <Table columns={columns} dataSource={camionetasInformacion} className="mt-3" size="large"/>
            {isLoading &&<Loading/>}
		</div>
	)
}
	