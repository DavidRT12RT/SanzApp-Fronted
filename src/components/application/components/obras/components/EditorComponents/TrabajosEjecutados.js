import { Button, Modal, Form, Input, Divider, Select, Dropdown, Menu, message, DatePicker, Table, Drawer, Checkbox, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { DownOutlined, ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import locale from "antd/es/date-picker/locale/es_ES"
import { fetchConToken, fetchConTokenSinJSON } from '../../../../../../helpers/fetch';
const { confirm } = Modal;


export const TrabajosEjecutados = ({obraInfo,socket}) => {
    const [listaTrabajos, setListaTrabajos] = useState([]);
    //Formulario editar y registro de un trabajo 
    const [evidencia, setEvidencia] = useState(false);
    const [filesListAntes, setFilesListAntes] = useState([]);
    const [filesListDespues, setFilesListDespues] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState({estado:false,tipo:null,trabajo:null});
    const [isDrawerVisible, setIsDrawerVisible] = useState({estado:false,trabajo:null});
    const [empleadosObra, setEmpleadosObra] = useState([]);
    const [form] = Form.useForm();
    const obraId = obraInfo._id;

    const propsAntes = {
        multiple:true,
        onRemove : file => {
            const newFiles = filesListAntes.filter(fileOnState => fileOnState.name != file.name);
            setFilesListAntes(newFiles);
        },
        beforeUpload: file => {
            const extensionesDisponibles = ["image/png","image/jpeg","image/jpg"];
            if(!extensionesDisponibles.includes(file.type)) return message.error("Tipo de archivo NO permitido para esta funcion");
            setFilesListAntes(files => [...files,file]);
            return false;
        },
        listType:"picture",
        fileList : filesListAntes
    };

    const propsDespues = {
        multiple:true,
        onRemove : file => {
            const newFiles = filesListDespues.filter(fileOnState => fileOnState.name != file.name);
            setFilesListDespues(newFiles);
        },
        beforeUpload: file => {
            const extensionesDisponibles = ["image/png","image/jpeg","image/jpg"];
            if(!extensionesDisponibles.includes(file.type)) return message.error("Tipo de archivo NO permitido para esta funcion");
            setFilesListDespues(files => [...files,file]);
            return false;
        },
        listType:"picture",
        fileList : filesListDespues
    };

    useEffect(() => {
        socket.emit("obtener-trabajadores-en-obra-por-id",{obraId},(empleados)=>{
            empleados.map(empleado => empleado.key = empleado.id.uid);
            setEmpleadosObra(empleados);
        });

        obraInfo.trabajosEjecutados.map(trabajo => trabajo.key = trabajo._id)
        setListaTrabajos(obraInfo.trabajosEjecutados);

    }, [obraInfo]);


    useEffect(() => {
        if(isModalVisible.tipo === "editar") return form.setFieldsValue({titulo:isModalVisible.trabajo.titulo,descripcion:isModalVisible.trabajo.descripcion,trabajador:isModalVisible.trabajo.trabajador.uid});
    }, [isModalVisible]);
    

    const agregarTrabajo = async(values) => {
        confirm({
            title:"Seguro quieres agregar este registro de trabajo u accion a la obra",
            icon:<ExclamationCircleOutlined />,
            content:"La accion sera registrada dentro de la obra y se asociara al trabajador que la realizo",
			okText:"Registrar",
			cancelText:"Volver atras",
            async onOk(){
                values.obraId = obraId;
                values.fecha = moment(values.fecha).format("YYYY-MM-DD");
                /*
                socket.emit("añadir-trabajo-a-obra",values,(confirmacion) => {
                    if(!confirmacion.ok) return message.error(confirmacion.msg);
                    //Trabajo anadido con exito!
                    message.success(confirmacion.msg);
                    setIsModalVisible({estado:false,tipo:null});
                });
                */
                const formData = new FormData();
                for (const property in values) formData.append(property,values[property]);
                //El trabajo se agregara con evidencia
                if(evidencia) {
                    for(let i=0; i < filesListAntes.length; i++){
                        const elemento = filesListAntes[i];
                        formData.append(`antesEvidencia ${i}`,elemento);
                    }

                    for(let i=0; i < filesListDespues.length; i++){
                        const elemento = filesListDespues[i];
                        formData.append(`despuesEvidencia ${i}`,elemento);
                    }
 
                }
                const resp = await fetchConTokenSinJSON(`/obras/${obraId}/agregar-trabajo-a-obra`,formData,"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Trabajo agregado con exito a la obra
                message.success(body.msg);
                form.resetFields();
                setFilesListAntes([]);
                setEvidencia(false);
                setFilesListDespues([]);
                setIsModalVisible(false);
                socket.emit("actualizar-obra-por-id",obraId);
            }
        });
    }

    const editarTrabajo = async (values) =>{
        confirm({
            title:"Seguro quieres editar el trabajo registrado en la obra?",
            icon:<ExclamationCircleOutlined />,
            content:"El trabajo realizado sera editado",
			okText:"Editar",
			cancelText:"Volver atras",
            async onOk(){
                values.obraId = obraId;
                values.fecha = moment(values.fecha).format("YYYY-MM-DD");
                values._id = isModalVisible.trabajo._id; //Asignando el id del trabajo para poder remplazarlo en la base de datos
                /*
                socket.emit("editar-trabajo-en-obra",values,(confirmacion) => {
                    if(!confirmacion.ok) return message.error(confirmacion.msg);
                    message.success(confirmacion.msg);
                    setIsModalVisible({estado:false,tipo:null});
                });
                */
                const formData = new FormData();
                for (const property in values) formData.append(property,values[property]);

                //Se editara la evidencia
                if(evidencia) {
                    for(let i=0; i < filesListAntes.length; i++){
                        const elemento = filesListAntes[i];
                        formData.append(`antesEvidencia ${i}`,elemento);
                    }

                    for(let i=0; i < filesListDespues.length; i++){
                        const elemento = filesListDespues[i];
                        formData.append(`despuesEvidencia ${i}`,elemento);
                    }
                }

                const resp = await fetchConTokenSinJSON(`/obras/${obraId}/editar-trabajo-en-obra`,formData,"PUT");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);
                //Registro del trabajo editado con exito!
                message.success(body.msg);
                setIsModalVisible(false);
                form.resetFields();
                setFilesListAntes([]);
                setFilesListDespues([]);
                setEvidencia(false);
                socket.emit("actualizar-obra-por-id",obraId);
            }
        })
    }

    const eliminarTrabajo = (values) => {
        confirm({
            title:"Seguro quieres ELIMINAR el trabajo registrado en la obra?",
            icon:<ExclamationCircleOutlined />,
            content:"El trabajo realizado sera eliminado de los registros de la obra",
			okText:"Eliminar",
			cancelText:"Volver atras",
            async onOk(){
                values.obraId = obraId;
                /*
                socket.emit("eliminar-trabajo-en-obra",values,(confirmacion) => {
                    if(!confirmacion.ok) return message.error(confirmacion.msg);
                    message.success(confirmacion.msg);
                });
                */
                const resp = await fetchConToken(`/obras/${obraId}/eliminar-trabajo-en-obra`,values,"DELETE");
                const body = await resp.json();
                if(resp.status != 200) return message.error(body.msg);
                //Trabajo eliminando
                message.success(body.msg);
                socket.emit("actualizar-obra-por-id",obraId);
            }
        })
    }

    const handleSearch = (value) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0) return setListaTrabajos(obraInfo.trabajosEjecutados);

        const resultadosBusqueda = obraInfo.trabajosEjecutados.filter((elemento)=>{
            if(elemento.titulo.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setListaTrabajos(resultadosBusqueda);
    }

    const handleFilter = ({key}) =>{
        if(key === "Limpiar") return setListaTrabajos(obraInfo.trabajosEjecutados);

        const resultadosBusqueda = obraInfo.trabajosEjecutados.filter(trabajo => {
            if(trabajo.trabajador.uid === key) return trabajo;
        })
        return setListaTrabajos(resultadosBusqueda);
    }

    const menu = (
        <Menu onClick={handleFilter}>
            {
                empleadosObra.map(empleado => {
                    return <Menu.Item key={empleado.id.uid}>{empleado.id.nombre}</Menu.Item>
                })
            }
            <Menu.Divider></Menu.Divider>
            <Menu.Item key="Limpiar">Limpiar filtros</Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title:<p className="titulo-descripcion">Titulo del trabajo</p>,
            render:(text,record) => (<p className="descripcion">{record.titulo}</p>)
        },
        {
            title:<p className="titulo-descripcion">Trabajador</p>,
            render:(text,record) => {
                return (
                    <div className="d-flex justify-content-center align-items-center flex-wrap gap-2">
                        <img src={`http://localhost:4000/api/uploads/usuarios/${record.trabajador.uid}`} width="60" height="60" style={{objectFit:"contain",borderRadius:"40px"}}/>
                        <p className="descripcion">{record.trabajador.nombre}</p>
                    </div>
                )
            }
        },
        {
            title:<p className="titulo-descripcion">Fecha del trabajo</p>,
            render:(text,record) => (<p className="descripcion">{record.fecha}</p>)
        },
        {
            title:<p className="titulo-descripcion">Acciones</p>,
            render:(text,record) => (
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <Button type="primary" onClick={() => {setIsModalVisible({estado:true,tipo:"editar",trabajo:record})}}>Editar</Button>
                    <Button danger type="primary" onClick={() => {eliminarTrabajo(record)}}>Borrar trabajo</Button>
                </div>
            )
        },
        {
            title:<p className="titulo-descripcion">Ver evidencia</p>,
            render:(text,record) => (<p className="descripcion text-primary" onClick={()=>{setIsDrawerVisible({estado:true,trabajo:record})}}>Ver mas detalles</p>)
        },
    ];

    return (
        <div className="container p-3 p-lg-5" style={{minHeight:"100vh"}}>
            <div className="d-flex justify-content-end align-items-center gap-2">
                <Button type="primary">Descargar resumen</Button>
            </div>
            <h1 className="titulo">Trabajos ejecutados</h1>
            <p className="descripcion">Seccion para anadir trabajos o tareas que hayan cumplido los trabajadores de la obra y asi poder tener un historial de acciones en esta misma.</p>
            <Divider/>
            <Input.Search 
                size="large" 
                placeholder="Buscar un trabajo realizado por el titulo del trabajo..." 
                onChange={(e) => {handleSearch(e.target.value)}}
            />
            <div className="d-flex align-items-center gap-2 flex-wrap">
                <Dropdown overlay={menu}>
                    <Button type="primary" danger>
                        Filtrar trabajo por trabajador:
                        <DownOutlined />
                    </Button>
                </Dropdown>
                <Button type="primary" style={{marginBottom: 16,}} onClick={()=>{setIsModalVisible({estado:true,tipo:"registrar"})}} className="mt-3"> Añadir trabajo </Button>
            </div>

            <Table columns={columns} dataSource={listaTrabajos} bordered/>


            <Modal footer={null} visible={(isModalVisible.estado)} onOk={()=>{setIsModalVisible({estado:false,tipo:null})}} onCancel={()=>{setIsModalVisible({estado:false,tipo:null})}}>
                {isModalVisible.tipo === "registrar" ? <h1 className="titulo">Registrar un trabajo</h1> : <h1 className="titulo">Editar trabajo</h1>}
                <Form form={form} layout="vertical" onFinish={(e)=> {isModalVisible.tipo === "registrar" ? agregarTrabajo(e) : editarTrabajo(e)}}>
                    <Form.Item label="Titulo del trabajo realizado" name="titulo" rules={[{ required: true, message: 'Introduce el titulo del trabajo realizado!' }]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Titulo del trabajo realizado" name="descripcion" rules={[{ required: true, message: 'Introduce la descripcion del trabajo realizado!' }]}>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item label="Fecha del trabajo" name="fecha" rules={[{ required: true, message: 'Introduce la descripcion del trabajo realizado!' }]}>
                        <DatePicker locale={locale} style={{width:"100%"}}/>
                    </Form.Item>
                    <Form.Item label="Usuario que realizo el trabajo" name="trabajador" rules={[{ required: true, message: 'Introduce el trabajo que realizo el trabajo!' }]}>
                        <Select>
                            {empleadosObra.map(empleado => {
                                return <Select.Option key={empleado.id.uid} value={empleado.id.uid}>{empleado.id.nombre}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Checkbox checked={evidencia} onChange={(e)=>{setEvidencia(e.target.checked)}} style={{width:"100%"}}>{isModalVisible.tipo === "registrar" ? "Adjuntar evidencia del trabajo" : "Editar evidencia del trabajo"}</Checkbox>
                    {isModalVisible.tipo === "editar" && <span className="text-muted">(TEN EN CUENTA QUE AL MOMENTO DE EDITAR LA EVIDENCIA ANTERIOR HARA QUE ESTA SEA ELIMINADA Y REEMPLAZADA POR LA NUEVA)</span>}
                    {evidencia && (
                        <div className="mt-3">
                            <Form.Item label="Fotos del antes">
                                <Upload {...propsAntes}>
                                    <Button icon={<UploadOutlined/>}>Selecciona el archivo o archivos</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item label="Fotos del despues">
                                <Upload {...propsDespues}>
                                    <Button icon={<UploadOutlined/>}>Selecciona el archivo o archivos</Button>
                                </Upload>
                            </Form.Item>
                        </div>
                   )}
                    <Button type="primary" htmlType="submit" className="mt-3">{isModalVisible.tipo === "registrar" ? "Registrar trabajo" : "Editar trabajo"}</Button>
                </Form>
            </Modal>
            {isDrawerVisible.estado && (
                <Drawer placement="right" width={"40%"} onClose={()=>{setIsDrawerVisible(false)}} visible={isDrawerVisible.estado}>
                    <h1 className="titulo-descripcion" style={{fontSize:"30px"}}>{isDrawerVisible.trabajo.titulo}</h1>
                    <h1 className="titulo" style={{fontSize:"20px"}}>Informacion detallada del registro</h1>
                    <Divider/>
                    <h1 className="titulo-descripcion col-6 mt-3">Descripcion del trabajo: </h1>
                    <p className="descripcion">{isDrawerVisible.trabajo.descripcion}</p>
                    <h1 className="titulo-descripcion col-6 mt-3">Trabajo realizado por: </h1>
                    <h1 className="descripcion col-6 text-danger mt-3">{isDrawerVisible.trabajo.trabajador.nombre}</h1>
                    <h1 className="titulo-descripcion col-6 mt-3">Fecha del trabajo: </h1>
                    <p className="descripcion text-success">{isDrawerVisible.trabajo.fecha}</p>
                    <h1 className="titulo" style={{fontSize:"20px"}}>Evidencia del trabajo</h1>
                    <Divider/>
                    {isDrawerVisible.trabajo.evidencia.antes.length > 0 
                        ? (
                           <>

                                <h1 className="titulo-descripcion">Antes</h1>
                                <div id="carouselAntes" class="carousel slide" data-bs-ride="carousel" width={"50%"} height={"30%"}>
                                    <div class="carousel-inner">
                                        {isDrawerVisible.trabajo.evidencia.antes.map((nombreArchivo,index)=>{
                                            return index === 0 
                                            ? 
                                            <div class="carousel-item active" key={nombreArchivo}>
                                                <img src={`http://localhost:4000/api/uploads/obras/obra/${obraId}/trabajos/${nombreArchivo}`} class="d-block w-100" alt="..."  style={{objectFit:"cover"}}/>
                                            </div>
                                            :
                                            <div class="carousel-item" key={nombreArchivo}>
                                                <img src={`http://localhost:4000/api/uploads/obras/obra/${obraId}/trabajos/${nombreArchivo}`} class="d-block w-100" alt="..."style={{objectFit:"cover"}}/>
                                            </div>
                                        })}
                                    </div>
                                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselAntes" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Previous</span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#carouselAntes" data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Next</span>
                                    </button>
                                </div>

                                <Divider/>
                                <h1 className="titulo-descripcion">Despues</h1>

                                <div id="carouselDespues" class="carousel slide" data-bs-ride="carousel" width={"50%"} height={"30%"}>
                                    <div class="carousel-inner">
                                        {isDrawerVisible.trabajo.evidencia.despues.map((nombreArchivo,index)=>{
                                            return index === 0 
                                            ? 
                                            <div class="carousel-item active" key={nombreArchivo}>
                                                <img src={`http://localhost:4000/api/uploads/obras/obra/${obraId}/trabajos/${nombreArchivo}`} class="d-block w-100" alt="..." style={{objectFit:"cover"}}/>
                                            </div>
                                            :
                                            <div class="carousel-item" key={nombreArchivo}>
                                                <img src={`http://localhost:4000/api/uploads/obras/obra/${obraId}/trabajos/${nombreArchivo}`} class="d-block w-100" alt="..." style={{objectFit:"cover"}}/>
                                            </div>
                                        })}
                                    </div>
                                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselDespues" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Previous</span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#carouselDespues" data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">Next</span>
                                    </button>
                                </div>

                           </>
                        )
                        : <p className="descripcion text-danger">Ninguna evidencia agregada</p>
                    }
                </Drawer>
            )}
       </div>
    )
}