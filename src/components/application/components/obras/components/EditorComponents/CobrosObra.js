import { Button, Divider, Form, Modal, Table,InputNumber, DatePicker, Input, Upload, Row, Col, Statistic, Card, message, Drawer, Checkbox } from "antd"
import { useEffect, useState } from "react";
import { ExclamationCircleOutlined,UploadOutlined,CopyOutlined,DeleteOutlined,EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { fetchConToken,fetchConTokenSinJSON } from "../../../../../../helpers/fetch";
const { confirm } = Modal;
const { RangePicker } = DatePicker;

export const CobrosObra = ({socket,obraInfo}) =>{

    const obraId = obraInfo._id;
    const [form] = Form.useForm();
    const [registrosCobros, setRegistrosCobros] = useState([]);
    const [totalCobros, setTotalCobros] = useState(0);
    const [evidencia, setEvidencia] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState({estado:false,tipo:"REGISTRAR",cobro:null});
    const [isDrawerVisible, setIsDrawerVisible] = useState({estado:false,cobro:null});
    const [filesList, setFilesList] = useState([]);

    
    useEffect(() => {
        obraInfo.cobros.map(cobro => cobro.key = cobro._id);
        setRegistrosCobros(obraInfo.cobros);

        let number = 0;
        for(const cobro of obraInfo.cobros) number += cobro.monto;
        setTotalCobros(number);
    }, [obraInfo]);
    
    const columns = [
        {
            title:<p className="titulo-descripcion">Monto de cobro</p>,
            render:(text,record) => (<p className="descripcion text-success">$ {record.monto}</p>)
        },

        {
            title:<p className="titulo-descripcion">Fecha del cobro</p>,
            render:(text,record) => (<p className="descripcion">{record.fecha}</p>)
        },
        {
            title:<p className="titulo-descripcion">Documento(s) o evidencia</p>,
            render:(text,record) => (<p className="descripcion text-primary" style={{cursor:"pointer"}} onClick={() => {setIsDrawerVisible({estado:true,cobro:record})}}>Ver informacion completa</p>)
        },
        {
            title:<p className="titulo-descripcion">Acciones</p>,
            render:(text,record) => (
                <div className="d-flex justify-content-start align-items-center flex-wrap gap-2">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => {setIsModalVisible({estado:true,tipo:"EDITAR",cobro:record})}}>Editar registro</Button>
                    <Button type="primary" danger icon={<DeleteOutlined/>} onClick={() => {eliminarRegistro(record._id)}}>Eliminar registro</Button>
                </div>      
            )
        }
    ];

    useEffect(() => {
        if(isModalVisible.tipo === "EDITAR") return form.setFieldsValue({concepto:isModalVisible.cobro.concepto,monto:isModalVisible.cobro.monto,fecha:moment(isModalVisible.cobro.fecha)});
    }, [isModalVisible]);

    const props = {
        multiple:true,
        onRemove : file => {
            const newFiles = filesList.filter(fileOnState => fileOnState.name != file.name);
            setFilesList(newFiles);
        },
        beforeUpload: file => {
            setFilesList(files => [...files,file]);
            return false;
        },
        listType:"picture",
        fileList : filesList
    };


    const registrarCobro = (values) => {
        confirm({
            title:"Seguro quieres agregar este registro de cobro a la obra",
            icon:<ExclamationCircleOutlined />,
            content:"El cobro se registrara en la obra",
			okText:"Registrar",
			cancelText:"Volver atras",
            async onOk(){
                values.fecha = moment(values.fecha).format("YYYY-MM-DD");
                const formData = new FormData();
                for(const property in values) formData.append(property,values[property]);

                //Agregando los archivos si es que el usuario agrego evidencia
                if(filesList.length > 0) for(let i = 0; i < filesList.length; i++) formData.append(filesList[i].name,filesList[i]);

                const resp = await fetchConTokenSinJSON(`/obras/${obraId}/cobros/`,formData,"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Registro anadido con exito!
                message.success(body.msg);
                setFilesList([]);
                form.resetFields();
                setIsModalVisible(false);
                socket.emit("actualizar-obra-por-id",obraId);
            }
        });
    }
    console.log(evidencia);

    const editarCobro = (values) => {
        confirm({
            title:"Seguro quieres editar este registro de cobro a la obra",
            icon:<ExclamationCircleOutlined />,
            content:"El cobro se editara en la obra y si adjuntaste evidencia la vieja sera eliminada y remplazada por esta.", 
			okText:"Editar",
			cancelText:"Volver atras",
            async onOk(){
                values.fecha = moment(values.fecha).format("YYYY-MM-DD");
                const formData = new FormData();
                for(const property in values) {
                    formData.append(property,values[property]);
                }
                if(evidencia){
                    //Se editara el registro y tambien su evidencia
                    for(const archivo of filesList) {
                        formData.append(archivo.name,archivo);
                    }
                }
                const resp = await fetchConTokenSinJSON(`/obras/${obraId}/cobros/${isModalVisible.cobro._id}/`,formData,"PUT");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);

                //El cobro se edito correctamente
                message.success(body.msg);
                setFilesList([]);
                form.resetFields();
                setIsModalVisible(false);
                socket.emit("actualizar-obra-por-id",obraId);
            }
        });
 
    }

    const eliminarRegistro = (cobroId) => {
        confirm({
            title:"Seguro quieres eliminar este registro de cobro?",
            icon:<ExclamationCircleOutlined />,
            content:"El cobro se eliminara junto con los archivos de evidencia de este y NO habra forma de recuperarlo",
			okText:"ELIMINAR",
			cancelText:"Volver atras",
            async onOk(){
                const resp = await fetchConToken(`/obras/${obraId}/cobros/${cobroId}`,{},"DELETE");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);

                //Registro eliminado con exito
                message.success(body.msg);
                socket.emit("actualizar-obra-por-id",obraId);
            }
        });
    }

    return(
        <div className="container p-3 p-lg-5" style={{minHeight:"100vh"}}>
            <div className="d-flex justify-content-end align-items-center">
                <Button type="primary">Descargar resumen</Button>
            </div>

            <h1 className="titulo">Cobros de la obra</h1>
            <p className="descripcion">En esta sección se presentaran los cobros que se han hecho de la obra y su informacion pernitente de cada registro.</p>
            <Divider/>
            <div className="d-flex align-items-center justify-content-start gap-2 mt-4 flex-wrap">
                <Input.Search 
                    size="large" 
                    placeholder="Buscar un cobro por su concepto..." 
                    enterButton
                />
                <RangePicker size="large" locale={locale}/>
            </div>
            {/*Tarjetas*/}
            <Row gutter={16} className="mt-3">
                <Col xs={24} md={8}>
                    <Card>
                        <Statistic
                            title="Total de cobros"
                            precision={2}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                            value={totalCobros}
                            //suffix={<ArrowUpOutlined />}
                            prefix="$"
                        />
                    </Card>
                </Col>
                <Col xs={24} md={8} className="mt-3 mt-md-0">
                    <Card>
                        <Statistic
                            title="Numero de registros"
                            value={registrosCobros.length}
                            valueStyle={{
                                color: '#3f8600',
                            }}
                            prefix={<CopyOutlined/>}
                            //suffix="%"
                        />
                    </Card>
                </Col>
            </Row>
            <Button type="primary" className="mt-3" onClick={() => {setIsModalVisible({estado:true,tipo:"REGISTRAR"})}}>Agregar cobro</Button>

            <Table columns={columns} dataSource={registrosCobros} bordered className="mt-3"/>

            <Modal visible={isModalVisible.estado} onCancel={() => {setIsModalVisible({estado:false})}} onOk={() => {setIsModalVisible({estado:false})}} footer={null}>
                <h1 className="titulo">{isModalVisible.tipo === "REGISTRAR" ? "Agregar un registro de cobro" : "Editar registro de cobro"}</h1>
                <Form form={form} onFinish={(values) => {
                    (isModalVisible.tipo === "REGISTRAR") ? registrarCobro(values) : editarCobro(values)
                }} layout="vertical">
                    <Form.Item name="monto" label="Monto del cobro" rules={[{ required: true, message: 'Introduce el monton del cobro' }]}><InputNumber style={{width:"100%"}}/></Form.Item>
                    <Form.Item name="fecha" label="Fecha del cobro" rules={[{ required: true, message: 'Introduce la fecha del cobro' }]}><DatePicker locale={locale} style={{width:"100%"}}/></Form.Item>
                    <Form.Item name="concepto" label="Concepto del pago" rules={[{ required: true, message: 'Introduce el concepto del pago' }]}><Input.TextArea rows={10}/></Form.Item>
                    <Checkbox checked={evidencia} onChange={(e)=>{setEvidencia(e.target.checked)}} style={{width:"100%"}}>{isModalVisible.tipo === "registrar" ? "Adjuntar evidencia del trabajo" : "Editar evidencia del trabajo"}</Checkbox>
                    {
                        evidencia && (
                            <>
                                {isModalVisible.tipo === "EDITAR" && <span className="text-muted">(TEN EN CUENTA QUE AL MOMENTO DE EDITAR LA EVIDENCIA ANTERIOR HARA QUE ESTA SEA ELIMINADA Y REEMPLAZADA POR LA NUEVA)</span>}
                                <Upload {...props}><Button className="mt-3" icon={<UploadOutlined/>}>Subir documento(s)</Button></Upload>
                            </>
                        )
                    }
                    <Button className="mt-5" type="primary" htmlType="submit">Registrar cobro</Button>
                </Form>
            </Modal>
            {
                isDrawerVisible.cobro != null && (
                    <Drawer width="40%" visible={isDrawerVisible.estado} onClose={() => setIsDrawerVisible({estado:false,cobro:null})}>
                        <h1 className="titulo" style={{fontSize:"20px"}}>Informacion detallada del registro</h1>
                        <Divider/>
                        <h1 className="titulo-descripcion col-6 mt-3">Concepto del cobro: </h1>
                        <p className="descripcion">{isDrawerVisible.cobro.concepto}</p>
                        <h1 className="titulo-descripcion col-6 mt-3">Monto el cobro: </h1>
                        <p className="descripcion text-success col-6">${isDrawerVisible.cobro.monto}</p>
                        <h1 className="titulo-descripcion col-6 mt-3">Fecha del cobro: </h1>
                        <p className="descripcion col-6">{isDrawerVisible.cobro.fecha}</p>
                        <h1 className="titulo" style={{fontSize:"20px"}}>Evidencia u archivos del cobro</h1>
                        <Divider/>
                        {
                            isDrawerVisible.cobro.evidencia.map(archivo => (
                                <iframe type="text/plain" src={`http://localhost:4000/api/obras/${obraId}/cobros/${archivo}/`} style={{height:"100%",width:"100%"}} frameBorder="0" allowFullScreen></iframe>
                            ))
                        }
                    </Drawer>
                )
            }
       </div>
    )
}