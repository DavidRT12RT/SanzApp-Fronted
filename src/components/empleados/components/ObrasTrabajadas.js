import { Avatar, Button, Col, DatePicker, Divider, Drawer, Dropdown, Input, List, Menu, Row, Table } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import "./style.css";
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
const { RangePicker } = DatePicker;

const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
        <p className="site-description-item-profile-p-label">{title}:</p>
        {content}
    </div>
);

export const ObrasTrabajadas = ({usuarioInfo,socket}) => {
    const [obrasTrabajadas, setObrasTrabajadas] = useState([]);
    const [isVisibleDrawer, setIsVisibleDrawer] = useState(false);
    const [obraId, setObraId] = useState(null);
    const [informacionObra, setInformacionObra] = useState();

    useEffect(() => {

        usuarioInfo.obrasTrabajadas.registros.map((element,index) => {
            element.key = index;
        });

        setObrasTrabajadas(usuarioInfo.obrasTrabajadas.registros);
    }, [usuarioInfo]);
   
    //Cada vez que cambie el obraId buscaremos información sobre la obra y la setearemos en otro estado
    useEffect(() => {
        socket.emit("obtener-obra-por-id",{obraId},(obra)=>{
            //Filtrando solo los trabajos hechos por el
            if(obra.trabajosEjecutados.length > 0) {
                obra.trabajosEjecutados = obra.trabajosEjecutados.filter(element => element.trabajador === usuarioInfo.nombre);
            }

            setInformacionObra(obra);
        });
    }, [obraId]);

    
    const columns = [            
        {
            title:"Titulo de la obra",
            key:"TituloObra",
            dataIndex:"nombreObra",
        },
        {
            title:"Rol en la obra",
            key:"rol",
            dataIndex:"rol"
        },
        {
            title:"Dirección regional",
            key:"direccionRegional",
            dataIndex:"direccionRegionalObra"
        },
        {
            title:"Detalles",
            dataIndex:"obraId",
            render:(text,record) => {
                return (
                    <a href="#" onClick={(event)=>{
                        event.preventDefault();
                        setIsVisibleDrawer(true);
                        setObraId(record.obraId);
                    }}>Ver mas detalles</a>
                )
            }
        },
    ];

    const handleFilter = ({key:value}) =>{            
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value == "Limpiar"){
            return setObrasTrabajadas(usuarioInfo.obrasTrabajadas.registros);
        }

        const resultadosBusqueda = usuarioInfo.obrasTrabajadas.registros.filter(element => {
            if(element.nombreObra.toLowerCase().includes(value.toLowerCase())){
                return element;
            }
        })

        return setObrasTrabajadas(resultadosBusqueda);
    }

    const handleSearch = (value) => {
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setObrasTrabajadas(usuarioInfo.obrasTrabajadas.registros);
        }

        const resultadosBusqueda = usuarioInfo.obrasTrabajadas.registros.filter(element => {
            if(element.nombreObra.toLowerCase().includes(value.toLowerCase())){
                return element;
            }
        })

        return setObrasTrabajadas(resultadosBusqueda);
    }

    const onChangeDate = (value, dateString) => {
        //console.log('Selected Time: ', value);//Estancias de moment
        //console.log('Formatted Selected Time: ', dateString);//fechas en string

        //Se borraron las fechas
        if(value === null){
            return setObrasTrabajadas(usuarioInfo.obrasTrabajadas.registros);
        }
        const resultadosBusqueda = usuarioInfo.obrasTrabajadas.registros.filter(element => {
            //element.fechaFactura = element.fechaFactura.slice(0,10);
            if(moment(element.fechaFinalizacion).isBetween(dateString[0],dateString[1])){
                return element;
            }
        });

        return setObrasTrabajadas(resultadosBusqueda);
    };

    const menu = (
        <Menu onClick={handleFilter}>
            <Menu.Item key="santander">Santander</Menu.Item>
            <Menu.Item key="banbajio">Banbajio</Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="Limpiar">Limpiar filtros</Menu.Item>
        </Menu>
    );

    const ShowDrawer = () => (
        <Drawer width={640} placement="right" closable={false} onClose={()=>{setIsVisibleDrawer(false)}} visible={isVisibleDrawer}>
            <p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Obra trabajada</p>
            <p className="site-description-item-profile-p">Información basica de la obra</p>
            <Row>
                <Col span={12}><DescriptionItem title="Nombre de la obra" content={informacionObra.titulo}/></Col>
                <Col span={12}><DescriptionItem title="Sucursal" content={informacionObra.sucursal}/></Col>
            </Row>
            <Row>
                <Col span={12}><DescriptionItem title="Tipo de reporte" content={informacionObra.tipoReporte}/></Col>
                <Col span={12}><DescriptionItem title="Plaza" content={informacionObra.plaza}/></Col>
            </Row>
            <Row>
                <Col span={12}><DescriptionItem title="Dirección regional" content={informacionObra.direccionRegional}/></Col>
                <Col span={12}><DescriptionItem title="Numero track" content={informacionObra.numeroTrack}/></Col>
            </Row>
            <Row>
                <Col span={12}><DescriptionItem title="Fecha de creación" content={informacionObra.fechaCreacion}/></Col>
                {informacionObra.fechaFinalizacion ? <Col span={24}><DescriptionItem title="Fecha de finalización" content={informacionObra.fechaCreacion}/></Col> : <Col span={24}><DescriptionItem title="Fecha de finalización" content={"La obra aun no termina aun!"}/></Col>}
            </Row>
            <Row>
                <Col span={24}><DescriptionItem title="Descripción de la obra" content={informacionObra.descripcion}/></Col>
            </Row>
            <Divider/>
            <p className="site-description-item-profile-p">Trabajos ejecutados del empleado dentro de la obra</p>
            <Row>
                <Col span={24}>
                    <List                           
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            pageSize: 3,
                        }}
                        dataSource={informacionObra.trabajosEjecutados}
                        renderItem={item => (
                            <>
                                <List.Item
                                    key={item.key}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar src={`http://localhost:4000/api/uploads/usuarios/${item.empleadoId}`} />}
                                        title={item.trabajoRealizado}
                                        description={item.trabajador}
                                    />
                                        {item.descripcion}
                                </List.Item>
                
                            </>
                        )}
                    />
                </Col>
            </Row>
            <Divider/>
            <p className="site-description-item-profile-p">Calificación y rol del empleado en la obra</p>
            <Row>
                <Col span={12}><DescriptionItem title="Rol del empleado dentro de la obra" content={"encargado-obra"}/></Col>
                <Col span={12}><DescriptionItem title="Calificación del empleado en la obra" content={"4/5"}/></Col>
            </Row>
            <Row>
                <Col span={24}><DescriptionItem title="Comentarios" content={"Un buen rendimiento pero le falto calentar"}/></Col>
            </Row>
        </Drawer>
    )

    return (
        <div style={{height:"100%"}}>
            {/*Buscador con autocompletado*/}
            <div className="d-flex align-items-center gap-2">
                <Input.Search 
                    placeholder="Busca una factura por su descripción o concepto" 
                    enterButton
                    onSearch={handleSearch}
                    className="search-bar-class"
                />
                <Dropdown overlay={menu} className="">
                    <Button type="primary">
                        Filtrar por empresa:
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>

            <div className="d-flex align-items-center gap-2 mt-2">
                <RangePicker onChange={onChangeDate} locale={locale}/>
            </div>
            <Table columns={columns} dataSource={obrasTrabajadas} bordered className="mt-3"/>
            {/*Si la información de la obra se setea con información*/}
            {informacionObra && <ShowDrawer/>}
        </div>
    )
}
