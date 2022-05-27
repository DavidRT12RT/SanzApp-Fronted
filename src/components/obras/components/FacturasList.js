import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Divider, Dropdown, Menu, message, Row, Space, Statistic,Table,Modal,Upload,Input} from 'antd';
import { DownOutlined,UploadOutlined ,CopyOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { fetchConToken } from "../../../helpers/fetch";

export const FacturasList = ({obraInfo}) => {


    const [dataFacturas, setDataFacturas] = useState([]);
    const [obraInfoFacturas, setObraInfoFacturas] = useState({});
    const {_id:obraId} = obraInfo;
    const [isModalVisible, setIsModalVisible] = useState(false);
    
    //Seteamos la data cada vez que el componente se monte por primera vez
    useEffect(() => {
        obraInfo.facturas.registros.map(element => element.key = element._id);
        setDataFacturas(obraInfo.facturas.registros);

        setObraInfoFacturas(obraInfo.facturas);
    }, []);

    const showModal = () => {
        setIsModalVisible(true);
    };


    //Seteamos la data cada vez que la obraInfo se actualize por algun socket de un cliente
    useEffect(() => {
        obraInfo.facturas.registros.map(element => element.key = element._id);
        setDataFacturas(obraInfo.facturas.registros);

        setObraInfoFacturas(obraInfo.facturas);
    }, [obraInfo]);
    

    const columns = [
        {
            title: 'Importe total factura',
            dataIndex: 'importeFactura',
            key: 'importeFactura',
            sorter: (a, b) => a.importeFactura - b.importeFactura,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Descripción o motivo de la factura',
            dataIndex: 'descripcionFactura',
            key: 'descripcionFactura',
        },
        {
            title: 'Fecha de la factura',
            dataIndex: 'fechaFactura',
            key: 'fechaFactura',
            responsive:["sm"],
        },
        {
            title: 'Descargar documentos',
            dataIndex: 'documentos',
            key: 'tags',
            render: (text,record) => {
                return (
                    <Space size="middle">
                        <Dropdown overlay={menuDescargar(record)}>
                            <a>
                                Descargar <DownOutlined />
                            </a>
                        </Dropdown>
                    </Space>
                )
            },
        }
    ];

    const handleSearch = (value) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setDataFacturas(obraInfo.facturas.registros);
        }

        const resultadosBusqueda = obraInfo.facturas.registros.filter((elemento)=>{
            if(elemento.descripcionFactura.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setDataFacturas(resultadosBusqueda);
    }

    const handleDownloadPDF = async (nombreArchivo,folioFactura) => {
        try {
            const resp = await fetchConToken(`/uploads/obras/obra/${obraId}/facturas/${folioFactura}/${nombreArchivo}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',nombreArchivo);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    const handleDownloadXML = async (nombreArchivo,folioFactura) => {
        try {
            const resp = await fetchConToken(`/uploads/obras/obra/${obraId}/facturas/${folioFactura}/${nombreArchivo}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',nombreArchivo);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    const menuDescargar = (record) => {

        const {folioFactura,nombrePDF,nombreXML} = record
        return (
        <Menu 
            items={[
                { key: '1', label: 'Archivo PDF',onClick:()=>{handleDownloadPDF(nombrePDF,folioFactura)}},
                { key: '2', label: 'Archivo XML',onClick:()=>{handleDownloadXML(nombreXML,folioFactura)}},
            ]}
        />      
        )
    }
    return (
      <>
            <p className='lead'>Facturas de la obra / servicio</p>
                {/*Buscador con autocompletado*/}
                    <Input.Search 
                        size="large" 
                        placeholder="Busca una factura por su descripción o concepto" 
                        enterButton
                        onSearch={handleSearch}
                        className="search-bar-class"
                    />

                {/*Tarjetas*/}
                <Row gutter={16} className="mt-3">
                    <Col xs={24} md={8}>
                        <Card>
                            <Statistic
                                title="Total de gastos"
                                value={obraInfoFacturas.totalFacturas}
                                precision={2}
                                valueStyle={{
                                color: '#3f8600',
                                
                                }}
                                //suffix={<ArrowUpOutlined />}
                                prefix="$"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8} className="mt-3 mt-lg-0">
                        <Card>
                            <Statistic
                                title="Numero de facturas"
                                value={obraInfoFacturas.numeroFacturas}
                                valueStyle={{
                                color: '#3f8600',
                                }}
                                prefix={<CopyOutlined/>}
                                //suffix="%"
                                />
                        </Card>
                    </Col>
                </Row>

                {/*Tabla con facturas*/}
                <Table columns={columns} dataSource={dataFacturas} bordered style={{width:"100vw"}} className="mt-3"/>

  </>
  )
}