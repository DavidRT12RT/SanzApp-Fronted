import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { fetchConToken } from '../../../helpers/fetch'
import { Divider, message, Table,Input, Button, Modal, Form, Select, InputNumber } from 'antd';
import { ExclamationCircleOutlined,UploadOutlined } from '@ant-design/icons';
import { SanzSpinner } from '../../../helpers/spinner/SanzSpinner';
import "../assets/style.css";
import { useSelector } from 'react-redux';
const { Search } = Input;
const { confirm } = Modal;


export const EmpresaScreen = () => {
    const { empresaId } = useParams();
    const [form] = Form.useForm();
    const { uid ,rol } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [empresaInfo, setEmpresaInfo] = useState(null);
    const [sucursales, setSucursales] = useState([]);
    const [isModalRegistrarSucursalVisible, setIsModalRegistrarSucursalVisible] = useState(false);

    //Buscar sucursales
    const [parametrosBusqueda, setParametrosBusqueda] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const { search } = useLocation();

    useEffect(() => {
        //Hacer una peticion a el servidor de obras y pasarle el parametro de busqueda
        let query = {};
        for(const property in parametrosBusqueda){
            query = {...query,[property]:parametrosBusqueda[property]}
        }
        setSearchParams(query);

    }, [parametrosBusqueda]);

    useEffect(() => {
        const fetchDataEmpresa = async() => {
            const resp = await fetchConToken(`/empresas/${empresaId}/${search}`);
            const body = await resp.json();
            if(resp.status !== 200) {
                message.error(body.msg);
                return navigate(-1);
            }
            //Todo salio bien y seteamos la informacion de la empresa
            setEmpresaInfo(body);
        }
        fetchDataEmpresa();
    }, [search]);

    useEffect(() => {
        if(empresaInfo != null){
            empresaInfo.sucursales.map(sucursal => sucursal.key = sucursal._id);
            setSucursales(empresaInfo.sucursales);
        }
    }, [empresaInfo]);
    

    const registrarSucursal = (values) => {
        confirm({
            title:"¿Seguro quieres registrar una nueva sucursal en la empresa?",
            icon:<ExclamationCircleOutlined />,
            content:"La sucursal sera creada dentro de la empresa y se podran anadir obras a esta misma.",
			okText:"Registrar",
			cancelText:"Volver atras",
            async onOk(){
                const resp = await fetchConToken("/sucursales",{...values,usuarioRegistrador:uid,empresa:empresaId},"POST");
                const body = await resp.json();
                if(resp.status != 201) return message.error(body.msg);
                //Todo salio bien , surcusal creada con exito!
                message.success(body.msg);
                form.resetFields();
                //Agregando la sucursal creada en el estado de empresa en el apartado de sucursales
                setEmpresaInfo({...empresaInfo,sucursales:[...empresaInfo.sucursales,body.sucursal]});
                setIsModalRegistrarSucursalVisible(false);
            }
        });
    }

    const columns = [
        {
            title:<p className="titulo-descripcion">Nro. de sucursal</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.numero}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Nombre sucursal</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.nombre}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Calle</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.calle}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Colonia</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.colonia}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">C.P.</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.CP}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Población o Delegación</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.delegacion}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Estado</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.estado}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Obras registradas</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.obras.length}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Ver mas detalles</p>,
            render:(text,record) => {
                return <Link to={`/aplicacion/empresas/${empresaId}/sucursales/${record._id}`} className="descripcion text-primary">Ver detalles</Link>
            }
        }
    ];
    
    if(empresaInfo === null){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-5">
                <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap">
                    <div>
                        <h1 className="titulo" style={{fontSize:"32px"}}>{empresaInfo.nombre}</h1>
                        <h1 className="descripcion col-6">{empresaInfo._id}</h1>
                    </div>
                    <img src={`${process.env.REACT_APP_BACKEND_URL}/api/uploads/empresas/empresa/${empresaInfo._id}`} style={{height:"50px"}}/>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <h1 className="titulo">Descripcion:</h1>
                        <p className="descripcion">{empresaInfo.descripcion}</p>
                    </div>
                    <div className="col-12 col-lg-6">
                        <Divider/>
                        <h1 className="titulo">Informacion empresa:</h1>
                        <div className="row">
                            <h1 className="titulo-descripcion col-6">Fecha registro:</h1>
                            <h1 className="descripcion col-6 text-success">{empresaInfo.fechaRegistro}</h1>
                            <h1 className="titulo-descripcion col-6">Numero de sucursales registradas:</h1>
                            <h1 className="descripcion col-6">{empresaInfo.sucursales.length}</h1>
                            <h1 className="titulo-descripcion col-6">Numero de obras registradas:</h1>
                            <h1 className="descripcion col-6">{empresaInfo.obras.length}</h1>
                        </div> 
                    </div>
                </div>
                <Divider/>
                <h1 className="titulo">Sucursales</h1>
                <div className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
                    <Button type="primary">Filtrar sucursales</Button>
                    {rol === "INGE_ROLE" || rol === "ADMIN_ROLE" && <Button type="primary" danger onClick={()=>{setIsModalRegistrarSucursalVisible(true)}}>Registrar sucursal</Button>}
                </div>
               <Search
                    placeholder="Buscar un producto en almacen por codigo de barras"
                    allowClear
                    enterButton="Buscar" 
                    size="large"
                    className="mt-3"
                    onSearch={(e) => {
                        setParametrosBusqueda((parametrosAnteriores) => ({
                            ...parametrosAnteriores,
                            nombre:e
                        }));
                    }}
                />
                <Table bordered className="mt-3" columns={columns} dataSource={sucursales}/>

                <Modal visible={isModalRegistrarSucursalVisible} onOk={()=>{setIsModalRegistrarSucursalVisible(false)}} onCancel={()=>{setIsModalRegistrarSucursalVisible(false)}} footer={null}>
                    <h1 className="titulo">Registrar sucursal</h1>
                    <p className="descripcion">Registraras una sucursal y esta se asociara a la empresa {empresaInfo.nombre}.</p>
                    <Form layout="vertical" onFinish={registrarSucursal} form={form}>

                        <Form.Item label="Nombre" name="nombre" rules={[{required:"true",message:"El nombre de la sucursal es requerido!"}]}>
                            <Input/>
                        </Form.Item>

                        <Form.Item label="Calle" name="calle" rules={[{required:"true",message:"La calle de la sucursal es requerido!"}]}>
                            <Input/>
                        </Form.Item>

                        <Form.Item label="Colonia" name="colonia" rules={[{required:"true",message:"La colonia es requerida!"}]}>
                            <Input/>
                        </Form.Item>

                        <Form.Item label="C.P" name="CP" rules={[{required:"true",message:"El CP es requerido!"}]}>
                  			<InputNumber min={1} style={{width:"100%"}}/>
                        </Form.Item>

                        <Form.Item label="Poblacion o delegacion" name="delegacion" rules={[{required:"true",message:"La delegacion es requerida!"}]}>
                            <Input/>
                        </Form.Item>

                        <Form.Item label="Estado" name="estado" rules={[{required:"true",message:"El estado es requerido!"}]}>
                            <Input/>
                        </Form.Item>

                        <Form.Item label="Tipo de sucursal" name="tipo" rules={[{required:"true",message:"El tipo es requerido!"}]}>
                            <Select>
                                <Select.Option value="CAJERO">Cajero</Select.Option>
                                <Select.Option value="SUCURSAL">Sucursal</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Numero sucursal" name="numero" rules={[{required:"true",message:"El tipo es requerido!"}]}>
                  			<InputNumber min={1} style={{width:"100%"}}/>
                        </Form.Item>


                        <Button type="primary" htmlType="submit">Registrar</Button>
                    </Form>
                </Modal>
            </div>
        )
    }
}
