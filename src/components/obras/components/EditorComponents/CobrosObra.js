import { Button, Divider, Form, Modal, Table,InputNumber, DatePicker, Input, Upload, Row, Col, Statistic, Card, message } from "antd"
import { useEffect, useState } from "react";
import { DownOutlined, ExclamationCircleOutlined,UploadOutlined,CopyOutlined,DeleteOutlined,EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { fetchConToken, fetchConTokenSinJSON } from '../../../../helpers/fetch';
const { confirm } = Modal;
const { RangePicker } = DatePicker;

export const CobrosObra = ({socket,obraInfo}) =>{

    const obraId = obraInfo._id;
    const [registrosCobros, setRegistrosCobros] = useState([]);
    const [totalCobros, setTotalCobros] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState({estado:false,tipo:"REGISTRAR"});
    const [filesList, setFilesList] = useState([]);

    
    console.log(totalCobros);
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
            render:(text,record) => (<p className="descripcion text-primary">Ver documentos</p>)
        },
        {
            title:<p className="titulo-descripcion">Acciones</p>,
            render:(text,record) => (
                <div className="d-flex justify-content-start align-items-center flex-wrap gap-2">
                    <Button type="primary" icon={<EditOutlined />}>Editar registro</Button>
                    <Button type="primary" danger icon={<DeleteOutlined/>}>Eliminar registro</Button>
                </div>      
            )
        }
    ];

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

                const resp = await fetchConTokenSinJSON(`/obras/${obraId}/agregar-cobro-obra/`,formData,"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Registro anadido con exito!
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
                <Form onFinish={registrarCobro} layout="vertical">
                    <Form.Item name="monto" label="Monto del cobro" rules={[{ required: true, message: 'Introduce el monton del cobro' }]}><InputNumber style={{width:"100%"}}/></Form.Item>
                    <Form.Item name="fecha" label="Fecha del cobro" rules={[{ required: true, message: 'Introduce la fecha del cobro' }]}><DatePicker locale={locale} style={{width:"100%"}}/></Form.Item>
                    <Form.Item name="concepto" label="Concepto del pago" rules={[{ required: true, message: 'Introduce el concepto del pago' }]}><Input.TextArea rows={10}/></Form.Item>
                    <Upload {...props}><Button icon={<UploadOutlined/>}>Subir documento(s)</Button></Upload>
                    <Button type="primary" htmlType="submit">Registrar cobro</Button>
                </Form>
            </Modal>
        </div>
    )
}