import { Button, Card, DatePicker, Divider, Dropdown, Form, Input, InputNumber, Menu, message, Modal, Statistic, Table, Upload } from 'antd'
import { DownOutlined,UploadOutlined ,CopyOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { PDFDownloadLink } from '@react-pdf/renderer';
import { fetchConToken, fetchConTokenSinJSON } from '../../../../../../../helpers/fetch';
import { ReporteGastos } from '../../../../../../../reportes/Obras/ReporteGastos';
const { RangePicker } = DatePicker;
const { TextArea } = Input;


export const GastosGeneral = ({tipo,obraInfo,socket}) => {
    const [registrosGastos, setRegistrosGastos] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisibleNoComprobable, setIsModalVisibleNoComprobable] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [form] = Form.useForm();

    //Esto se ejecutara la primera vez que el componente se renderize y despues solo que la obraInfo cambie
    useEffect(() => {
        obraInfo.gastos[tipo].registros.map(registro => registro.key = registro._id);
        setRegistrosGastos(obraInfo.gastos[tipo].registros);
    }, [obraInfo,tipo]);

    const props = {
        multiple:true,
        onRemove : file => {
            const newFiles = filesList.filter(fileOnState => fileOnState.name != file.name);
            setFilesList(newFiles);
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

    const handleUpload = async(values) => {
        switch (tipo) {
            case "NoComprobables":
                //Pasando la fecha a un string
                values.fechaGasto = moment(values.fechaGasto).format("YYYY-MM-DD");
                values.obraId = obraInfo._id;
                values.importeGasto = parseFloat(values.importeGasto);
                setUploading(true);
                socket.emit("añadir-gasto-no-comprobable-obra",values,(confirmacion)=>{
                    confirmacion.ok ? message.success(confirmacion.msg) : message.error(confirmacion.msg);
                });
                setUploading(false);
                setIsModalVisibleNoComprobable(false);
                form.resetFields();
                break;
        
            case "comprobables":
            case "oficina":
                const formData = new FormData();
                if(filesList.length < 2) return message.error("Se necesita 2 archivos, el archivo PDF y XML para generar una nueva factura!");
                //Verificación que los dos archivos no sean iguales
                if(filesList[0].type == filesList[1].type) return message.error("Los dos archivos son de la misma extensión se necesitan los PDF y XML");

                filesList.forEach(file => {file.type == "application/pdf" ? formData.append("archivoPDF",file) : formData.append("archivoXML",file);});
                setUploading(true);
                const resp = await fetchConTokenSinJSON(`/obras/${obraInfo._id}/gastos/${tipo}`,formData,"POST");
                const body = await resp.json();
                setUploading(false);
                if(resp.status != 201) return message.error(body.msg);
                //Todo salio bien
                setIsModalVisible(false);
                console.log(body);
                message.success(body.msg);
                setFilesList([]);
                //Avisando a todos incluyendome a mi que las facturas se han actualizado!
                socket.emit("actualizar-facturas-obra",{obraId:obraInfo._id});
                break;
        }
    }

    const handleSearch = (value) =>{

        if(value.length == 0) return setRegistrosGastos(obraInfo.gastos[tipo].registros);
        let resultadosBusqueda;

        switch (tipo) {
            case "comprobables":
            case "oficina":
                //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
                resultadosBusqueda = obraInfo.gastos[tipo].registros.filter(elemento => {
                    if(elemento.descripcionFactura.toLowerCase().includes(value.toLowerCase())) return elemento;
                });
                return setRegistrosGastos(resultadosBusqueda);

            case "NoComprobables":
                resultadosBusqueda = obraInfo.gastos[tipo].registros.filter(element => {
                    if(element.descripcionGasto.toLowerCase().includes(value.toLowerCase())) return element;});
                }
                return setRegistrosGastos(resultadosBusqueda);
    }

    const onChangeDate = (value, dateString) => {
        //Se borraron las fechas
        if(value === null){
            return setRegistrosGastos(obraInfo.gastos[tipo].registros);
        }
        
        let propiedadFecha = tipo != "NoComprobables" ? "fechaFactura" : "fechaGasto";
        const resultadosBusqueda = obraInfo.gastos[tipo].registros.filter(element => {
            if(moment(element[propiedadFecha]).isBetween(value[0],value[1])) return element;
        });

        return setRegistrosGastos(resultadosBusqueda);
    };

    const handleDownloadPDFAndXML = async (nombreArchivo,folioFactura) => {
        try {
            const resp = await fetchConToken(`/obras/${obraInfo._id}/gastos/${tipo}/${folioFactura}/${nombreArchivo}`);
            if(resp.status != 200) return message.error("No se encontro el archivo en el servidor!");
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
                    { key: '1', label: 'Archivo PDF',onClick:()=>{handleDownloadPDFAndXML(nombrePDF,folioFactura)}},
                    { key: '2', label: 'Archivo XML',onClick:()=>{handleDownloadPDFAndXML(nombreXML,folioFactura)}},
                ]}
            />      
        )
    }

    const renderizarColumns = () => {
        switch (tipo) {
            case "comprobables":
            case "oficina":
                return [
                    {
                        title:<p className="titulo-descripcion">Importe total factura</p>,
                        render:(text,record) => {
                            return <p className="descripcion">{record.importeFactura}</p>
                        },
                        sorter: (a, b) => a.importeFactura - b.importeFactura,
                        sortDirections: ['descend', 'ascend'],
                    },
                    {
                        title:<p className="titulo-descripcion">Emisor factura</p>,
                        render:(text,record) => {
                            return <p className="descripcion">{record.emisorFactura}</p>
                        }
                    },
                    {
                        title:<p className="titulo-descripcion">Descripción o motivo de la factura</p>,
                        render:(text,record) => {
                            return <p className="descripcion">{record.descripcionFactura}</p>
                        }
 
                    },
                    {
                        title:<p className="titulo-descripcion">Fecha de la factura</p>,
                        render:(text,record) => {
                            return <p className="descripcion">{record.fechaFactura}</p>
                        }
                    },
                    {
                        title:<p className="titulo-descripcion">Descargar documentos</p>,
                        dataIndex: 'documentos',
                        key: 'tags',
                        render: (text,record) => {
                            return (
                                <Dropdown overlay={menuDescargar(record)}>
                                    <a className="text-primary descripcion">
                                        Descargar <DownOutlined />
                                    </a>
                                </Dropdown>
                            )
                        },
                    }
                ];

            case "NoComprobables":
                return [
                    {
                        title: <p className="titulo-descripcion">Importe del gasto</p>,
                        render:(text,record) => {
                            return <p className="descripcion">{record.importeGasto}</p>
                        },
                        sorter: (a, b) => a.importeGasto - b.importeGasto,
                        sortDirections: ['descend', 'ascend'],
                    },
                    {
                        title: <p className="titulo-descripcion">Concepto del gasto</p>,
                        render:(text,record) => {
                            return <p className="descripcion">{record.conceptoGasto}</p>
                        },
                    },
                    {
                        title: <p className="titulo-descripcion">Fecha del gasto</p>,
                        render:(text,record) => {
                            return <p className="descripcion">{record.fechaGasto}</p>
                        },
                    },
                    {
                        title: <p className="titulo-descripcion">Descripcion del gasto</p>,
                        render:(text,record) => {
                            return <p className="descripcion">{record.descripcionGasto}</p>
                        },
                    }
                ]
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-end align-items-center gap-2">
                <PDFDownloadLink  document={<ReporteGastos gastos={registrosGastos} tipo={tipo} obraInfo={obraInfo}/>} fileName={`reporte_gastos_${tipo}.pdf`}>
                    {({ blob, url, loading, error }) => (<Button type="primary" loading={loading}>{loading ? "Cargando documento..." : "Descargar reporte"}</Button>)}
                </PDFDownloadLink> 
            </div>
            <h1 className="titulo">Gastos <span className="text-warning">{tipo.toUpperCase()}</span></h1>
            <p className="descripcion">Seccion para subir gastos del tipo {tipo} asi como ver y descargar los documentos PDF y XML.</p>
            <Divider/>
            <div className="d-flex justify-content-start align-items-center flex-wrap gap-4">
                <Input.Search 
                    size="large" 
                    placeholder="Busca una factura por su descripción o concepto" 
                    onChange={(e)=>{handleSearch(e.target.value)}}
                />
                <RangePicker size="large" locale={locale} onChange={onChangeDate}/>
            </div>
            {/*Tarjetas*/}
            <div className="d-flex justify-content-start align-items-center gap-2 my-3">
                    <Card>
                        <Statistic
                            title="Total de dinero"
                            precision={2}
                            value={obraInfo.gastos[tipo].totalFacturas | obraInfo.gastos[tipo].totalGastos}
                            valueStyle={{color: '#3f8600',}}
                            prefix="$"
                        />
                    </Card>
                    <Card>
                        <Statistic
                            title="Numero de registros"
                            value={obraInfo.gastos[tipo].numeroFacturas | obraInfo.gastos[tipo].numeroGastos}
                            valueStyle={{color: '#3f8600',}}
                            prefix={<CopyOutlined/>}
                            //suffix="%"
                            />
                    </Card>
            </div>

            <Button type="primary" onClick={()=>{tipo === "NoComprobables" ? setIsModalVisibleNoComprobable(true) : setIsModalVisible(true)}}>Nuevo gasto</Button>
            <Table bordered className="mt-3" columns={renderizarColumns()} dataSource={registrosGastos}/>
            <Modal visible={isModalVisible} onOk={()=>{setIsModalVisible(false)}} onCancel={()=>{setIsModalVisible(false)}} footer={null}>
                        <h1 className="titulo">Subir un gasto a la obra</h1>
                        <p className="descripcion">Subir un nuevo gasto de tipo <span className="text-warning">{tipo}</span> a la obra necesitaras el documento XML y PDF.</p>
                        <Upload {...props}>
                            <Button icon={<UploadOutlined/>}>Selecciona el archivo</Button>
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
            <Modal visible={isModalVisibleNoComprobable} onOk={()=>{setIsModalVisibleNoComprobable(false)}} onCancel={()=>{setIsModalVisibleNoComprobable(false)}} footer={null}>
                <h1 className="titulo">Subir un gasto NO comprobable</h1>
                {tipo == "NoComprobables " ? <p className="descripcion">Subir un nuevo gasto de tipo <span className="text-warning">{tipo}</span> a la obra necesitaras el documento XML y PDF.</p> : <p className="descripcion">Subir un nuevo gasto de tipo <span className="text-warning">{tipo}</span></p>}
                <Form onFinish={handleUpload} layout="vertical" form={form}>
                    <Form.Item name="conceptoGasto" label="Concepto gasto" rules={[{required: true,message:"Introuce el concepto del gasto",},]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="descripcionGasto" label="Descripción del gasto" rules={[{required: true,message:"Introduce la descripcion del gasto",},]}>
                        <TextArea maxLength={50}/>
                    </Form.Item>
                    <Form.Item name="importeGasto" label="Importe total del gasto" rules={[{required: true,message:"introduce el importe total del gasto",},]}>
                        <InputNumber min={0} style={{width:"100%"}}/>
                    </Form.Item>
                    <Form.Item name="fechaGasto" label="Fecha del gasto" rules={[{required: true,message:"Introudce la fecha del gasto",},]}>
                        <DatePicker style={{width:"100%"}} format={"YYYY-MM-DD"} locale={locale}/>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={uploading}>
                        {uploading ? "Subiendo al servidor..." : "Registrar gasto"}     
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}
