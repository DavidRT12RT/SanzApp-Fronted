import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Modal, Form, message } from 'antd';

//Icon's
import { ExclamationCircleOutlined } from "@ant-design/icons";

//Helper's
import { fetchConToken } from "../helpers/fetch";

const { confirm } = Modal;

export const useEmpresa = () => {
    //Buscar sucursales
    const [parametrosBusqueda, setParametrosBusqueda] = useState({});
    const [searchParams, setSearchParams] = useSearchParams();
    const { search } = useLocation();
    const { empresaId } = useParams();
    const [form] = Form.useForm();
    const { uid ,rol } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [empresaInfo, setEmpresaInfo] = useState(null);
    const [sucursales, setSucursales] = useState([]);
    const [isModalRegistrarSucursalVisible, setIsModalRegistrarSucursalVisible] = useState(false);


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
                return <Link to={`/aplicacion/empresas/${record.empresa._id}/sucursales/${record._id}`} className="descripcion text-primary">Ver detalles</Link>
            }
        }
    ];

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

    return {
        columns,
        empresaInfo,
        rol,
        registrarSucursal,
    };
}