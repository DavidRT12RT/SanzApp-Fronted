import React,{ useState,useEffect } from 'react'
import "../../assets/facturasLista.css";
import { DownOutlined,UploadOutlined ,CopyOutlined } from '@ant-design/icons';
import { fetchConToken, fetchConTokenSinJSON } from '../../../../helpers/fetch';
import { Button, Card, Col, Divider, Dropdown, Menu, message, Row, Space, Statistic,Table,Modal,Upload,Input, Form, InputNumber, DatePicker, Drawer} from 'antd';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
const { RangePicker } = DatePicker;
//const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];


export const AbonosLista = ({socket,obraInfo}) => {
    
    const {_id:obraId} = obraInfo;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dataAbonos, setDataAbonos] = useState([]);
    const [obraInfoAbonos, setObraInfoAbonos] = useState({});


    //Seteamos la data cada vez que se monte el componente o la obraInfo se actualize por algun socket de un cliente
    useEffect(() => {
        obraInfo.abonos.registros.map(element => element.key = element._id);
        setDataAbonos(obraInfo.abonos.registros);

        setObraInfoAbonos(obraInfo.abonos);
    }, [obraInfo]);
    

    const handleSearch = (value) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            setObraInfoAbonos(obraInfo.abonos);
            return setDataAbonos(obraInfo.abonos.registros);
        }

        const resultadosBusqueda = obraInfo.abonos.registros.filter((elemento)=>{
            if(elemento.concepto.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });
        let cantidadTotal = 0,numeroRegistros = 0;
        resultadosBusqueda.map(element => {
            cantidadTotal += element.importe;
            numeroRegistros += 1;
        });
        setObraInfoAbonos({cantidadTotal,numeroRegistros});
        return setDataAbonos(resultadosBusqueda);
    }


    const onChangeDate = (value, dateString) => {
        //console.log('Selected Time: ', value);//Estancias de moment
        //console.log('Formatted Selected Time: ', dateString);//fechas en string

        //Se borraron las fechas
        if(value === null){
            setDataAbonos(obraInfo.abonos.registros);
            return setObraInfoAbonos(obraInfo.abonos);
        }

        const resultadosBusqueda = obraInfo.abonos.registros.filter(element => {
            //element.fechaFactura = element.fechaFactura.slice(0,10);
            const date = moment(element.fechaAplicacion,['DD/MM/YYYY', 'DD/MM/YY']);
            //A diferencia que las factuas de gasolina aqui compara 2 instancias de moment
            if(date.isBetween(value[0],value[1])){
                return element;
            }else{
                console.log(element.fechaAplicacion);
            }
        });

        let cantidadTotal = 0,numeroRegistros = 0;
        resultadosBusqueda.map(element => {
            cantidadTotal += element.importe;
            numeroRegistros += 1;
        });
        setObraInfoAbonos({cantidadTotal,numeroRegistros});
        return setDataAbonos(resultadosBusqueda);
    };

    const handleUpload =  async () =>{

        const formData = new FormData();

        filesList.forEach(file => {
            if(file.type == "application/pdf"){
                formData.append("archivoPDF",file);
                //formData.archivoPDF = file;
            }
        });

        //Verificación que este por lo menos 2 archivos!
        if(filesList.length < 1){
            return message.error("Se necesita el archivo PDF del abono!");
        }
        setUploading(true);
        //Primero hacemos la petición para subir la imagen al servidor y con el nombre que nos devolvera se lo mandamos al socket
        try {
            const resp = await fetchConTokenSinJSON(`/uploads/obras/obra/${obraId}/abonos`,formData,"POST")
            const body = await resp.json();
            if(resp.status === 200){
                message.success(body.msg);
                /*
                socket.emit("añadir-abono-obra",(confirmacion)=>{
                    confirmacion ? message.success(confirmacion.msg) : message.error(confirmacion.msg);
                });
                */
            }else{
                message.error(body.msg);
            }
        } catch (error) {
            
        }
                
        setIsModalVisible(false);
        //Quitando los archivos del filesList
        setFilesList([]);
        setUploading(false);
    }

    const handleDownloadPDF = async (values) => {
        const { archivoName } = values;
        try {
            const resp = await fetchConToken(`/uploads/obras/obra/${obraId}/abonos/${archivoName}`);
            console.log(`localhost:4000/api/uploads/obras/obra/${obraId}/abonos/${archivoName}`);
            if(resp.status != 200){
                return message.error("No se encontro el archivo en el servidor!");
            }
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
            title:<p className="titulo-descripcion">Cuenta abono</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.cuentaAbono}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Cuenta cargo</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.cuentaCargo}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Concepto</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.concepto}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Importe</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.importe}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Fecha aplicación</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.fechaAplicacion}</p>
            }
 
        },

        {
            title:<p className="titulo-descripcion">Descargar documentos</p>,
            render: (text,record) => {
                return (
                    <Dropdown overlay={menuDescargar(record)}>
                        <a className="descripcion text-primary">
                            Descargar <DownOutlined />
                        </a>
                    </Dropdown>
                )
            },
        }
    ];


    const props = {
        multiple:true,
        onRemove : file => {
            setFilesList(files => {
                const newFiles = filesList.filter(fileOnState => fileOnState.name != file.name);
                setFilesList(newFiles);
            });
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma función*/
        },
        beforeUpload: file => {
            //Checar si el archivo es PDF O XML
            const isPDF = file.type === "application/pdf";
            if(isPDF){
                //Verificar que el fileList sea menos a 2 
                if(filesList.length < 2){
                    setFilesList(files => [...files,file]);
                }else{
                    message.error("Solo puedes subir 2 archivos en total");
                }
            }else{
                message.error("El archivo tiene que ser PDF!");

            }
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            return false;
        },
        listType:"picture",
        maxCount:2,
        fileList : filesList
    };


    return (
        <>
            <div className="container p-3 p-lg-5">
                <h1 className="titulo">Abonos de la obra</h1>
                <p className="descripcion">
                    En esta sección se encuentran todos los abonos que se han hecho a la obra con su respectivo documento PDF.
                </p>
                <Divider/>
                <div className="d-flex align-items-center justify-content-start gap-2 mt-4 flex-wrap">
                    <Input.Search 
                        size="large" 
                        placeholder="Buscar un abono por su concepto..." 
                        enterButton
                        onChange={(e)=>{handleSearch(e.target.value)}}
                    />
                    <RangePicker onChange={onChangeDate} size="large" locale={locale}/>
                </div>
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

                {/*Tabla con facturas*/}
                <Button type="primary" className="my-3" onClick={()=>{setIsModalVisible(true)}}>Agregar nuevo abono!</Button>

                <Table columns={columns} dataSource={dataAbonos} bordered />

                <Modal visible={isModalVisible} onOk={()=>{setIsModalVisible(false)}} onCancel={()=>{setIsModalVisible(false)}} footer={null}>
                        <h1 className="titulo">Subir un nuevo abono a la obra</h1>
                        <p className="descripcion">Para poder realizar esta acción necesitaras el documento PDF del abono</p>
                        <Upload {...props} className="upload-list-inline" >
                            <Button icon={<UploadOutlined/>}>Selecciona el archivo del abono</Button>
                        </Upload>
                        <Button 
                            type="primary" 
                            disabled={filesList.length === 0}
                            loading={uploading}
                            onClick={handleUpload}
                        >
                            {uploading ? "Subiendo..." : "Comienza a subir!"}     
                        </Button>
                </Modal>
                <Drawer visible={isDrawerVisible} onClose={()=>{setIsDrawerVisible(false)}}>
                </Drawer>
            </div>
        </>
  )
}