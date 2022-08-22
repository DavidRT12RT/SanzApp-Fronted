import React,{ useState,useEffect } from 'react'
import { Button, Card, Col, Divider,message, Row, Statistic,Table,Modal,Upload,Input, Form, InputNumber, DatePicker} from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import "../../../assets/facturasLista.css";
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
const { RangePicker } = DatePicker;


export const GastosNOComprobables = ({obraInfo,socket}) => {
    const {_id:obraId} = obraInfo;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dataFacturas, setDataFacturas] = useState([]);
    const [obraInfoFacturas, setObraInfoFacturas] = useState({});
    
    /*Seteamos la data cada vez que la obraInfo se actualize por algun socket de un cliente o cuando el 
    componente se cargue por primera vez*/

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
            setObraInfoFacturas(obraInfo.gastos.NoComprobables);
            return setDataFacturas(obraInfo.gastos.NoComprobables.registros);
        }

        const resultadosBusqueda = obraInfo.gastos.NoComprobables.registros.filter(element => {
            if(element.descripcionGasto.toLowerCase().includes(value.toLowerCase())){
                return element;
            }
        });
        let numeroGastos = 0,totalGastos = 0;
        resultadosBusqueda.map(element => {
            numeroGastos += 1;
            totalGastos += element.importeGasto;
        });
        setObraInfoFacturas({numeroGastos,totalGastos});
        return setDataFacturas(resultadosBusqueda);
    }

    const onChangeDate = (value, dateString) => {
        //console.log('Selected Time: ', value);//Estancias de moment
        //console.log('Formatted Selected Time: ', dateString);//fechas en string

        //Se borraron las fechas
        if(value === null){
            setObraInfoFacturas(obraInfo.gastos.NoComprobables);
            return setDataFacturas(obraInfo.gastos.NoComprobables.registros);
        }
        const resultadosBusqueda = obraInfo.gastos.NoComprobables.registros.filter(element => {
            //element.fechaFactura = element.fechaFactura.slice(0,10);
            if(moment(element.fechaGasto).isBetween(dateString[0],dateString[1])){
                return element;
            }
        });
        let numeroGastos = 0,totalGastos = 0;
        resultadosBusqueda.map(element => {
            numeroGastos += 1;
            totalGastos += element.importeGasto;
        });
        setObraInfoFacturas({numeroGastos,totalGastos});
        return setDataFacturas(resultadosBusqueda);
    };

    const handleUpload = async (values) => {

        //Pasando la fecha a un string
        values.fechaGasto = moment(values.fechaGasto,"DD/MM/YYYY");
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
                <div className="d-flex justify-content-start align-items-center flex-wrap gap-2">
                    <Input.Search 
                        size="large" 
                        placeholder="Busca un gasto por su concepto" 
                        enterButton
                        onSearch={handleSearch}
                        className="search-bar-class"
                    />
                    <RangePicker onChange={onChangeDate} size="large" locale={locale}/>

                </div>
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
                            <Form.Item name="conceptoGasto" label="Concepto gasto" rules={[{required: true,message:"Introuce el concepto del gasto",},]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item name="descripcionGasto" label="Descripción del gasto" rules={[{required: true,message:"Introduce la descripcion del gasto",},]}>
                                <TextArea/>
                            </Form.Item>
                            <Form.Item name="importeGasto" label="Importe total del gasto" rules={[{required: true,message:"introduce el importe total del gasto",},]}>
                                <InputNumber min={0} style={{width:"100%"}}/>
                            </Form.Item>
                            <Form.Item name="fechaGasto" label="Fecha del gasto">
                                <DatePicker style={{width:"100%"}} format={['DD/MM/YYYY', 'DD/MM/YY']} locale={locale} rules={[{required: true,message:"Introudce la fecha del gasto",},]}/>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" loading={uploading}>
                                {uploading ? "Subiendo al servidor..." : "Registrar gasto"}     
                            </Button>
                        </Form>
               </Modal>
            </div>
    )
}
