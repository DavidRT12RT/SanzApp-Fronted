
import React,{ useState,useEffect } from 'react'
import "../../assets/facturasLista.css";
import { DownOutlined,UploadOutlined ,CopyOutlined } from '@ant-design/icons';
import { fetchConToken, fetchConTokenSinJSON } from '../../../../helpers/fetch';
import { Button, Card, Col, Divider, Dropdown, Menu, message, Row, Space, Statistic,Table,Modal,Upload,Input, Form, InputNumber} from 'antd';


export const AbonosLista = ({socket,obraInfo}) => {
    
    const {_id:obraId} = obraInfo;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [dataAbonos, setDataAbonos] = useState([]);
    const [obraInfoAbonos, setObraInfoAbonos] = useState({});

    //Seteamos la data cada vez que el componente se monte por primera vez
    useEffect(() => {
        obraInfo.abonos.registros.map(element => element.key = element._id);
        setDataAbonos(obraInfo.abonos.registros);

        setObraInfoAbonos(obraInfo.abonos);
    }, []);

    //Seteamos la data cada vez que la obraInfo se actualize por algun socket de un cliente
    useEffect(() => {
        obraInfo.abonos.registros.map(element => element.key = element._id);
        setDataAbonos(obraInfo.abonos.registros);

        setObraInfoAbonos(obraInfo.abonos);
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
            return setDataAbonos(obraInfo.abonos.registros);
        }

        const resultadosBusqueda = obraInfo.abonos.registros.filter((elemento)=>{
            if(elemento.concepto.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setDataAbonos(resultadosBusqueda);
    }


    const handleUpload =  async (values) =>{

        values.obraId = obraId;
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
            if(resp.status === 200){
                //Subir la información
                const body = await resp.json();
                values.rutaArchivo = body.nombre;
                socket.emit("añadir-abono-obra",values,async(confirmacion)=>{
                    confirmacion ? message.success(confirmacion.msg) : message.error(confirmacion.msg);
                });
            }else{
                message.error("No se pudo crear el abono!");
            }
        } catch (error) {
            
        }
                
        handleCancel();
        //Quitando los archivos del filesList
        setFilesList([]);
        setUploading(false);
    }

    const handleDownloadPDF = async (values) => {
        const { rutaArchivo } = values;
        try {
            const resp = await fetchConToken(`/uploads/obras/obra/${obraId}/abonos/${rutaArchivo}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            //Cortamos y obtenemos el nombre
            const nombreArchivo = rutaArchivo.split("/")[1];
            element.setAttribute('download',nombreArchivo);
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
            title: 'Beneficiario',
            dataIndex: 'beneficiario',
            key: 'beneficiario',
        },
        {
            title: 'Categoria',
            dataIndex: 'categoria',
            key: 'categoria',
        },
        {
            title: 'concepto',
            dataIndex: 'concepto',
            key: 'concepto',
            responsive:["sm"],
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
            const isPDF = file.type === "application/pdf";
            if(isPDF){
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
        <>
            <div>
                <h1>Abonos de la obra</h1>
                <p className="lead">
                    En esta sección se encuentran todos los abonos con su respectivo documento PDF.
                </p>
                <Divider/>
                
                {/*Buscador con autocompletado*/}
                    <Input.Search 
                        size="large" 
                        placeholder="Buscar un abono por su concepto..." 
                        enterButton
                        onSearch={handleSearch}
                        className="search-bar-class"
                    />

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
                <Button type="primary" className="my-3" onClick={showModal}>Agregar nuevo abono!</Button>

                <Table columns={columns} dataSource={dataAbonos} bordered style={{width:"100vw"}}/>

                <Modal title="Agregar factura" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                        <h1>Subir un nuevo abono al sistema!</h1>
                        <p className="lead">Para poder realizar esta acción necesitaras el documento PDF del abono y llenar el siguiente formulario!</p>
                            <Form onFinish={handleUpload} layout="vertical">
                                <Row gutter={16}>
                                    <Col xs={24} lg={12}>
                                        <Form.Item name="concepto" label="Concepto del abono">
                                            <Input size="large"></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} lg={12}>
                                        <Form.Item name="categoria" label="Categoria del abono">
                                            <Input size="large"></Input>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} lg={12}>
                                        <Form.Item name="cantidad" label="Cantidad total del abono">
                                            <InputNumber size="large" style={{width:"100%"}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} lg={12}>
                                        <Form.Item name="beneficiario" label="Beneficiario del abono">
                                            <Input size="large" style={{width:"100%"}}/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Upload {...props} className="upload-list-inline" >
                                            <Button icon={<UploadOutlined/>}>Selecciona el archivo del abono</Button>
                                        </Upload>
                                    </Col>
                                    <Button 
                                        type="primary" 
                                        disabled={filesList.length === 0}
                                        loading={uploading}
                                        htmlType="submit"
                                    >
                                        {uploading ? "Subiendo..." : "Comienza a subir!"}     
                                    </Button>
                               </Row>
                           </Form>


               </Modal>
            </div>
        </>
  )
}
