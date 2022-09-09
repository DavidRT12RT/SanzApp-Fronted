import { Divider, Table, Button, Input, DatePicker, Modal, Form, InputNumber, Select, message, Upload, Drawer } from 'antd'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { DownOutlined, ExclamationCircleOutlined,UploadOutlined,DeleteOutlined,EyeOutlined,ArrowDownOutlined } from '@ant-design/icons';
import { fetchConToken, fetchConTokenSinJSON } from '../../../../helpers/fetch';
import { IncidenciaEvidencia } from '../../../../reportes/Obras/IncidenciaEvidencia';
import { PDFDownloadLink } from '@react-pdf/renderer';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

export const IncidentesObra = ({obraInfo,socket}) => {
    const obraId = obraInfo._id;
    const [incidentesObra, setIncidentesObra] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [empleadosObra, setEmpleadosObra] = useState([]);
    const [isModalVisibleSubirEvidencia, setIsModalVisibleSubirEvidencia] = useState({estado:false});
    const [isDrawerEvidenciaVisible, setIsDrawerEvidenciaVisible] = useState({estado:false});
    const [isDrawerVisibleRegistroIncidente, setIsDrawerVisibleRegistroIncidente] = useState({estado:false,registro:null});
    const [filesList, setFilesList] = useState([]);


    console.log(isDrawerVisibleRegistroIncidente);

    const props = {
        maxCount:1,
        onRemove : file => {
            const newFiles = filesList.filter(fileOnState => fileOnState.name != file.name);
            setFilesList(newFiles);
        },
        beforeUpload: file => {
            //Checar si el archivo es PDF O XML
            setFilesList(files => [...files,file]);
            return false;
        },
        listType:"picture",
        fileList : filesList
    };

    useEffect(() => {
        obraInfo.incidentes.map(incidente => incidente.key = incidente._id);
        setIncidentesObra(obraInfo.incidentes);

        for(let i = 0; i < obraInfo.incidentes.length; i++){
            obraInfo.incidentes[i].key = obraInfo.incidentes[i]._id;
            for(let j = 0; j < obraInfo.incidentes[i].trabajadores.length; j++){
                obraInfo.incidentes[i].trabajadores[j].key = obraInfo.incidentes[i].trabajadores[j]._id;
            }
        }

        obraInfo.trabajadores.map(trabajador => trabajador.key = trabajador.id.uid);
        setEmpleadosObra(obraInfo.trabajadores);
    }, [obraInfo]);
   

    const columns = [
        {
            title:<p className="titulo-descripcion">Titulo del incidente</p>,
            render:(text,record) => (<p className="descripcion">{record.titulo}</p>)
        },
        {
            title:<p className="titulo-descripcion">Trabajadores implicados</p>,
            render:(text,record) => (<p className="descripcion">{record.trabajadores.length}</p>)
        },
        {
            title:<p className="titulo-descripcion">Fecha del incidente</p>,
            render:(text,record) => (<p className="descripcion">{record.fecha}</p>)
        },
        {
            title:<p className="titulo-descripcion">Costo promedio del incidente</p>,
            render:(text,record) => (<p className="descripcion">{record.costo}</p>)
        },
        {
            title:<p className="titulo-descripcion">Ver mas detalles</p>,
            render:(text,record) => (<a className="descripcion text-primary" onClick={() => {setIsDrawerVisibleRegistroIncidente({estado:true,registro:record})}}>Ver mas detalles</a>)
        }
    ];

    const expandedRowRender = (record,index,indent,expanded) => {
        const columns = [
            {
                title:<p className="titulo-descripcion">Nombre del empleado</p>,
                render:(text,recordSubTable) => (<p className="descripcion">{recordSubTable.trabajador.nombre}</p>)
            },
            {
                title:<p className="titulo-descripcion">Carta responsiva</p>,
                render:(text,recordSubTable) => (
                    <PDFDownloadLink  document={<IncidenciaEvidencia usuario={{nombre:recordSubTable.trabajador.nombre}} obraInfo={obraInfo} fechaIncidente={record.fecha} motivo={record.motivo}/>} fileName={`evidencia.pdf`}>
                        {({ blob, url, loading, error }) => (<Button type="primary" icon={<ArrowDownOutlined />} loading={loading}>{loading ? "Cargando documento..." : "Descargar hoja responsiva"}</Button>)}
                    </PDFDownloadLink> 
                )
            },
            {
                title:<p className="titulo-descripcion">Evidencia carta responsiva</p>,
                render:(text,recordSubTable) => (
                    recordSubTable.evidencia
                    ? <div className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
                        <Button type="primary" icon={<EyeOutlined />} onClick={() => {setIsDrawerEvidenciaVisible({estado:true,evidencia:recordSubTable.evidencia})}}>Ver evidencia</Button>
                        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => {setIsModalVisibleSubirEvidencia({recordId:record._id,trabajador:recordSubTable.trabajador.uid});eliminarArchivoEvidencia()}}>Borrar evidencia</Button></div> 
                    : <Button type="primary" onClick={() => {setIsModalVisibleSubirEvidencia({estado:true,recordId:record._id,trabajador:recordSubTable.trabajador.uid})}}>Subir evidencia</Button>
                )
            }
        ];
        return <Table columns={columns} dataSource={record.trabajadores}/>
    } 

    const handleSearch = (value) => {
        const incidentesFiltrados = obraInfo.incidentes.filter((incidente,index) => {
            if(incidente.titulo.toLowerCase().includes(value.toLowerCase())) return incidente;
        });

        setIncidentesObra(incidentesFiltrados);
    }

    const handleFilterFecha = (value) => {
        if(value === null) return setIncidentesObra(obraInfo.incidentes);

        const resultadosBusqueda = obraInfo.incidentes.filter(element => {
            if(moment(element.fecha).isBetween(value[0],value[1])) return element;
        });

        setIncidentesObra(resultadosBusqueda);
    }

    const agregarRegistroIncidente = (values) => {
        confirm({
            title:"Seguro quieres agregar este registro de incidente a la obra?",
            icon:<ExclamationCircleOutlined />,
            content:"El incidente sera agregado a la obra y podras agregar un documento por cada empleado con su respectivo documento de responsiva.",
			okText:"Agregar",
			cancelText:"Volver atras",
            async onOk(){
                values.fecha = moment(values.fecha).format("YYYY-MM-DD");
                values.trabajadores = values.trabajadores.map(trabajadorId => ({trabajador:trabajadorId,evidencia:""}));
                const resp = await fetchConToken(`/obras/${obraId}/agregar-registro-incidente/`,values,"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Registro agregado con exito!
                message.success(body.msg);
                setIsModalVisible(false);
                socket.emit("actualizar-obra-por-id",obraId);
            }
        });
 
    }

    const subirArchivoEvidencia = () => {
        confirm({
            title:"Seguro quieres agregar los archivos de evidencia?",
            icon:<ExclamationCircleOutlined />,
            Ocontent:"Las archivos de evidencia seran subidos y podras eliminarlos en un futuro o consultarlos simplemente.",
			okText:"Agregar",
			cancelText:"Volver atras",
            async onOk(){
                const formData = new FormData();
                for(let i = 0; i < filesList.length; i++) formData.append(`${filesList[i].name}`,filesList[i]);
                formData.append("record",isModalVisibleSubirEvidencia.recordId);
                formData.append("trabajador",isModalVisibleSubirEvidencia.trabajador);
                const resp = await fetchConTokenSinJSON(`/obras/${obraId}/subir-evidencia-incidente`,formData,"PUT");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Evidencia del registro anadida con exito!
                message.success(body.msg);
                setIsModalVisibleSubirEvidencia({estado:false});
                socket.emit("actualizar-obra-por-id",obraId);
            }
        });
    }


    const eliminarArchivoEvidencia = () => {
        confirm({
            title:"Seguro quieres eliminar los archivos de evidencia?",
            icon:<ExclamationCircleOutlined />,
			okText:"Eliminar",
			cancelText:"Volver atras",
            async onOk(){
                const resp = await fetchConToken(`/obras/${obraId}/eliminar-evidencia-incidente`,{record:isModalVisibleSubirEvidencia.recordId,trabajador:isModalVisibleSubirEvidencia.trabajador},"DELETE");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);
                //Evidencia del registro anadida con exito!
                message.success(body.msg);
                setIsModalVisibleSubirEvidencia({estado:false});
                socket.emit("actualizar-obra-por-id",obraId);
            }
        });
    }

    return (
        <div className="container p-3 p-lg-5" style={{minHeight:"100vh"}}>
            <div className="d-flex justify-content-end align-items-center">
                <Button type="primary">Descargar resumen</Button>
            </div>
            <h1 className="titulo">Incidentes de la obra</h1>
            <p className="descripcion">Incidentes que ha tenido la obra en todo su perido.</p>
            <Divider/>
            <Input.Search 
                size="large" 
                placeholder="Buscar un incidente por su titulo..." 
                onChange={(e) => {handleSearch(e.target.value)}}
            />
            <div className="d-flex justify-content-start align-items-center gap-2 flex-wrap mt-3">
                <RangePicker onChange={handleFilterFecha} locale={locale}/>
                <Button type="primary"  onClick={() => {setIsModalVisible(true)}}>Añadir un nuevo registro</Button>
            </div>
 
            <Table className="mt-3" columns={columns} dataSource={incidentesObra} expandable={{expandedRowRender}} bordered/>
            <Modal visible={isModalVisible} onCancel={() => {setIsModalVisible(false)}} onOk={()=>{setIsModalVisible(false)}} footer={null}>
                <h1 className="titulo">Agregar registro de incidente</h1>
                <Form layout="vertical" onFinish={agregarRegistroIncidente}>
                    <Form.Item label="Titulo del incidente" name="titulo"><Input/></Form.Item>
                    <Form.Item label="Trabajadores implicados en el acidente" name="trabajadores">
                        <Select mode="multiple" placeholder="Selecciona los trabajadores...">
                            {empleadosObra.map(empleado => (
                                <Select.Option value={empleado.id.uid} key={empleado.id.uid}>{empleado.id.nombre}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Motivo del incidente" name="motivo"><Input.TextArea rows={8}/></Form.Item>
                    <Form.Item label="Fecha del incidente" name="fecha"><DatePicker locale={locale} style={{width:"100%"}}/></Form.Item>
                    <Form.Item label="Costo promedio del acidente" name="costo"><InputNumber style={{width:"100%"}}/></Form.Item>
                    <Button type="primary" htmlType="submit">Agregar registro</Button>
                </Form>
            </Modal>

            <Modal visible={isModalVisibleSubirEvidencia.estado} footer={null} onCancel={() => {setIsModalVisibleSubirEvidencia({estado:false})}} onOk={() => {setIsModalVisibleSubirEvidencia({estado:false})}}>
                <h1 className="titulo">Subir evidencia</h1>
                <p className="descripcion">subir documento de responsiva del empleado acerca del incidente</p>
                <Upload {...props}>
                    <Button icon={<UploadOutlined/>}>Selecciona el archivo o archivos</Button>
                </Upload>
                <Button type="primary" onClick={subirArchivoEvidencia}>Subir evidencia</Button>
            </Modal>

            <Drawer width="45%" visible={isDrawerEvidenciaVisible.estado} onClose={() => {setIsDrawerEvidenciaVisible({estado:false})}}>
                <h1 className="titulo-descripcion">Evidencia de responsiva del empleado</h1>
                <Divider/>
                <iframe type="text/plain" src={`http://localhost:4000/api/obras/${obraId}/obtener-evidencia-incidente/${isDrawerEvidenciaVisible.evidencia}`} style={{height:"100%",width:"100%"}} frameBorder="0" allowFullScreen></iframe>
            </Drawer>

            {isDrawerVisibleRegistroIncidente.estado && (
                <Drawer width="35%" visible={isDrawerVisibleRegistroIncidente.estado} onClose={() => {setIsDrawerVisibleRegistroIncidente({estado:false})}}>
                    <h1 className="titulo-descripcion">{isDrawerVisibleRegistroIncidente.registro.titulo}</h1>
                    <Divider/>
                    <div className="row">
                        <p className="titulo-descripcion">Motivo:</p>
                        <p className="descripcion">{isDrawerVisibleRegistroIncidente.registro.motivo}</p>
                        <p className="titulo-descripcion col-6">Fecha:</p>
                        <p className="descripcion col-6">{isDrawerVisibleRegistroIncidente.registro.fecha}</p>
                        <p className="titulo-descripcion col-6">Costo del incidente:</p>
                        <p className="descripcion col-6">{isDrawerVisibleRegistroIncidente.registro.costo}</p>
                        <p className="titulo-descripcion col-6">Numero de trabajadores implicados:</p>
                        <p className="descripcion col-6">{isDrawerVisibleRegistroIncidente.registro.trabajadores.length}</p>
                        <p className="titulo-descripcion">Trabajadores implicados:</p>
                        {isDrawerVisibleRegistroIncidente.registro.trabajadores.map((registro,index) => (
                            <p className="descripcion">{index}.-{registro.trabajador.nombre}</p>
                        ))}
                    </div>
            </Drawer>
            )}

        </div>
    )
}
