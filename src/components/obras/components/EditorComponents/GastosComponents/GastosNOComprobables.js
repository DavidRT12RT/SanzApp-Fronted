import React,{ useState,useEffect } from 'react'
import { Button, Card, Col, Divider,message, Row, Statistic,Table,Modal,Upload,Input, Form, InputNumber, DatePicker} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import "../../../assets/facturasLista.css";
import TextArea from 'antd/lib/input/TextArea';

export const GastosNOComprobables = ({obraInfo,socket}) => {
    const {_id:obraId} = obraInfo;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dataFacturas, setDataFacturas] = useState([]);
    const [obraInfoFacturas, setObraInfoFacturas] = useState({});
    
    //Seteamos la data cada vez que el componente se monte por primera vez
    useEffect(() => {
        obraInfo.facturas.registros.map(element => element.key = element._id);
        setDataFacturas(obraInfo.facturas.registros);

        setObraInfoFacturas(obraInfo.facturas);
    }, []);

    //Seteamos la data cada vez que la obraInfo se actualize por algun socket de un cliente
    useEffect(() => {
        obraInfo.gastos.NoComprobables.registros.map(element => element.key = element._id);
        setDataFacturas(obraInfo.gastos.NoComprobables.registros);

        setObraInfoFacturas(obraInfo.gastos.NoComprobables);
    }, [obraInfo]);
    
    
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSearch = (value) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setDataFacturas(obraInfo.gastos.NoComprobables.registros);
        }

        const resultadosBusqueda = obraInfo.gastos.NoComprobables.registros.filter(element => {
            if(element.descripcionGasto.toLowerCase().includes(value.toLowerCase())){
                return element;
            }
        });

        return setDataFacturas(resultadosBusqueda);
    }


    const handleUpload = async (values) => {

        //Pasando la fecha a un string
        values.fechaGasto = values.fechaGasto.toString();
        values.obraId = obraId;
        values.importeGasto = parseFloat(values.importeGasto);
        setUploading(true);
        socket.emit("añadir-gasto-no-comprobable-obra",values,(confirmacion)=>{
            confirmacion.ok ? message.success(confirmacion.msg) : message.error(confirmacion.msg);
        });
        setUploading(false);
        handleOk();
        //Making the http post 
    }


    const columns = [
        {
            title: 'Importe gasto',
            dataIndex: 'importeGasto',
            key: 'importeGasto',
            sorter: (a, b) => a.importeGasto - b.importeGasto,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Concepto del gasto',
            dataIndex: 'conceptoGasto',
            key: 'conceptoGasto',
        },
        {
            title: 'Fecha gasto',
            dataIndex: 'fechaGasto',
            key: 'fechaGasto',
        },
        {
            title:"Descripcion del gasto",
            dataIndex:"descripcionGasto",
            key:"descripcionGasto"
        }
    ];


    return (
           <div>
                <h1>Gastos NO comprobables de la obra</h1>
                <p className="lead">
                    En esta sección se encuentran todos los gastos NO comprobables de la obra como 
                    comidas,etc.
                </p>
                <Divider/>
                
                {/*Buscador con autocompletado*/}
                    <Input.Search 
                        size="large" 
                        placeholder="Busca un gasto por su concepto" 
                        enterButton
                        onSearch={handleSearch}
                        className="search-bar-class"
                    />

                {/*Tarjetas*/}
                <Row gutter={16} className="mt-3">
                    <Col xs={24} md={8}>
                        <Card>
                            <Statistic
                                title="Total de gastos NO comprobables"
                                value={obraInfoFacturas.totalGastos}
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
                                value={obraInfoFacturas.numeroGastos}
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
                <Button type="primary" className="my-3" onClick={showModal}>Agregar un nuevo gasto</Button>

                <Table columns={columns} dataSource={dataFacturas} bordered style={{width:"100vw"}}/>

                <Modal title="Agregar gasto" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                        <h1>Agregar un gasto NO comprobable a la obra</h1>
                        <p className="lead">Asegurate de que sea un gasto NO comprobable como comidas,etc.</p>
                        <Form onFinish={handleUpload} layout="vertical">
                            <Form.Item name="conceptoGasto" label="Concepto gasto">
                                <Input/>
                            </Form.Item>
                            <Form.Item name="descripcionGasto" label="Descripción del gasto">
                                <TextArea/>
                            </Form.Item>
                            <Form.Item name="importeGasto" label="Importe total del gasto">
                                <InputNumber min={0} style={{width:"100%"}}/>
                            </Form.Item>
                            <Form.Item name="fechaGasto" label="Fecha del gasto">
                                <DatePicker style={{width:"100%"}}/>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" loading={uploading}>
                                {uploading ? "Subiendo al servidor..." : "Registrar gasto"}     
                            </Button>
                        </Form>
               </Modal>
            </div>
    )
}
