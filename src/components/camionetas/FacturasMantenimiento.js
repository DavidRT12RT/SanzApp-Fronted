import { Button, Card, DatePicker, Dropdown, Form, Input, Menu, message, Modal, Space, Statistic, Table, Upload } from 'antd'
import { DownOutlined, UploadOutlined } from '@ant-design/icons';
import { fetchConToken, fetchConTokenSinJSON } from '../../helpers/fetch';
import React, { useEffect, useState } from 'react'
import { Loading } from '../empleados/Loading';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { confirm } = Modal;

export const FacturasMantenimiento = ({camionetaInfo,socket}) => {

    const { uid:camionetaId } = camionetaInfo;
    const [facturasMantenimiento,setFacturasMantenimiento] = useState([]);
    const [informacionFacturas, setInformacionFacturas] = useState();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [filesList, setFilesList] = useState([]);


    useEffect(() => {
        camionetaInfo.gastos.facturasMantenimiento.registros.map(registro => registro.key = registro.folioFactura);
        setFacturasMantenimiento(camionetaInfo.gastos.facturasMantenimiento.registros);
        //Información de las facturas como numero total de registros , cantidad total ,etc.
        setInformacionFacturas(camionetaInfo.gastos.facturasMantenimiento);
    }, [camionetaInfo]);
    
    const handleDownloadPDF = async (nombreArchivo,folioFactura) => {
        try {
            const resp = await fetchConToken(`/uploads/camionetas/camioneta/${camionetaId}/gastos/mantenimiento/${folioFactura}/${nombreArchivo}`);
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
            const resp = await fetchConToken(`/uploads/camionetas/camioneta/${camionetaId}/gastos/mantenimiento/${folioFactura}/${nombreArchivo}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',nombreArchivo);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    const handleDeleteFactura = (folioFactura) => {
        //Preguntarle si esta seguro de que quiere borrar la factura
        confirm({
            title:"¿Seguro quieres eliminar la factura?",
            icon:<ExclamationCircleOutlined />,
            content:"Al borrar la factura se borrara de igual forma el abono que este en ella y NO se podra recuperar de ninguna forma",
			okText:"Borrar factura",
			cancelText:"Volver atras",
            async onOk(){
                try {
                    const resp = await fetchConToken(`/uploads/camionetas/camioneta/${camionetaInfo.uid}/gastos/mantenimiento/${folioFactura}`,{},"DELETE"); 
                    const body = await resp.json();
                    resp.status === 200 ? message.success(body.msg) : message.error(body.msg);
                    socket.emit("camioneta-actualizada",camionetaId);
                } catch (error) {
                    message.error("No se pudo eliminar la factura del servidor!"); 
                }
           	},
        });
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

    const menu = (
        <Menu>
            <Menu.Item key="1">Filtrar por fecha</Menu.Item>
        </Menu>
    );
    
    const handleSearch = (value) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            setFacturasMantenimiento(camionetaInfo.gastos.facturasMantenimiento.registros);
            setInformacionFacturas(camionetaInfo.gastos.facturasMantenimiento);
            return; 
        }

        const resultadosBusqueda = camionetaInfo.gastos.facturasMantenimiento.registros.filter(elemento => {
            if(elemento.descripcionFactura.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        })
        let total = 0,numeroRegistros = 0;
        resultadosBusqueda.map(element => {
            total += element.importeFactura;
            numeroRegistros += 1;
        });
        setInformacionFacturas({total,numeroRegistros});
        return setFacturasMantenimiento(resultadosBusqueda);
    }
    
    const onChangeDate = (value, dateString) => {
        //console.log('Selected Time: ', value);//Estancias de moment
        //console.log('Formatted Selected Time: ', dateString);//fechas en string

        //Se borraron las fechas
        if(value === null){
            setFacturasMantenimiento(camionetaInfo.gastos.facturasMantenimiento.registros);
            setInformacionFacturas(camionetaInfo.gastos.facturasMantenimiento);
            return; 
        }
        const resultadosBusqueda = camionetaInfo.gastos.facturasMantenimiento.registros.filter(element => {
            //element.fechaFactura = element.fechaFactura.slice(0,10);
            if(moment(element.fechaFactura).isBetween(dateString[0],dateString[1])){
                return element;
            }
        });

        let total = 0,numeroRegistros = 0;
        resultadosBusqueda.map(element => {
            total += element.importeFactura;
            numeroRegistros += 1;
        });
        setInformacionFacturas({total,numeroRegistros});
        return setFacturasMantenimiento(resultadosBusqueda);
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
            const resp = await fetchConTokenSinJSON(`/uploads/camionetas/camioneta/${camionetaId}/mantenimiento`,formData,"POST");
            body = await resp.json();
            if(resp.status === 200){
                message.success("Subida con exito!");
                socket.emit("camioneta-actualizada",camionetaId);
            }else{
                message.error(body.msg);
            }
            setIsModalVisible(false);
            //Quitando los archivos del filesList
            setFilesList([]);
            //Quitando los archivos del upload list del upload
        } catch (error) {
            message.error(body);
        }
        
        setUploading(false);
    }
    

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
            title:'Acciones',
            render:(text,record) => {
                return (
                    <Button type="primary" danger onClick={()=>{handleDeleteFactura(record.folioFactura)}}>Eliminar factura</Button>
                )
            }
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


    if((informacionFacturas && facturasMantenimiento) === undefined){
        return <Loading/>
    }else{
        return (
            <>
                <div style={{height:"100%"}}>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <h6 className="text-muted">Total de facturas de mantenimiento</h6>
                        <Button type="primary" className="my-3" onClick={()=>{setIsModalVisible(true)}}>Agregar nueva factura!</Button>
                    </div>
                    {/*Información sobre las facturas totales*/}
                    <div className="d-flex justify-content-start align-items-center flex-wrap gap-2">
                        <Card>
                            <Statistic
                                title="Numero de facturas de mantenimiento"
                                value={informacionFacturas.numeroRegistros}
                                precision={0}
                                prefix="Total:"
                            />
                        </Card>
                        <Card>
                            <Statistic
                                title="Cantidad total de las facturas"
                                value={informacionFacturas.total}
                                precision={2}
                                prefix="$"
                            />
                        </Card>
                    </div>
                {/*Buscador con autocompletado*/}
                    <div className="d-flex align-items-center gap-2 mt-4">
                        <Input.Search 
                            placeholder="Busca una factura por su descripción o concepto" 
                            enterButton
                            onSearch={handleSearch}
                            className="search-bar-class"
                            size="large"
                        />
                        {/*
                            <Dropdown overlay={menu} className="">
                                <Button type="primary">
                                    Filtrar por:
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        */}
                        <RangePicker onChange={onChangeDate} size="large" locale={locale}/>
                    </div>
                    <Table columns={columns} dataSource={facturasMantenimiento} bordered className="mt-3"/>
                    <Modal title="Agregar factura" visible={isModalVisible} onOk={()=>{setIsModalVisible(false)}} onCancel={()=>{setIsModalVisible(false)}} footer={null}>
                            <h1>Subir factura de mantenimiento</h1>
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
            </>
        )
    }
}
