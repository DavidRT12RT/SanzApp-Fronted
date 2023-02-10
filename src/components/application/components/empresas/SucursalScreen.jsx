import { Breadcrumb, Divider, message,Input, Table,Button } from 'antd';
import React ,{ useEffect,useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchConToken } from '../../../../helpers/fetch';
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';

//Estilos CSS
import "../assets/style.css";

const { Search } = Input;

export const SucursalScreen = () => {

    const { sucursalId } = useParams();
    const [sucursalInfo, setSucursalInfo] = useState(null);
    const [obrasSucursal, setObrasSucursal] = useState(null);
    const navigate = useNavigate();
    const { uid ,rol } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchDataSucursal = async() => {
            const resp = await fetchConToken(`/sucursales/${sucursalId}`);
            const body = await resp.json();
            if(resp.status != 200) {
                message.error(body.msg);
                return navigate(-1);
            }
            //Todo salio bien
            body.obras.map(obra => obra.key = obra._id);
            setSucursalInfo(body);
            setObrasSucursal(body.obras);
        }
        fetchDataSucursal();
    }, []);


    const columns = [
        {
            title:<p className="titulo-descripcion">Titulo de la obra</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.titulo}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Fecha registro en sistema</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.fechaCreacionSistema}</p>
            }
            
        },
        {
            title:<p className="titulo-descripcion">Numero de track</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.numeroTrack}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Tipo de reporte</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.tipoReporte}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Estado de la obra</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.estado}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Ver mas detalles</p>,
            render:(text,record) => {
                return <Button type="primary"><Link to={`/aplicacion/obras/editor/${record._id}`}>Visualizador de obra</Link></Button>
            }
        }
    ];
    
    if(sucursalInfo === null){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-5" style={{minHeight:"100vh"}}>
                <Breadcrumb>
                    {/* El ultimo breadcrumb sera el activo*/}
                    <Breadcrumb.Item><Link to={`/aplicacion/empresas/${sucursalInfo.empresa._id}`}>{sucursalInfo.empresa.nombre}</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{sucursalInfo.nombre}</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="titulo">{sucursalInfo.nombre}</h1>
                <Divider/>
                <h1 className="titulo">Informacion sucursal</h1>
                <div className="row">
                    <h1 className="titulo-descripcion col-6">Numero sucursal:</h1>
                    <h1 className="descripcion col-6">{sucursalInfo.numero}</h1>
                    <h1 className="titulo-descripcion col-6">Obras registradas:</h1>
                    <h1 className="descripcion col-6">{sucursalInfo.obras.length}</h1>
                    <h1 className="titulo-descripcion col-6">Calle:</h1>
                    <h1 className="descripcion col-6">{sucursalInfo.calle}</h1>
                    <h1 className="titulo-descripcion col-6">Colonia:</h1>
                    <h1 className="descripcion col-6">{sucursalInfo.colonia}</h1>
                    <h1 className="titulo-descripcion col-6">C.P:</h1>
                    <h1 className="descripcion col-6">{sucursalInfo.CP}</h1>
                    <h1 className="titulo-descripcion col-6">Población o Delegación:</h1>
                    <h1 className="descripcion col-6">{sucursalInfo.delegacion}</h1>
                    <h1 className="titulo-descripcion col-6">Estado:</h1>
                    <h1 className="descripcion col-6">{sucursalInfo.estado}</h1>
                    <h1 className="titulo-descripcion col-6">Registrada por:</h1>
                    <h1 className="descripcion col-6">{sucursalInfo.usuarioRegistrador.nombre}</h1>
                    <h1 className="titulo-descripcion col-6">Fecha de registro:</h1>
                    <h1 className="descripcion col-6 text-success">{sucursalInfo.fechaRegistro}</h1>
                </div>
                <Divider/>
                <h1 className="titulo">Lista de obras</h1>
                <div className="d-flex justify-content-start align-items-center gap-2 flex-wrap">
                    <Button type="primary">Filtrar obras</Button>
                    {rol === "INGE_ROLE" || rol === "ADMIN_ROLE" && <Link to={`/aplicacion/obras/registrar?empresa=${sucursalInfo.empresa._id}&sucursal=${sucursalInfo._id}`}><Button type="primary" danger>Registrar obra</Button></Link>}
                </div>
               <Search
                    placeholder="Buscar una obra por su titulo"
                    allowClear
                    enterButton="Buscar" 
                    size="large"
                    className="mt-3"
                />
                <Table bordered className="mt-3" columns={columns} dataSource={obrasSucursal}/>
            </div>
        )
    }
}
