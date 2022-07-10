import { Button, Col, Divider, Drawer, Dropdown, Input, Menu, Row, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react'
import { useEntradas } from '../../../../hooks/useEntradas';
import { Loading } from '../../../obras/Loading';
import { ProductoCardAlmacen } from '../salidas/ProductoCardAlmacen';
const { Search } = Input;

export const EntradasAlmacen = () => {

    const { isLoading,entradas} = useEntradas();
    const [entradasRegistros, setEntradasRegistros] = useState([]);
    const [informacionRegistroParticular, setInformacionRegistroParticular] = useState(null);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    useEffect(() => {
        entradas.map(registro => registro.key = registro._id);
        setEntradasRegistros(entradas);
    }, [entradas]);

	const columns = [
		{
			title:"Tipo de entrada",
			dataIndex:"tipo",
            render:(text,record) => {
                switch (text) {
                    case "sobrante-obra":
                        return (
                            <Tag color="green">{text.toUpperCase()}</Tag>
                        )
                    case "devolucion-resguardo":
                        return (
                            <Tag color="yellow">{text.toUpperCase()}</Tag>
                        )
                    case "normal":
                        return (
                            <Tag color="red">NORMAL</Tag>
                        )
                }
            }
		},
		{
			title:"Fecha creacion",
			dataIndex:"fecha"
		},
		{
			title:"Detalles",
			render:(text,record) => {
				return <a onClick={(e)=>{
					e.preventDefault();
					//Seteando la informacion para ver el registro en particular
					setInformacionRegistroParticular(record);
					setIsDrawerVisible(true);
				}} href="">Datos completos de la entrada</a>
			}
		}
	];

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );

    const menu = (
        <Menu
			items={[
				{key:"1",label:(<a target="_blank">Obra</a>)},
				{key:"2",label:(<a target="_blank">Resguardo</a>)},
				{key:"3",label:(<a target="_blank">Merma</a>)}
			]}/>
    )

    const renderizarProductoIngresado = (producto) => {
        switch (informacionRegistroParticular.tipo) {
            /*Para caso de devolucion o sobrante de obra, este es un metodo para ejecutar codigo por dos condiciones
            sin usar el || */
            case "devolucion-resguardo":
            case "sobrante-obra" :
                return (
                    <ProductoCardAlmacen producto={producto} key={producto.id} tipo={"devuelto"}/>
                );
            case "normal":
                return (
                    <ProductoCardAlmacen producto={producto} key={producto.id} tipo={"normal"}/>
                )
        }
    }

    if(isLoading){
       return <Loading/> 
    }else{
        return (
             <>
            	<div className="d-flex mt-5 align-items-center flex-column gap-2" style={{height:"100vh",width:"100vw"}}>
                	<h1 className="display-5 fw-bold">Entradas de almacen</h1>
                	<span className="d-block text-center">
                        Aqui se mostraran el recuento total de todas los registros de las entradas a almacen, donde podras checar fecha,<br/>
                        la lista de productos ingresada a almacen,etc.
                	</span>

                    <div className="container p-5 d-flex gap-2 justify-content-center align-items-center mt-3 flex-column">
						<h4 className="fw-bold">Registros RECIENTES del almacen</h4>
                        <p className="text-muted text-center">Aqui se mostraran las 5 entradas recientes que ha tenido el almacen</p>
						<Table columns={columns} dataSource={[...entradasRegistros.slice(0,5)]} bordered/>
                    </div>

                    <div className="container p-5 d-flex gap-2 justify-content-center align-items-center mt-3 flex-column ">
						<h4 className="fw-bold">Registros TOTALES del almacen</h4>
                        <p className="text-muted text-center">Aqui se mostraran TODAS las entradas registradas del almacen desde la primera hasta la ultima</p>
						<div className="d-flex justify-content-start gap-2 flex-wrap align-items-center">
	                		<Search
                    			placeholder="Ingresa el codigo de barras de la entrada..."
                    			allowClear
                    			autoFocus
                    			enterButton="Buscar"
                    			style={{width:"500px"}}
                			/> 
                    		<Dropdown overlay={menu}>
                        		<Button onClick={(e)=> e.preventDefault()}>Filtrar por: </Button>
                    		</Dropdown>
						</div>
						<Table columns={columns} className="mt-3" dataSource={entradasRegistros} bordered/>
						{informacionRegistroParticular != null && (
							<Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);}} visible={isDrawerVisible}>
                    			<p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada de la entrada a almacen</p>
                    			<p className="site-description-item-profile-p">Informacion sobre el ingreso del almacen</p>
                                <Row>
                       			    <Col span={12}><DescriptionItem title="Fecha de la entrada" content={informacionRegistroParticular.fecha}/></Col>
                       			    <Col span={12}><DescriptionItem title="Tipo de entrada" content={informacionRegistroParticular.tipo.toUpperCase()}/></Col>
                                    <Divider/>
                    			    <p className="site-description-item-profile-p">Lista de productos ingresados a almacen</p>
                        		    <div className="d-flex justify-content-center align-items-center container p-5 gap-2 flex-column">
									{
										informacionRegistroParticular.listaProductos.map(producto => {
                                            return renderizarProductoIngresado(producto);
										})
									}
								</div>
                                </Row>
                            </Drawer>
                        )}
                    </div>

                </div>
             </>
        )
    }
}
