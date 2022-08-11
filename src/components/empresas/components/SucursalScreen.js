import { Breadcrumb, Divider, message,Input, Table,Button } from 'antd';
import React ,{ useEffect,useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchConToken } from '../../../helpers/fetch';
import { SanzSpinner } from '../../../helpers/spinner/SanzSpinner';
import "../assets/style.css";
const { Search } = Input;

export const SucursalScreen = () => {

    const { sucursalId } = useParams();
    const [sucursalInfo, setSucursalInfo] = useState(null);
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
            setSucursalInfo(body);
        }
        fetchDataSucursal();
    }, []);

    useEffect(() => {
        if(sucursalInfo != null) getCoordinates(sucursalInfo.calle+sucursalInfo.colonia);
    }, [sucursalInfo]);
    

    function getCoordinates(address){
        fetch("https://maps.googleapis.com/maps/api/geocode/json?address="+address)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const latitude = data.results.geometry.location.lat;
                const longitude = data.results.geometry.location.lng;
                console.log({latitude, longitude})
            })
    }


    const columns = [
        {
            title:<p className="titulo-descripcion">Titulo de la obra</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.numero}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Direccion regional</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.nombre}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Plaza</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.calle}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Tipo de reporte</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.colonia}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Numero de track</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.CP}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Estado de la obra</p>,
            render:(text,record) => {
                return <p className="descripcion">{record.delegacion}</p>
            }
        },
        {
            title:<p className="titulo-descripcion">Ver mas detalles</p>,
        }
    ];
    
    if(sucursalInfo === null){
        return <SanzSpinner/>
    }else{
        return (
            <div className="container p-5" style={{minHeight:"100vh"}}>
                <Breadcrumb>
                    <Breadcrumb.Item><Link to={`/aplicacion/empresas/${sucursalInfo.empresa._id}`}>{sucursalInfo.empresa.nombre}</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>{sucursalInfo.nombre}</Breadcrumb.Item>
                </Breadcrumb>
                <h1 className="titulo">{sucursalInfo.nombre}</h1>
                <Divider/>
                <h1 className="titulo">Informacion sucursal</h1>
                <div className="row">
                    <h1 className="titulo-descripcion col-6">Numero sucursal:</h1>
                    <h1 className="descripcion col-6">{sucursalInfo.numero}</h1>
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
                    {rol === "INGE_ROLE" || rol === "ADMIN_ROLE" && <Button type="primary" danger>Registrar obra</Button>}
                </div>
               <Search
                    placeholder="Buscar una obra por su titulo"
                    allowClear
                    enterButton="Buscar" 
                    size="large"
                    className="mt-3"
                />
                <Table bordered className="mt-3" columns={columns}/>
            </div>
        )
    }
}
