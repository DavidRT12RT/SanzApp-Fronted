import { Input, DatePicker, Statistic, Card, Table, Space, Dropdown, message, Menu, Button, Modal,Upload, Divider, Drawer } from 'antd'
import React, { useEffect, useState } from 'react'
import { DownOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { fetchConToken, fetchConTokenSinJSON } from '../../../helpers/fetch';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
const { RangePicker } = DatePicker;

export const FacturasGeneralOficina = ({coleccion,socket,oficinaInfo}) => {

    const startOfMonth = moment().startOf('month').locale('es').format("YYYY-MM-DD");
    const endOfMonth   = moment().endOf('month').locale('es').format("YYYY-MM-DD");
    const [informacionFacturas, setInformacionFacturas] = useState({});
    const [informacionFacturasTotales,setInformacionFacturasTotales]  = useState({});
    const [facturasColeccionRegistros, setFacturasColeccionRegistros] = useState([]);
    //Modal para facturas
    const [isModalVisible, setIsModalVisible] = useState(false);
    //Modal para abonos de las facturas 
    const [isModalVisibileAbonos, setIsModalVisibileAbonos] = useState(false);
    //UseState para saber que folio enviaremos
    const [folioActual, setFolioActual] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [isDrawerVisible,setIsDrawerVisible] = useState(false);
    const [facturaActual,setFacturaActual] = useState({});


    //Cada vez que cambie la colección volvemos a setear información
    useEffect(() => {
        oficinaInfo.gastos[coleccion].registros.map(element => element.key = element.folioFactura);
        const facturasMes = oficinaInfo.gastos[coleccion].registros.filter(element => {
            if(moment(element.fechaFactura).isBetween(startOfMonth,endOfMonth)){
                return element;
            }
        });
        let gastosTotales = 0,numeroRegistros = 0;
        facturasMes.map(element => {
            gastosTotales += element.importeFactura;
            numeroRegistros += 1;
        });
        setInformacionFacturas({gastosTotales,numeroRegistros});
        setFacturasColeccionRegistros(facturasMes);
        setInformacionFacturasTotales(oficinaInfo.gastos[coleccion]);
    }, [coleccion,oficinaInfo]);
    
    const handleSearch = (value) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            oficinaInfo.gastos[coleccion].registros.map(element => element.key = element.folioFactura);
            const facturasMes = oficinaInfo.gastos[coleccion].registros.filter(element => {
                if(moment(element.fechaFactura).isBetween(startOfMonth,endOfMonth)){
                    return element;
                }
            });
            let gastosTotales = 0,numeroRegistros = 0;
            facturasMes.map(element => {
                gastosTotales += element.importeFactura;
                numeroRegistros += 1;
            });
            setInformacionFacturas({gastosTotales,numeroRegistros});
            setFacturasColeccionRegistros(facturasMes);
            return;
        }

        const resultadosBusqueda = oficinaInfo.gastos[coleccion].registros.filter(elemento => {
            if(elemento.descripcionFactura.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        })
        let gastosTotales = 0,numeroRegistros = 0;
        resultadosBusqueda.map(element => {
            gastosTotales += element.importeFactura;
            numeroRegistros += 1;
        });
        setInformacionFacturas({gastosTotales,numeroRegistros});
        return setFacturasColeccionRegistros(resultadosBusqueda);
    }

    const onChangeDate = (value, dateString) => {
        //console.log('Selected Time: ', value);//Estancias de moment
        //console.log('Formatted Selected Time: ', dateString);//fechas en string

        //Se borraron las fechas
        if(value === null){
            oficinaInfo.gastos[coleccion].registros.map(element => element.key = element.folioFactura);
            const facturasMes = oficinaInfo.gastos[coleccion].registros.filter(element => {
                if(moment(element.fechaFactura).isBetween(startOfMonth,endOfMonth)){
                    return element;
                }
            });
            let gastosTotales = 0,numeroRegistros = 0;
            facturasMes.map(element => {
                gastosTotales += element.importeFactura;
                numeroRegistros += 1;
            });
            setInformacionFacturas({gastosTotales,numeroRegistros});
            setFacturasColeccionRegistros(facturasMes);
            return;
        }

        const resultadosBusqueda = oficinaInfo.gastos[coleccion].registros.filter(element => {
            //element.fechaFactura = element.fechaFactura.slice(0,10);
            if(moment(element.fechaFactura).isBetween(dateString[0],dateString[1])){
                return element;
            }
        });

        let gastosTotales = 0,numeroRegistros = 0;
        resultadosBusqueda.map(element => {
            gastosTotales += element.importeFactura;
            numeroRegistros += 1;
        });
        setInformacionFacturas({gastosTotales,numeroRegistros});
        return setFacturasColeccionRegistros(resultadosBusqueda);
    };


    //Funciones para descargar el archivo PDF o XML de la factura o abono
    const handleDownloadPDF = async (nombreArchivo,folioFactura) => {
        try {
            const resp = await fetchConToken(`/uploads/oficina/gastos/${coleccion}/${folioFactura}/${nombreArchivo}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',nombreArchivo);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }
    const handleDownloadPDFAbono = async (folioFactura,abono) => {
        try {
            const resp = await fetchConToken(`/uploads/oficina/gastos/${coleccion}/${folioFactura}/${abono.archivoName}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',abono.archivoName);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    const handleDownloadXML = async (nombreArchivo,folioFactura) => {
        try {
            const resp = await fetchConToken(`/uploads/oficina/gastos/${coleccion}/${folioFactura}/${nombreArchivo}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',nombreArchivo);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }


    //Menu descargar para las facturas 
    const menuDescargar = (record) => {
        const {folioFactura,nombrePDF,nombreXML,abono} = record
        return (
            <Menu 
                items={[
                    { key: '1', label: 'Archivo PDF factura',onClick:()=>{handleDownloadPDF(nombrePDF,folioFactura)}},
                    { key: '2', label: 'Archivo XML factura',onClick:()=>{handleDownloadXML(nombreXML,folioFactura)}},
                    { key: '3', label: 'Archivo abono de factura',onClick:()=>{handleDownloadPDFAbono(folioFactura,abono)}},
                ]}
            />      
        )
    }

    const menuVisualizar = (record) => {
        const { folioFactura,nombrePDF,nombreXML,abono="" } = record;
        if(abono.length != ""){
            return (
                <Menu 
                    items={[
                        {key:'1',label:'Archivo PDF de la factura',onClick:()=>{
                            setIsDrawerVisible(true);
                            setFacturaActual({nombreArchivo:nombrePDF,folioFactura});
                        }},
                        {
                            key:'2',label:'Archivo PDF del abono',onClick:()=>{
                                setIsDrawerVisible(true);
                                setFacturaActual({nombreArchivo:abono.archivoName,folioFactura});
                        }}
                    ]}
                />
            ) 
        }else{
            return (
                <Menu 
                    items={[
                        {key:'1',label:"Archivo PDF de la factura",onClick:()=>{
                            setIsDrawerVisible(true);
                            setFacturaActual({nombreArchivo:nombrePDF,folioFactura});
                        }}
                    ]}
                />
            )
        }
    }

    const handleUploadAbono =  async () =>{

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
            const resp = await fetchConTokenSinJSON(`/uploads/oficina/abonos/${coleccion}/${folioActual}`,formData,"PUT");
            const body = await resp.json();
            if(resp.status === 200){
                message.success(body.msg);
                socket.emit("informacion-oficina-actualizada");
            }else{
                message.error(body.msg);
            }
        } catch (error) {
            
        }
                
        setIsModalVisibileAbonos(false);
        //Quitando los archivos del filesList
        setFilesList([]);
        setUploading(false);
        setFolioActual(null);
    }
    const handleDeleteAbono = (folioFactura,archivoName) => {

        confirm({
            title:"¿Seguro quieres eliminar este abono de la factura?",
            icon:<ExclamationCircleOutlined />,
            content:"Al borrar el abono de la factura este ya NO podra ser accedido o recuperado de ninguna forma.",
			okText:"Borrar abono",
			cancelText:"Volver atras",
            async onOk(){
                try {
                    const resp = await fetchConToken(`/uploads/oficina/abonos/${coleccion}/${folioFactura}/${archivoName}`,{},"DELETE"); 
                    const body = await resp.json();
                    if(resp.status === 200){
                        message.success(body.msg);
                        socket.emit("informacion-oficina-actualizada");
                    }
                } catch (error) {
                    message.error("Error a la hora de eliminar abono del servidor!");
                }
           	},
        });
    }

    const handleDeleteFactura = (folioFactura) => {
        confirm({
            title:"¿Seguro quieres eliminar la factura?",
            icon:<ExclamationCircleOutlined />,
            content:"Al borrar la factura se borrara de igual forma el abono que este en ella y NO se podra recuperar de ninguna forma",
			okText:"Borrar factura",
			cancelText:"Volver atras",
            async onOk(){
                try {
                    const resp = await fetchConToken(`/uploads/oficina/gastos/${coleccion}/${folioFactura}/`,{},"DELETE"); 
                    const body = await resp.json();
                    resp.status === 200 ? message.success(body.msg) : message.error(body.msg);
                    socket.emit("informacion-oficina-actualizada");
                } catch (error) {
                    message.error("No se pudo eliminar la factura del servidor!"); 
                }
           	},
        });
    }

    const propsAbono = {
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
            const resp = await fetchConTokenSinJSON(`/uploads/oficina/gastos/${coleccion}`,formData,"POST");
            body = await resp.json();
            if(resp.status === 200){
                message.success("Subida con exito!");
                socket.emit("informacion-oficina-actualizada");
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


    //Colunmas de la tabla
    const columns = [
        {
            title:<p className="titulo-descripcion">Importe total factura</p>,
            render:(text,record) => (<p className="descripcion">{record.importeFactura}</p>),
            sorter: (a, b) => a.importeFactura - b.importeFactura,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title:<p className="titulo-descripcion">Descripción o motivo de la factura</p>,
            render:(text,record) => (<p className="descripcion">{record.descripcionFactura}</p>),
        },
        {
            title:<p className="titulo-descripcion">Fecha factura</p>,
            render:(text,record) => (<p className="descripcion">{record.fechaFactura}</p>),
        },
        {
            title:<p className="titulo-descripcion">Ver documentos</p>,
            render:(text,record) => {
                return (
                    <Dropdown overlay={menuVisualizar(record)}>
                        <a className="descripcion text-primary">
                            Visualizar documentos<DownOutlined/>
                        </a>
                    </Dropdown>
                )
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
        },
        {
            title:<p className="titulo-descripcion">Acciones</p>,
            render:(text,record) => {
                return (
                    record.abono ? 
                    <div className="d-flex justify-content-start flex-wrap gap-2">
                        <Button type="primary" danger onClick={()=>{handleDeleteAbono(record.folioFactura,record.abono.archivoName)}}>Eliminar abono</Button>
                        <Button type="primary" danger onClick={()=>{handleDeleteFactura(record.folioFactura)}}>Eliminar factura</Button>
                    </div>
                    :
                    <div className="d-flex justify-content-start flex-wrap gap-2">
                        <Button type="primary" onClick={()=>{
                            setIsModalVisibileAbonos(true);
                            setFolioActual(record.folioFactura);
                            }
                        }>Subir abono</Button>
                        <Button type="primary" danger onClick={()=>{handleDeleteFactura(record.folioFactura)}}>Eliminar factura</Button>
                    </div>

                )
            }
        },
    ];


    return (
        <div className="p-lg-5 p-3" style={{minHeight:"100vh"}}>
            <h1 className="titulo">Facturas <span className="text-primary">{coleccion}</span></h1>
            <Button type="primary" className="my-3" onClick={()=>{setIsModalVisible(true)}}>Agregar nueva factura!</Button>
            <p className="nota text-start">(Por defecto se mostraran solo se mostraran las facturas de este mes, <br/>si deseas puedes cambiar esto en la editor de fecha de abajo)</p>
            <div className="d-flex justify-content-start flex-wrap mt-3 gap-2">
                <Card style={{width:"300px"}}>
                    <Statistic
                        title={`Numero de facturas TOTALES de ${coleccion}`}
                        value={informacionFacturasTotales.numeroRegistros}
                        precision={0}
                        prefix="Total:"
                    />
                </Card>
                <Card style={{width:"300px"}}>
                    <Statistic
                        title={`Gastos TOTALES de ${coleccion}`}
                        value={informacionFacturasTotales.gastosTotales}
                        precision={2}
                        prefix="Total: $"
                    />
                </Card>
            </div>
            <div className="d-flex justify-content-start flex-wrap mt-3 gap-2">
                <Card style={{width:"300px"}}>
                    <Statistic
                        title={`Numero de facturas totales de ${coleccion} este mes`}
                        value={informacionFacturas.numeroRegistros}
                        precision={0}
                        prefix="Total:"
                    />
                </Card>
                <Card style={{width:"300px"}}>
                    <Statistic
                        title={`Gastos totales de ${coleccion} este mes`}
                        value={informacionFacturas.gastosTotales}
                        precision={2}
                        prefix="Total: $"
                    />
                </Card>
            </div>

            <Divider/>
            {/*Buscador */}                
            <div className="d-flex justify-content-start align-items-center flex-wrap gap-3 mt-3">
                <Input.Search 
                    size="large" 
                    placeholder="Busca una factura por su descripción o concepto" 
                    enterButton
                    onSearch={handleSearch}
                    className="search-bar-class"
                />
                <RangePicker onChange={onChangeDate} size="large" locale={locale} />
            </div>
            
            <Table columns={columns} dataSource={facturasColeccionRegistros} className="mt-3" bordered/>

            {/*Modal para subir una factura*/}
            <Modal visible={isModalVisible} onOk={()=>{setIsModalVisible(false)}} onCancel={()=>{setIsModalVisible(false)}} footer={null}>
                <h1 className="titulo">Subir factura de mantenimiento</h1>
                <p className="descripcion">Para poder realizar esta operación necesitaras el documento XML y PDF.</p>
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

            {/*Modal para abonos en una factura*/}
            <Modal visible={isModalVisibileAbonos} onOk={()=>{setIsModalVisibileAbonos(false)}} onCancel={()=>{setIsModalVisibileAbonos(false)}} footer={null}>
                    <h1 className="titulo">Subir abono a la factura</h1>
                    <p className="descripcion">Para poder realizar esta acción necesitaras el documento PDF del abono</p>
                    <Upload {...propsAbono} className="upload-list-inline" >
                        <Button icon={<UploadOutlined/>}>Selecciona el archivo del abono</Button>
                    </Upload>
                    <Button 
                        type="primary" 
                        disabled={filesList.length === 0}
                        loading={uploading}
                        onClick={handleUploadAbono}
                    >
                        {uploading ? "Subiendo..." : "Comienza a subir!"}     
                    </Button>
            </Modal>
            <Drawer width={640} closable={false} title="Visualizar archivo" placement="left" visible={isDrawerVisible} onClose={()=>{setIsDrawerVisible(false)}}>
                <iframe type="text/plain" src={`http://localhost:4000/api/uploads/oficina/gastos/${coleccion}/${facturaActual.folioFactura}/${facturaActual.nombreArchivo}`} style={{height:"100%",width:"100%"}} frameBorder="0" allowFullScreen></iframe>
            </Drawer>
        </div>
    )
}
