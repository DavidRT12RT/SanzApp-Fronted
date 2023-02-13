import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Modal, Form, message } from 'antd';

//Icon's
import { ExclamationCircleOutlined } from "@ant-design/icons";

//Helper's
import { fetchConToken, fetchConTokenSinJSON } from "../helpers/fetch";

const { confirm } = Modal;

export const useEmpresa = () => {
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
            title:<p className="titulo-descripcion">Obras</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.obras.length}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Detalles</p>,
            render:(text,record) => {
                return <Link target={"_blank"} to={`/aplicacion/empresas/${record.empresa}/sucursales/${record._id}`} className="descripcion text-primary">Ver detalles</Link>
            }
        }
    ];


    const [searchParams, setSearchParams] = useSearchParams();
    const { search } = useLocation();
    const { empresaId } = useParams();
    const [form] = Form.useForm();
    const { uid ,rol } = useSelector(store => store.auth);
    const navigate = useNavigate();

    const initialState = {
        empresaInfo:null,
        sucursales:[],
        isModalRegistrarSucursalVisible:false,
        parametrosBusqueda:{},
        isEditing:false,
        formValues:null,
        filesList:[]
    };

    const [values,setValues] = useState(initialState);

    const handleInputChange = ({target}) => {
        setValues({
            ...values,
            formValues:{
                ...values.formValues,
                [target.name]:target.value
            }
        });
    }

    useEffect(() => {
        //Hacer una peticion a el servidor de obras y pasarle el parametro de busqueda
        let query = {};
        for(const property in values.parametrosBusqueda){
            query = {...query,[property]:values.parametrosBusqueda[property]}
        }
        setSearchParams(query);

    }, [values.parametrosBusqueda]);

    useEffect(() => {
        const fetchDataEmpresa = async() => {
            const resp = await fetchConToken(`/empresas/${empresaId}/${search}`);
            const body = await resp.json();
            if(resp.status !== 200) {
                message.error(body.msg);
                return navigate(-1);
            }
            //Todo salio bien y seteamos la informacion de la empresa
            setValues({
                ...values,
                empresaInfo:body,
                formValues:body
            });
        }
        fetchDataEmpresa();
    }, [search]);

    useEffect(() => {
        if(values.empresaInfo !== null){
            const sucursales = values.empresaInfo.sucursales.map(sucursal => {
                    sucursal.key = sucursal._id
                    return sucursal;
            });
            setValues({
                ...values,
                sucursales,
                formValues:{
                    nombre:values.empresaInfo.nombre,
                    descripcion:values.empresaInfo.descripcion
                }
            });
        }
    }, [values.empresaInfo]);
 

    const setIsModalRegistrarSucursalVisible = (estado = false) => {
        setValues({
            ...values,
            isModalRegistrarSucursalVisible:estado
        });
    }

    const setParametrosBusqueda = (propiedad,values) => {
        setValues({
            ...values,
            parametrosBusqueda:{
                ...values.parametrosBusqueda,
                [propiedad]:values
            }
        });
    }

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
                setValues({
                    ...values,
                    sucursales:[...values.sucursales,body.sucursal],
                    isModalRegistrarSucursalVisible:false
                });
            }
        });
    }

    const setEditInfo = (estado = false) => {
        setValues({...values,isEditing:estado});
    }

    const props = {
        onRemove: (file) => {
            setValues({...values,filesList:[]});
        },
        beforeUpload: (file) => {
            if (values.filesList.length < 1) setValues({...values,filesList:[file]});
            else message.error("Solo puedes subir 1 archivo en total");
            return false;
        },
        maxCount: 1,
        fileList: values.filesList,
    };

    const onFinishEditingEmpresa = () => {

        confirm({
            title: "¿Seguro quieres editar la informacion de la empresa?",
            icon: <ExclamationCircleOutlined />,
            content:
                "La informacion de la empresa se vera cambiada y NO habra forma de restablecerla",
            okText: "Editar",
            cancelText: "Volver atras",
            async onOk() {
                const formData = new FormData();

                for (const property in values.formValues) {
                    formData.append(property, values.formValues[property]);
                } 

                values.filesList.forEach((file) => {formData.append("archivo", file)});

                const resp = await fetchConTokenSinJSON(
                    `/empresas/${empresaId}`,
                    formData,
                    "PUT"
                );
                const body = await resp.json();

                if(resp.status !== 200) return message.error(body.msg);

                //Todo salio bien 
                message.success(body.msg);
                setValues({...values,isEditing:false});
                //TODO: Mandar por socket que se actualizo la empresa
 
            }
        });

    }

    return {
        columns,
        values,
        rol,
        props,
        handleInputChange,
        registrarSucursal,
        setIsModalRegistrarSucursalVisible,
        setParametrosBusqueda,
        setEditInfo,
        onFinishEditingEmpresa
    };
}