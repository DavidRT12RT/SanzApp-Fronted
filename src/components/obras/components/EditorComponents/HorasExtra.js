import React, { useEffect, useState } from 'react'
import { Button, Divider, Form, Input, Modal, Table, Select, InputNumber, message, Dropdown, Space, Badge, Menu, DatePicker, Steps, Upload, Drawer} from "antd";
import { InfoCircleOutlined,DownOutlined, ExclamationCircleOutlined,WarningOutlined, UploadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { PDFDownloadLink } from '@react-pdf/renderer';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { HorasExtraRecibo } from '../../../../reportes/Obras/HorasExtraRecibo';
import { fetchConTokenSinJSON } from '../../../../helpers/fetch';
const { Option } = Select;
const { confirm } = Modal;
const { Step } = Steps;


export const HorasExtra = ({obraInfo,socket}) => {
    
    const [dataSource, setDataSource] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
	const [filesList, setFilesList] = useState([]);
    const [current, setCurrent] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalVisiblePagarHoras, setIsModalVisiblePagarHoras] = useState({estado:false,tipo:null,registro:null});
    const [isDrawerVisibleEvidencia, setIsDrawerVisibleEvidencia] = useState({estado:false,evidencia:null});
    const [empleadosObra, setEmpleadosObra] = useState([]);
    const [form] = Form.useForm();
    const obraId = obraInfo._id;

    useEffect(() => {
        for(let index = 0;index < obraInfo.horasExtra.length; index++){
            //Por cada trabajador registrado en horas extra añadimos un elemento key para ANT DESIGN
            let trabajador = obraInfo.horasExtra[index];
            trabajador.key = trabajador._id;
            trabajador.horasTotales = 0;
            trabajador.todasPagadas = true;

            for (let j = 0; j < obraInfo.horasExtra[index].registros.length; j++) {
                //Por cada registro del element añadimos un elemento key
                let registro = obraInfo.horasExtra[index].registros[j];
                registro.key = registro._id;
                trabajador.horasTotales += registro.horas;
                if(registro.pagadas === false) trabajador.todasPagadas = false
            }
        }
        setDataSource(obraInfo.horasExtra);
        setEmpleadosObra(obraInfo.trabajadores);
    }, [obraInfo]);

    const props = {
        onRemove : file => {
            setFilesList([]);
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma función*/
        },
        beforeUpload: file => {
            //Verificar que el archivo sea un PDF
            const isPDForXML = file.type === "application/pdf";
            if(!isPDForXML) return message.error("EL ARCHIVO EVIDENCIA NECESITA SER UN PDF");

            //Verificar que el fileList sea menos a 2 
            if(filesList.length < 1){
                setFilesList(files => [...files,file]);
            }else{
                message.error("Solo puedes subir 1 archivo en total");
            }
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            return false;
        },
        listType:"picture",
        maxCount:1,
        fileList : filesList
    };


    const steps = [
        {
            title: "Resumen",
            content:
                isModalVisiblePagarHoras.tipo == "TODAS"
                ?
                <div className="row">
                    <h1 className="titulo-descripcion col-12">Tipo de pago:</h1>
                    <p className="descripcion col-12 text-success">PAGO DE TODAS LAS HORAS EXTRA</p>
                    <h1 className="titulo-descripcion col-12">Total de horas extra a pagar:</h1>
                    <p className="descripcion col-12">{isModalVisiblePagarHoras.registro.horasTotales}</p>
                </div>
                :
                <div className="row">
                    <h1 className="titulo-descripcion col-12">Tipo de pago:</h1>
                    <p className="descripcion col-12 text-primary">PAGO DE UN SOLO REGISTRO DE HORA EXTRA</p>
                    <h1 className="titulo-descripcion col-12">Total de horas extra a pagar:</h1>
                    <p className="descripcion col-12">{isModalVisiblePagarHoras.registro?.horas}</p>
                    <h1 className="titulo-descripcion col-12">Fecha de las horas extra:</h1>
                    <p className="descripcion col-12">{isModalVisiblePagarHoras.registro?.fecha}</p>
                    <h1 className="titulo-descripcion col-12">Motivo:</h1>
                    <p className="descripcion col-12">{isModalVisiblePagarHoras.registro?.motivo}</p>
                </div>,
        },
        {
            title: "Documentos a descargar",
            content:
                <div>
                    <WarningOutlined style={{fontSize:"50px",color:"#FFC300"}}/>
                    <p className="descripcion"><b>Descarga</b> el documento con el boton que esta a continuacion.<br></br> Es importante descargar el documento y hacer que el <b>empleado</b> <b>firme</b> sus horas extra ya pagadas y subir el documento en la pestana siguiente para mantener la <b>evidencia</b> de esto.</p>
                    <PDFDownloadLink document={<HorasExtraRecibo registro={isModalVisiblePagarHoras.registro} tipo={isModalVisiblePagarHoras.tipo}/>} fileName={`Evidencia.pdf`}>
                        {({ blob, url, loading, error }) => (<Button type="primary" loading={loading}>{loading ? "Cargando documento..." : "Descargar documento"}</Button>)}
                    </PDFDownloadLink> 
                </div>,
        },
        {
            title: "Documentos a subir",
            content: 
                <>
                    <Upload {...props}>
                        <Button icon={<UploadOutlined/>}>Selecciona el archivo de evidencia</Button>
                    </Upload>
                </>
        },
    ];
    
    const expandedRowRender = (record,index,indent,expanded) => {
        const { trabajador } = record;
        const columns = [
        {
            title: <p className="titulo-descripcion">Fecha de las horas extra</p>,
            render:(text,record) => {
                return editingRow === record.key 
                    ?
                        <Form.Item name="fecha" rules={[{required:true,message:"Tiene que tener un valor este campo"}]}>
                            <DatePicker locale={locale} format={"YYYY-MM-DD"}/>
                        </Form.Item>
                    :
                        <p className="descripcion">{record.editado && <span className="text-primary">EDITADO </span>}  {record.fecha}</p>
            }
        },
        {
            title: <p className="titulo-descripcion">Motivo</p>,
            render:(text,record) => {
                return editingRow === record.key 
                    ? 
                    (
                        <Form.Item name="motivo" rules={[{required:true,message:"Tiene que tener un valor este campo"}]}>
                            <Input/>
                        </Form.Item>
                    )
                    :
                    <p className="descripcion">{record.motivo}</p>
            }
        },
        {
            title: <p className="titulo-descripcion">Horas</p>,
            render:(text,record) => {
                return editingRow === record.key
                    ?
                    (
                        <Form.Item name="horas" rules={[{required:true,message:"Tiene que tener un valor este campo!"}]}>
                            <InputNumber style={{width: "100%"}} min={1} />
                        </Form.Item>
                    )
                    :
                    <p className="descripcion">{record.horas}</p>
            }
        },
        {
            title: <p className="titulo-descripcion">Estatus</p>,
            render: (text,record) => {
                return record.pagadas ? <p className="descripcion"><Badge status="success"/>Pagadas</p> : (<p className="descripcion"><Badge status="error"></Badge>NO Pagadas</p>)
           }
        },
        {
            title:<p className="titulo-descripcion">Acciones</p>,
            render:(_,record) => {
                    //Si ya estan pagadas el usuario NO podra editar las horas extra
                    if(record.pagadas){
                        return <Button type="primary" onClick={()=>{setIsDrawerVisibleEvidencia({estado:true,registro:{...record,trabajador}})}}>Ver evidencia</Button>
                    }else{
                    return (
                        <div className="d-flex gap-2">
                            {
                                editingRow === record.key
                                ?
                                    <div className="d-flex gap-2">
                                        <Button type="primary" danger htmlType="submit">Realizar cambios</Button>
                                        <Button type="primary" onClick={()=>{setEditingRow(null)}}>Dejar de editar</Button>
                                    </div>
                                :
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => {
                                        setEditingRow(record.key);
                                        form.setFieldsValue({
                                            horas:record.horas,
                                            motivo:record.motivo,
                                        });
                                    }}
                                >Editar</Button>

                            }
                            <Button type="primary" style={{borderColor:"green",backgroundColor:"green"}} onClick={()=>{setIsModalVisiblePagarHoras({estado:true,tipo:"UNICA",registro:{...record,trabajador}})}}>Pagar horas extra</Button>
                        </div>
                        )
                    }

            },
        },
        ];
        return <Form form={form} onFinish={(values)=> {actualizarHorasExtra(values,record.trabajador.uid,editingRow)}}><Table columns={columns} dataSource={record.registros}/></Form>;
    };
    
    const actualizarHorasExtra = (values,trabajador,idRegistro) => {
        confirm({
            title:"Seguro quieres editar estas horas extra al empleado?",
            icon:<ExclamationCircleOutlined />,
            content:"Las horas extras seran editadas al empleado en la obra.",
			okText:"Editar",
			cancelText:"Volver atras",
            async onOk(){
                values.obraId = obraId;
                values.trabajador = trabajador;
                values.registroId = idRegistro;
                values.fecha = moment(values.fecha).format("YYYY-MM-DD")
                socket.emit("actualizar-horas-extra-en-obra",values,(confirmacion)=>{
                    if(!confirmacion.ok) return message.error(confirmacion.msg);
                    //Horas extra actualizadas con exito!
                    message.success(confirmacion.msg);
                    setEditingRow(null);
                });
            }
        });
    }

    const agregarHorasExtra = (values) => {
        confirm({
            title:"Seguro quieres agregar estas horas extra al empleado?",
            icon:<ExclamationCircleOutlined />,
            content:"Las horas extras seran agregadas al empleado en la obra y se marcaran como NO pagadas y se mostraran como pendientes",
			okText:"Agregar",
			cancelText:"Volver atras",
            async onOk(){
                values.obraId = obraId;
                values.fecha = moment(values.fecha).format("YYYY-MM-DD");
                socket.emit("añadir-horas-extra-a-obra",values,(confirmacion)=>{
                    form.resetFields();
                    confirmacion ? (setIsModalVisible(false))(message.success(confirmacion.msg)) : message.error(confirmacion.msg);
                });
            }})
    } 

    const pagarHorasExtra = () => {
		confirm({
            title:"¿Seguro quieres pagar estas horas extra?",
            icon:<ExclamationCircleOutlined />,
            content:"Las horas extra se marcaran como pagadas y YA NO podras editar la informacion como la fecha , el motivo , la cantidad de horas extra ni nada de esto",
			okText:"Pagar",
			cancelText:"Volver atras",
            async onOk(){
        		const formData = new FormData();
                formData.append("archivo",filesList[0]);
                formData.append("registroId",isModalVisiblePagarHoras.registro._id);
                formData.append("trabajadorId",isModalVisiblePagarHoras.registro.trabajador.uid);

                const resp = await fetchConTokenSinJSON(`/obras/${obraId}/pagar-horas-extra`,formData,"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Horas extra pagadas!
                message.success(body.msg);
                //Actualizar obra por sockets
                socket.emit("actualizar-obra-por-id",obraId);
                setIsModalVisiblePagarHoras({estado:false,tipo:null,registro:null});
            }
        })
    }

    const pagarHorasExtraTotales = () => {
		confirm({
            title:"¿Seguro quieres pagar TODAS las horas extra?",
            icon:<ExclamationCircleOutlined />,
            content:"Las horas extra se marcaran como pagadas y YA NO podras editar la informacion como la fecha , el motivo , la cantidad de horas extra ni nada de esto",
			okText:"Pagar TODAS",
			cancelText:"Volver atras",
            async onOk(){
        		const formData = new FormData();
                formData.append("archivo",filesList[0]);
                formData.append("trabajadorId",isModalVisiblePagarHoras.registro.trabajador.uid);
                const resp = await fetchConTokenSinJSON(`/obras/${obraId}/pagar-horas-extra-totales`,formData,"POST"); 
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Hora extra TOTALES pagadas
                message.success(body.msg);
                socket.emit("actualizar-obra-por-id",obraId);
                setIsModalVisiblePagarHoras({estado:false,tipo:null,registro:null});
            }
        });
    }

    const columns = [
        {
            title:<p className="titulo-descripcion">Trabajador</p>,
            render: (text,record) => {
                return <p className="descripcion">{record.trabajador.nombre}</p>
            }
        },
        {
            title:<p className='titulo-descripcion'>Cantidad de horas extra totales</p>,
            render: (text,record) => {
                return <p className="descripcion">{record.horasTotales}</p>;
            }
        },
        {
            title:<p className='titulo-descripcion'>Cantidad de registros</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.registros.length}</p>
            }
        },
        {
            title:<p className='titulo-descripcion'>Horas totales pagadas</p>,
            dataIndex:"pagadasTodas",
            render:(text,record) =>{
                return record.todasPagadas ? <p className="descripcion"><Badge status="success"/>Pagadas</p> : <p className="descripcion"><Badge status="error"></Badge>NO Pagadas</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Pagar TODAS las horas extra</p>,
            render:(text,record) => {
                return record.todasPagadas ? <p className="descripcion text-success">Todas pagadas</p> : <Button type="primary" onClick={()=>{setIsModalVisiblePagarHoras({estado:true,tipo:"TODAS",registro:record})}}>Pagar TODAS</Button>
            }
        }
    ];

    return (
        <div className="container p-3 p-lg-5" style={{minHeight:"100vh"}}>
            <div className="d-flex justify-content-end align-items-center gap-2">
                <Button type="primary">Descargar resumen</Button>
            </div>
            <h1 className="titulo">Horas extra en la obra</h1>
            <p className="descripcion">
                En esta sección se podran añadir horas extra a los empleados que se encuentren registrados trabajando dentro de la obra, <br/>
                asi como marcar si las horas estan pagadas o NO. 
            </p>
            <Divider/>
            <Button onClick={()=>{setIsModalVisible(true)}} type="primary">Añadir nuevo registro</Button>
            <Table className="mt-3" bordered columns={columns} dataSource = {dataSource} expandable={{expandedRowRender}}/>

            <Modal visible={isModalVisible} onOk={()=>{setIsModalVisible(false)}} onCancel={()=>{setIsModalVisible(false)}} footer={null}>
                <h1 className="titulo">Agregar un nuevo registro</h1>
                <p className="descripcion">Añade y administra las horas extra de los trabajadores en la obra!</p>
                <Form form = {form} onFinish={agregarHorasExtra} layout="vertical">
                    <Form.Item label="Nombre del empleado" name="trabajador" rules={[{required:true,message:"Debes ingresar el nombre del empleado!"}]}>
                        <Select placeholder="Selecciona el nombre del empleado...">
                            {
                                empleadosObra.map(empleado => {
                                    return <Option key={empleado.id.uid} value={empleado.id.uid}>{empleado.id.nombre}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item label="Cantidad de horas extra" name="horas" rules={[{required:true,message:"Debes ingresar la cantida de horas extra!"}]}>
                        <InputNumber style={{width: "100%"}} min={1} max={99}/>
                    </Form.Item>
                    <Form.Item label="Fecha de las horas extra" name="fecha" rules={[{required:true,message:"Debes ingresar la cantida de horas extra!"}]}>
                        <DatePicker locale={locale} format={"YYYY-MM-DD"} style={{width:"100%"}}/>
                    </Form.Item>
                    <Form.Item label="Motivo" name="motivo" rules={[{required:true,message:"Especifica el motivo por el cual se van agregar las horas extrra!"}]}>
                        <Input.TextArea allowClear showCount minLength={40} style={{width:"100%"}} placeholder="Descripción del producto" />
                    </Form.Item>
                    <Button type="primary" htmlType='submit'>Registrar nuevo elemento</Button>
                </Form>
            </Modal>
            <Modal visible={isModalVisiblePagarHoras.estado} footer={null} onOk={()=>{setIsModalVisiblePagarHoras({estado:false,tipo:null})}} onCancel={()=>{setIsModalVisiblePagarHoras({estado:false,tipo:null})}}>
                <h1 className="titulo">{isModalVisiblePagarHoras.tipo === "TODAS" ? "Pagar TODAS las horas extra" : "Pagar hora extra"}</h1>
                <p className="descripcion">{isModalVisiblePagarHoras.tipo === "TODAS" ? "Pagar TODAS las horas extra registra del empleado , el empleado tendra que firmar un documento firmado que se descargara en la siguiente seccion." : `Pagar hora extra registrada del empleado,el empleado tendra que firmar un documento que se encuentra en la siguiente seccion.` }</p>
                <Steps current={current}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content p-5">{steps[current].content}</div>
                <div className="steps-action">
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={() => setCurrent(current + 1)}>
                            Siguiente
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <Button type="primary" disabled={filesList.length === 0} onClick={()=>{isModalVisiblePagarHoras.tipo === "TODAS" ? pagarHorasExtraTotales() : pagarHorasExtra()}}>
                            Pagar horas extra
                        </Button>
                    )}
                    {current > 0 && (
                        <Button style={{margin: '0 8px',}} onClick={() => setCurrent(current - 1)}>
                            Anterior
                        </Button>
                    )}
                </div>
            </Modal>
            {isDrawerVisibleEvidencia.estado === true && (
                <Drawer width={"60%"} placement="left" visible={isDrawerVisibleEvidencia.estado} onClose={()=>{setIsDrawerVisibleEvidencia({estado:false,evidencia:null})}}>
                    <h1 className="titulo">Evidencia de el pago</h1>
                    <Divider/>
                    {/*/obras/obra/:obraId/horasExtra/:trabajadorId/:registroId*/}
                    <iframe type="text/plain" src={`http://localhost:4000/api/uploads/obras/obra/${obraId}/horasExtra/${isDrawerVisibleEvidencia.registro.trabajador.uid}/${isDrawerVisibleEvidencia.registro._id}`} style={{height:"100%",width:"100%"}} frameBorder="0" allowFullScreen></iframe>
                </Drawer>
            )}
       </div>
    )
}