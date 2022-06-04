import React, { useEffect, useState } from 'react'
import { Card, Col, Divider, Dropdown, Menu, message, Row, Space, Statistic,Table,Modal,Upload,Input, Form, InputNumber} from 'antd';
import { fetchConToken } from '../../../helpers/fetch';
import { DownOutlined ,CopyOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

export const AbonosList = ({obraInfo}) => {

    const { Search } = Input;
    
    const {_id:obraId} = obraInfo;
    const [dataAbonos, setDataAbonos] = useState([]);
    const [obraInfoAbonos, setObraInfoAbonos] = useState({});
    //Seteamos la data cada vez que el componente se monte por primera vez
    useEffect(() => {
        obraInfo.abonos.registros.map(element => element.key = element._id);
        setDataAbonos(obraInfo.abonos.registros);

        setObraInfoAbonos(obraInfo.abonos);
    }, []);

    //Seteamos la data cada vez que la obraInfo se actualize por algun socket de un cliente
    useEffect(() => {
        obraInfo.abonos.registros.map(element => element.key = element._id);
        setDataAbonos(obraInfo.abonos.registros);

        setObraInfoAbonos(obraInfo.abonos);
    }, [obraInfo]);

    const handleSearch = (value) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setDataAbonos(obraInfo.abonos.registros);
        }

        const resultadosBusqueda = obraInfo.abonos.registros.filter((elemento)=>{
            if(elemento.concepto.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setDataAbonos(resultadosBusqueda);
    }


    const handleDownloadPDF = async (values) => {
        const { archivoName } = values;
        try {
            const resp = await fetchConToken(`/uploads/obras/obra/${obraId}/abonos/${archivoName}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            //Cortamos y obtenemos el nombre
            element.setAttribute('download',archivoName);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    const menuDescargar = (record) => {

        return (
        <Menu 
            items={[
                { key: '1', label: 'Archivo PDF',onClick:()=>{handleDownloadPDF(record)}},
            ]}
        />      
        )
    }

    const columns = [
        {
            title: 'Cuenta abono',
            dataIndex: 'cuentaAbono',
            key: 'cuentaAbono',
        },
        {
            title:'Cuenta cargo',
            dataIndex:'cuentaCargo',
            key:'cuentaCargo'
        },
        {
            title: 'Concepto',
            dataIndex: 'concepto',
            key: 'concepto',
            responsive:["sm"],
        },
        {
            title: 'Fecha aplicación',
            dataIndex: 'fechaAplicacion',
            key: 'fechaAplicacion',
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

    return (
        <>
           <div>
                <h1>Abonos de la obra</h1>
                <p className="lead">
                    En esta sección se encuentran todos los abonos con su respectivo documento PDF.
                </p>
                <Divider/>
                
                {/*Buscador con autocompletado*/}
                    <Input.Search 
                        size="large" 
                        placeholder="Buscar un abono por su concepto..." 
                        enterButton
                        onSearch={handleSearch}
                        className="search-bar-class"
                    />

                {/*Tarjetas*/}
                <Row gutter={16} className="mt-3">
                    <Col xs={24} md={8}>
                        <Card>
                            <Statistic
                                title="Total de abonos"
                                value={obraInfoAbonos.cantidadTotal}
                                precision={2}
                                valueStyle={{
                                color: '#3f8600',
                                
                                }}
                                //suffix={<ArrowUpOutlined />}
                                prefix="$"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} md={8} className="mt-3 mt-md-0">
                        <Card>
                            <Statistic
                                title="Numero de registros"
                                value={obraInfoAbonos.numeroRegistros}
                                valueStyle={{
                                color: '#3f8600',
                                }}
                                prefix={<CopyOutlined/>}
                                //suffix="%"
                                />
                        </Card>
                    </Col>
                </Row>

                {/*Tabla con abonos*/}
                <Table columns={columns} dataSource={dataAbonos} bordered style={{width:"100vw"}} className="mt-3"/>
                </div>
        </>
  )
}