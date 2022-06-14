import React,{ useState,useEffect } from 'react'
import { Button, Card, Col, Divider, Dropdown, Menu, message, Row, Space, Statistic,Table,Modal,Upload,Input, DatePicker} from 'antd';
import { DownOutlined,UploadOutlined ,CopyOutlined } from '@ant-design/icons';
import { fetchConToken, fetchConTokenSinJSON } from '../../../../../helpers/fetch';
import "../../../assets/facturasLista.css";
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
const { RangePicker } = DatePicker;


export const GastosOficina = ({obraInfo,socket}) => {
    const {_id:obraId} = obraInfo;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dataFacturas, setDataFacturas] = useState([]);
    const [obraInfoFacturas, setObraInfoFacturas] = useState({});

    //Seteamos la data cada vez que la obraInfo se actualize por algun socket de un cliente
    useEffect(() => {
        obraInfo.gastos.oficina.registros.map(element => element.key = element._id);
        setDataFacturas(obraInfo.gastos.oficina.registros);

        setObraInfoFacturas(obraInfo.gastos.oficina);
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
            setObraInfoFacturas(obraInfo.gastos.oficina);
            setDataFacturas(obraInfo.gastos.oficina.registros);
            return;
        }

        const resultadosBusqueda = obraInfo.gastos.oficina.registros.filter(elemento => {
            if(elemento.descripcionFactura.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        })

        let numeroFacturas = 0, totalFacturas = 0; 
        resultadosBusqueda.map(element => {
            numeroFacturas += 1;
            totalFacturas += element.importeFactura;
        });
        setObraInfoFacturas({numeroFacturas,totalFacturas});
        return setDataFacturas(resultadosBusqueda);
    }

    const onChangeDate = (value, dateString) => {
        //console.log('Selected Time: ', value);//Estancias de moment
        //console.log('Formatted Selected Time: ', dateString);//fechas en string

        //Se borraron las fechas
        if(value === null){
            setDataFacturas(obraInfo.gastos.oficina.registros);
            setObraInfoFacturas(obraInfo.gastos.oficina);
            return;
        }
        const resultadosBusqueda = obraInfo.gastos.oficina.registros.filter(element => {
            //element.fechaFactura = element.fechaFactura.slice(0,10);
            if(moment(element.fechaFactura).isBetween(dateString[0],dateString[1])){
                return element;
            }
        });
        let numeroFacturas = 0, totalFacturas = 0; 
        resultadosBusqueda.map(element => {
            numeroFacturas += 1;
            totalFacturas += element.importeFactura;
        });
        setObraInfoFacturas({numeroFacturas,totalFacturas});
        return setDataFacturas(resultadosBusqueda);
    };

    const handleUpload = async () =>{
        const formData = new FormData();

        filesList.forEach(file => {
            if(file.type == "application/pdf"){
                formData.append("archivoPDF",file);
                //formData.archivoPDF = file;
            }else if(file.type == "text/xml"){
                formData.append("archivoXML",file);
                //formData.archivoXML = file;
            }
        });

        //Verificación que esten los 2 archivos 
        if(filesList.length < 2){
            return message.error("Se necesita 2 archivos, el archivo PDF y XML para generar una nueva factura!");
        }
        //Verificación que los dos archivos no sean iguales
        if(filesList[0].type == filesList[1].type){
            return message.error("Los dos archivos son de la misma extensión se necesitan los PDF y XML");
        }
        setUploading(true);
        //Making the http post 
        let body;
        try {
            const resp = await fetchConTokenSinJSON(`/uploads/obras/obra/${obraId}/gastos/oficina`,formData,"POST");
            body = await resp.json();
            if(resp.status === 200){
                message.success("Subida con exito!");
            }else{
                message.error(body.msg);
            }
            handleCancel();
            //Quitando los archivos del filesList
            setFilesList([]);
            //Quitando los archivos del upload list del upload
            
            //Avisando a todos incluyendome a mi que las facturas se han actualizado!
            socket.emit("actualizar-facturas-obra",{obraId});
        } catch (error) {
            message.error(body);
        }
        setUploading(false);
    }

    const handleDownloadPDF = async (nombreArchivo,folioFactura) => {
        try {
            const resp = await fetchConToken(`/uploads/obras/obra/${obraId}/gastos/oficina/${folioFactura}/${nombreArchivo}`);
            if(resp.status != 200){
                return message.error("No se encontro el archivo en el servidor!");
            }
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
            const resp = await fetchConToken(`/uploads/obras/obra/${obraId}/gastos/oficina/${folioFactura}/${nombreArchivo}`);
            if(resp.status != 200){
                return message.error("No se encontro el archivo en el servidor!");
            }
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


    const props = {
        multiple:true,
        onRemove : file => {
            setFilesList(files => {
                const index = files.indexOf(file);
                const newFileList = files.slice();
                newFileList.splice(index,1);
                setFilesList(newFileList);
            });
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma función*/
        },
        beforeUpload: file => {
            //Checar si el archivo es PDF O XML
            const isPDForXML = file.type === "application/pdf" || file.type === "text/xml";
            if(isPDForXML){
                //Verificar que el fileList sea menos a 2 
                if(filesList.length < 2){
                    setFilesList(files => [...files,file]);
                }else{
                    message.error("Solo puedes subir 2 archivos en total");
                }
            }else{
                message.error("Los archivos tienen que ser PDF o XML!");

            }
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            return false;
        },
        listType:"picture",
        maxCount:2,
        fileList : filesList
    };
    return (
           <div>
                <h1>Gastos hechos desde la oficina</h1>
                <p className="lead">En esta sección se encontraran todas las facturas COMPROBABLES de hechos desde la OFICINA par la obra actual,
                aqui de igual manera necesitaremos el PDF y XML.
                </p>
                <Divider/>
                
                {/*Buscador con autocompletado*/}
                <div className="d-flex justifty-content-center align-items-center flex-wrap gap-2">

                    <Input.Search 
                        size="large" 
                        placeholder="Busca una factura por su descripción o concepto" 
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
                                title="Total de gastos comprobables de oficina"
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
                    <Col xs={24} md={8} className="mt-3 mt-md-0">
                        <Card>
                            <Statistic
                                title="Numero de registros comprobables de oficina"
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
                <Button type="primary" className="my-3" onClick={showModal}>Agregar nueva factura!</Button>

                <Table columns={columns} dataSource={dataFacturas} bordered style={{width:"100vw"}}/>

                <Modal title="Agregar factura" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                        <h1>Subir un gasto de OFICINA a la obra</h1>
                        <p className="lead">Para poder realizar esta operación necesitaras el documento XML y PDF.</p>
                        <Upload {...props} className="upload-list-inline" >
                            <Button icon={<UploadOutlined/>}>Selecciona el archivo</Button>
                        </Upload>
                   <Button 
                        type="primary" 
                        onClick={handleUpload}
                        disabled={filesList.length === 0}
                        loading={uploading}
                    >
                        {uploading ? "Subiendo..." : "Comienza a subir!"}     
                    </Button>
               </Modal>
            </div>
    )
}
