import React, { useContext, useEffect, useState } from 'react';
import { Button, DatePicker, Divider, Form, message, Modal, Select, Tabs, Tag, Upload,} from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
//import { EditInfo } from './components/EditInfo';
import { SocketContext } from '../../../../context/SocketContext';
import { ExclamationCircleOutlined,UploadOutlined,InboxOutlined } from '@ant-design/icons';
//import { RealizarRetiroAlmacen } from './components/RealizarRetiroAlmacen';
import { fetchConToken, fetchConTokenSinJSON } from '../../../../helpers/fetch';
import { Loading } from '../../../obras/Loading';
import { SalidasProducto }  from './components/SalidasProducto';
import { EntradasProducto } from './components/EntradasProducto';
import "./components/assets/style.css";
import { useForm } from '../../../../hooks/useForm';
import { useCategorias } from '../../../../hooks/useCategorias';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { ReporteGeneral } from '../../../../reportes/Productos/ReporteGeneral';

import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { MovimientosProducto } from './components/MovimientosProducto';
import Barcode from 'react-barcode';
const { RangePicker } = DatePicker;

const { TabPane } = Tabs;
const { Dragger } = Upload;
const { confirm } = Modal;

export const ProductoScreen = () => {

    const {productoId} = useParams();
    const navigate = useNavigate();
	const [filesList, setFilesList] = useState([]);
    const [informacionProducto, setInformacionProducto] = useState({});
    const [uploading, setUploading] = useState(false);
	const { isLoading:isLoadingCategorias,categorias } = useCategorias();
    const {socket} = useContext(SocketContext);
    const [isProductoEditing, setIsProductoEditing] = useState(false);
    const [formValues,handleInputChange,setValues] = useForm({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    
    //Formulario para editar informacion del producto

    useEffect(()=>{

        const fetchDataProducto = async () => {
            const resp = await fetchConToken(`/productos/${productoId}`);
            const body = await resp.json();
            if(resp.status === 200) {
                body.registrosEntradas.sobranteObra.map(registro => {registro.tipo = "sobranteObra"; registro.key = registro._id;});
                body.registrosEntradas.devolucionResguardo.map(registro => {registro.tipo = "devolucionResguardo"; registro.key = registro._id})
                body.registrosEntradas.compraDirecta.map(registro => {registro.tipo = "compraDirecta"; registro.key = registro._id})
                body.registrosSalidas.obra.map(registro => {registro.tipo = "obra"; registro.key = registro._id;});
                body.registrosSalidas.merma.map(registro => {registro.tipo = "merma"; registro.key = registro._id});
                body.registrosSalidas.resguardo.map(registro => {registro.tipo = "resguardo"; registro.key = registro._id});
                setInformacionProducto(body);
            }
            else{
                message.error("El ID del producto NO existe");
                return navigate(-1);
            }
        }
        fetchDataProducto();
        //Setear el tipo de cada salida

    },[]);

    useEffect(() => {

        socket.on("actualizar-producto",(producto)=>{
            if(productoId === producto._id) {
                producto.registrosEntradas.sobranteObra.map(registro => {registro.tipo = "sobranteObra"; registro.key = registro._id;});
                producto.registrosEntradas.devolucionResguardo.map(registro => {registro.tipo = "devolucionResguardo"; registro.key = registro._id})
                producto.registrosEntradas.compraDirecta.map(registro => {registro.tipo = "compraDirecta"; registro.key = registro._id})
                producto.registrosSalidas.obra.map(registro => {registro.tipo = "obra"; registro.key = registro._id;});
                producto.registrosSalidas.merma.map(registro => {registro.tipo = "merma"; registro.key = registro._id});
                producto.registrosSalidas.resguardo.map(registro => {registro.tipo = "resguardo"; registro.key = registro._id});
                setInformacionProducto(producto);
            }
        });

    }, [socket,setInformacionProducto,productoId]);

    useEffect(() => {
        
        if(Object.keys(informacionProducto).length != 0){
            //Seteamos la informacion por si el usuario quisiera editar esta
            setValues({
                nombre:informacionProducto.nombre,
                marca:informacionProducto.marca,
                categoria:informacionProducto.categoria._id,
                inventariable:informacionProducto.inventariable,
                estado:informacionProducto.estado,
                estatus:informacionProducto.estatus,
                costo:informacionProducto.costo,
                descripcion:informacionProducto.descripcion,
                aplicaciones:informacionProducto.aplicaciones,
                unidad:informacionProducto.unidad
            })
        }
    }, [informacionProducto]);


    const props = {
        onRemove : file => {
            setFilesList([]);
            /*Podemos tener mas logica de lo comun es nuestro useState tal que asi, 
             con un callback y al final llamar a la misma función*/
        },
        beforeUpload: file => {
            //Verificar que el fileList sea menos a 2 
            if(filesList.length < 1){
                setFilesList(files => [...files,file]);
            }else{
                message.error("Solo puedes subir 1 archivo en total");
            }
            //Deestructuramos el estado actual y añadimos el nuevo archivo
            return false;
        },
        maxCount:1,
        fileList : filesList
    };

    const onFinishEditingProduct = () => {
        for (const property in formValues){
            if(formValues[property] === "") return message.error("Faltan registros por completar!");
        }
		confirm({
            title:"¿Seguro quieres editar la informacion del producto?",
            icon:<ExclamationCircleOutlined />,
            content:"La informacion del producto se vera cambiada y se anadira un registro de la accion.",
			okText:"Editar",
			cancelText:"Volver atras",
            async onOk(){
				setUploading(true);
        		const formData = new FormData();
				formData.append("nombre",formValues.nombre);
				formData.append("descripcion",formValues.descripcion);
				formData.append("marca",formValues.marca);
				formData.append("categoria",formValues.categoria);
				formData.append("estado",formValues.estado);
				formData.append("estatus",formValues.estatus);
				formData.append("unidad",formValues.unidad);
				formData.append("inventariable",formValues.inventariable);
				formData.append("aplicaciones",formValues.aplicaciones)
                if(filesList.length != 0){
                    filesList.forEach(file => {
            		    formData.append("archivo",file);
        		    });
                }
                const resp = await fetchConTokenSinJSON(`/productos/${productoId}`,formData,"PUT");
				const body = await resp.json();
				if(resp.status === 200){
					message.success(body.msg);
                    setIsProductoEditing(false)
                    setInformacionProducto(body.producto);
				    setFilesList([]);
                    //Mandar a actualizar el producto
                    socket.emit("actualizar-producto",{id:productoId});
				}else{
					message.error(body.msg);
                    setIsProductoEditing(false)
				}
				setUploading(false);
           	},
        });
    }

    const crearReporteGeneral = async(values) => {

        //Sacar entradas del producto
        const entradas = [...informacionProducto.registrosEntradas.sobranteObra,...informacionProducto.registrosEntradas.devolucionResguardo,...informacionProducto.registrosEntradas.compraDirecta];
        const entradasFiltradas = entradas.filter(entrada => {
            if((values.tipoEntrada.includes(entrada.tipo)) && (moment(entrada.fecha).isBetween(values.intervaloFecha[0].format("YYYY-MM-DD"),values.intervaloFecha[1].format("YYYY-MM-DD")))) return entrada;
        });

        //Sacar salidas del producto 
        const salidas = [...informacionProducto.registrosSalidas.obra,...informacionProducto.registrosSalidas.merma,...informacionProducto.registrosSalidas.resguardo];
        const salidasFiltradas = salidas.filter(salida => {
            if((values.tipoSalida.includes(salida.tipo)) && (moment(salida.fecha).isBetween(values.intervaloFecha[0].format("YYYY-MM-DD"),values.intervaloFecha[1].format("YYYY-MM-DD")))) return salida;
        });

        const blob = await pdf((
            <ReporteGeneral informacionProducto={informacionProducto} productoId={productoId} intervaloFecha={[values.intervaloFecha[0].format('YYYY-MM-DD'),values.intervaloFecha[1].format('YYYY-MM-DD')]} entradas={entradasFiltradas} salidas={salidasFiltradas} entradasCategorias={values.tipoEntrada} salidasCategorias={values.tipoSalida}/>
        )).toBlob();
        saveAs(blob,"reporte_general.pdf")
        
    }

    if( Object.keys(informacionProducto).length === 0 || isLoadingCategorias){
        <Loading/>
    }else{
        return (
            <div className="container p-3 p-lg-5">
                <div className="d-flex justify-content-end gap-2 flex-wrap">
                    {!isProductoEditing && <Link to="/almacen/productos"><Button type="primary">Regresar a lista de productos</Button></Link>}
                    {isProductoEditing && <Button type="primary" danger onClick={()=>{setIsProductoEditing(false)}}>Salir sin guardar</Button>}
                    {isProductoEditing ? <Button type="primary" warning onClick={()=>{onFinishEditingProduct();}}>Guardar cambios</Button> : <Button type="primary" onClick={()=>{setIsProductoEditing(true)}}>Editar informacion</Button> }
                </div>
                 <div className="row mt-5">
                    {/* Imagen del producto*/}
                    <div className="col-lg-6 col-12 d-flex justify-content-center align-items-center">
                        {isProductoEditing
                            ?
					            <Dragger {...props} height="300px" className="p-5">
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">Click o arrastra la nueva foto de el producto</p>
                                    <p className="ant-upload-hint">
                                        Soporte solo para una imagen ya sea de tipo PNG o JPG.
                                    </p>
                                </Dragger>
                            :
                                <div className="d-flex justify-content-center align-items-center flex-column">
                                    {/*<PDFDownloadLink document={<DocumentoPDF/>} fileName={`${productoId}.pdf`}></PDFDownloadLink>*/}
                                    <img src={`http://localhost:4000/api/uploads/productos/${informacionProducto._id}`} className="imagen-producto" key={`http://localhost:4000/api/uploads/productos/${informacionProducto._id}`}/>
                                    <Button type="primary" className="mt-3" onClick={()=>{setIsModalVisible(true)}}>Descargar reporte general del producto</Button>
                                    <p className="text-muted text-center mt-2 w-100">(Entradas y salidas del producto)</p>
                                </div>
                        }
                    </div>

                    {/* Informacion basica del producto*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        {isProductoEditing
                            ?
                                <input
                                    className="form-control nombre-producto"
                                    value={formValues.nombre}
                                    name="nombre" 
                                    onChange={handleInputChange}
                                />
                            :
                                <h1 className="nombre-producto">{informacionProducto.nombre}</h1>
                        }
                        {isProductoEditing 
                            ?
                                <select id="estatus" className="form-select mt-3 w-50 descripcion" aria-describedby="inventariableHelpBlock" value={formValues.estatus} name="estatus" onChange={handleInputChange}>
                                    <option className="text-success" value={true}>Disponible</option>
                                    <option className="text-danger" value={false}>NO disponible</option>
                                </select>
                            :
                                informacionProducto.estatus ? <h1 className="text-success estatus-producto">Disponible</h1> : <h1 className="text-danger estatus-producto">No disponible</h1>
                        } 
                        {isProductoEditing 
                            ?
                                <select className="form-select mt-3 col-5 w-50 descripcion my-4" style={{width:"50%",borderRadius: "0.25rem"}} size="large" name="categoria" value={formValues.categoria} onChange={handleInputChange}>
						                {categorias.map(categoria => {
							                return (
                  				                <option value={categoria._id}>{categoria.nombre}</option>
							                )
						                })}
              		            </select>
                            :
                                <Tag className="my-3" style={{backgroundColor:informacionProducto.categoria.color,borderColor:informacionProducto.categoria.color,fontSize:"13px",padding:"13px",maxWidth:"fit-content"}}>{informacionProducto.categoria.nombre}</Tag>
                        }
                        <h1 className="titulo-descripcion">Precio promedio X unidad:</h1>
                        <h1 className="precio-por-unidad-producto">${informacionProducto.costo}</h1>
                        <div className="row mt-5">
                            <h1 className="titulo-descripcion col-6">Cantidad en bodega:</h1>
                            <h1 className="descripcion col-6">{informacionProducto.cantidad}</h1>
                            {isProductoEditing
                                ?
                                <>
                                    <h1 className="titulo-descripcion col-6 mt-3">Marca:</h1>
                                    <input
                                        className="form-control col-5 w-50 descripcion mt-3"
                                        placeholder="Marca del producto" size="large"
                                        value={formValues.marca}
                                        name="marca" 
                                        onChange={handleInputChange}
                                        autoComplete = "disabled"
                                        required
                                    />
                                </>
                                :
                                <>
                                    <h1 className="titulo-descripcion col-6">Marca:</h1>
                                    <h1 className="descripcion col-6">{informacionProducto.marca}</h1>
                                </>
                            }
                            {isProductoEditing
                                ?
                                <>
                                    <h1 className="titulo-descripcion col-6 mt-3">Unidad: </h1>
                                    <select id="unidad" className="form-select mt-3 col-5 w-50 descripcion" aria-describedby="inventariableHelpBlock" value={formValues.unidad} name="unidad" onChange={handleInputChange}>
                                        <option value={"Metro"}>Metro</option>
                                        <option value={"Kilogramo"}>Kilogramo</option>
                                        <option value={"Pieza"}>Pieza</option>
                                        <option value={"Litro"}>Litro</option>
                                    </select>
                                </>
                                :
                                <>
                                    <h1 className="titulo-descripcion col-6">Unidad: </h1>
                                    <h1 className="descripcion col-6">{informacionProducto.unidad}</h1>
                                </>
                            }
                            {isProductoEditing 
                                ? 
                                <>
                                    <h1 className="titulo-descripcion col-6 mt-3">Estado del producto: </h1>
                                    <select id="estado" className="form-select col-5 mt-3 w-50 descripcion" aria-describedby="inventariableHelpBlock" value={formValues.estado} name="estado" onChange={handleInputChange}>
                                        <option value={"Nuevo"}>Nuevo</option>
                                        <option value={"Usado"}>Usado</option>
                                    </select>
                                </>
                                :
                                <>
                                <h1 className="titulo-descripcion col-6">Estado del producto: </h1>
                                    <h1 className="descripcion col-6">{informacionProducto.estado}</h1>
                                </>
                                }
                            {isProductoEditing 
                                ? 
                                    <>
                                        <h1 className="titulo-descripcion col-6 mt-3">Fecha de registro en el sistema: </h1>
                                        <h1 className="descripcion col-6 text-danger mt-3">{informacionProducto.fechaRegistro}</h1>
                                    </>
                                :
                                    <>
                                        <h1 className="titulo-descripcion col-6 ">Fecha de registro en el sistema: </h1>
                                        <h1 className="descripcion col-6 text-danger">{informacionProducto.fechaRegistro}</h1>
                                    </>
                                }
                            <p className="mt-5 nota col-12 text-center">Para mas detalles del producto comunicate a almacen...</p>
                        </div>
                    </div>
                    
                    <div className="col-lg-6 col-12 d-flex flex-column" >
                        <Divider/>
                        <h1 className="nombre-producto">Registros del producto</h1>
                        <Tabs defaultActiveKey='1' key="1" size="large">
                            <TabPane tab="Entradas del producto">
                                <EntradasProducto registros={informacionProducto.registrosEntradas} informacionProducto={informacionProducto}/>
                            </TabPane>
                            <TabPane tab="Salidas del producto" key="2">
                                <SalidasProducto registros={informacionProducto.registrosSalidas} informacionProducto={informacionProducto}/>
                            </TabPane>
                            <TabPane tab="Movimientos del producto" key="3">
                                <MovimientosProducto registros={informacionProducto.movimientos} informacionProducto={informacionProducto}/>
                            </TabPane>
                            <TabPane tab="Codigo de barras" key="4">
                                <div className="d-flex justify-content-center align-items-center">
                                    <Barcode value={informacionProducto._id}/>
                                </div>
                            </TabPane>

                        </Tabs>

                   </div>

                    {/* Descripcion del producto y sus aplicaciones*/}
                    <div className="col-lg-6 col-12 d-flex flex-column">
                        <Divider/>
                        <h1 className="nombre-producto">Descripcion del producto</h1>
                        {isProductoEditing ? <textarea class="form-control descripcion-producto" rows={5} value={formValues.descripcion} name="descripcion" onChange={handleInputChange}></textarea> : <h1 className="descripcion-producto">{informacionProducto.descripcion}</h1>}
                        <Divider/>
                        <h1 className="nombre-producto">Aplicaciones del producto</h1>
                        {isProductoEditing ? <textarea class="form-control descripcion-producto" rows={5} value={formValues.aplicaciones} name="aplicaciones" onChange={handleInputChange}></textarea> : <h1 className="descripcion-producto">{informacionProducto.aplicaciones}</h1>}
                    </div>
                 </div>
                <Modal visible={isModalVisible} footer={null} onCancel={()=> {setIsModalVisible(false)}} onOk={()=> {setIsModalVisible(false)}}>

                    <h1 className="titulo" style={{fontSize:"30px"}}>Filtrar registros del reporte</h1>
                    <p className="descripcion">Marca en las siguientes casillas que informacion quieras que contengan el reporte general del producto</p>

                    <Form form={form} layout="vertical" onFinish={crearReporteGeneral}>
                        <Form.Item name="intervaloFecha" label="Intervalo de fecha del reporte" rules={[{required: true,message: 'Ingresa un intervalo de fecha!',},]}>
                            <RangePicker locale={locale} format="YYYY-MM-DD" size="large" style={{width:"100%"}}/>
                        </Form.Item>

                        <Form.Item label="Tipo de entrada" name="tipoEntrada" rules={[{required: true,message: 'Ingresa un tipo de entrada!',},]}>
                		    <Select mode="multiple" placeholder="Tipo de entrada..." size="large">
							    <Select.Option value="sobranteObra">Sobrante de obra</Select.Option>
							    <Select.Option value="devolucionResguardo">Devolucion resguardo</Select.Option>
							    <Select.Option value="normal">Normal</Select.Option>
              		        </Select>
                        </Form.Item>

                        <Form.Item label="Tipo de salida" name="tipoSalida" rules={[{required: true,message: 'Ingresa un tipo de salida!',},]}>
                		    <Select mode="multiple" placeholder="Tipo de salida..." size="large">
							    <Select.Option value="obra">Obra</Select.Option>
							    <Select.Option value="resguardo">Resguardo</Select.Option>
							    <Select.Option value="merma">Merma</Select.Option>
              		        </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit">Descargar PDF</Button>
                    </Form>
                </Modal>
            </div>

        )
    }
};