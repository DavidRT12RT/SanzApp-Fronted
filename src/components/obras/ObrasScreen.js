import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import "./assets/styleObrasScreen.css";
import { useSelector } from 'react-redux';
import { Avatar, Button, Card, Divider, Dropdown, Form, Input, Menu, message, Modal, Statistic, Table, Tag } from 'antd';
import { fetchConToken } from '../../helpers/fetch';

const { confirm } = Modal;

export const ObrasScreen = () => {

    const { rol } = useSelector(store => store.auth);
    const [registrosObras, setRegistrosObras] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [valueSearch, setValueSearch] = useState("");
	const [isLoadingButton, setIsLoading] = useState(false);
    const [IdObra, setIdObra] = useState(null);
    const [obrasEstados, setObrasEstados] = useState({
        totalObrasActivas:0,
        totalObrasFinalizadas:0
    });
	const navigate = useNavigate();

    useEffect(() => {
        //Carga de empleados
        fetchConToken("/obras",{},"GET")
            .then(response => response.json())
            .then(resp => {
                setObrasEstados({totalObrasActivas:resp.totalObrasActivas,totalObrasFinalizadas:resp.totalObrasFinalizadas});
                setRegistrosObras(resp.obras)
            });
    }, []);

    
	const handledActivateObra = async (values) =>{
		setIsLoading(true);
		//Make http request to the server
		try {
			const resp = await fetchConToken(`/obras/${IdObra}/cambiar-estado-obra`,{correo:values.correo,password:values.password,estado:"activar"},"PUT");
			const body = await resp.json();
			if(resp.status === 200){
				//Make http request in order to known if the user is ok
				message.success(body.msg);
				navigate(`/aplicacion/obras/editor/${IdObra}`);
			}else{
				message.error(body.msg);
			}
		} catch (error) {
			message.error("Hubo un error a la hora de hacer la petición al servidor!");	
		}

		setIsLoading(false);

	}


	const renderizarBoton = (record) => {

        const { estado } = record;
        const rolesPermitidos = ["ADMIN_ROLE","INGE_ROLE"];

        //Si el usuario tiene rol podra editar y ver
		if(estado != "FINALIZADA" && rolesPermitidos.includes(rol)){
            return(
                <div className="d-flex gap-2">
                    <Button type="primary" ><Link to={`/aplicacion/obras/editor/${record._id}`}>Editar obra</Link></Button>
                    <Button type="primary" ><Link to={`/aplicacion/obras/${record._id}`}>Visor de obra</Link></Button>
                </div>
            )
        //Si el usuario NO tiene un rol solo le dejaremos ver el visor de obras
		}else if(estado === "EN-PROGRESO" && !rolesPermitidos.includes(rol)){
            return (
                <Button type="primary" ><Link to={`/aplicacion/obras/${record._id}`}>Visor de obra</Link></Button>
            )
        //Boton para volver a activar la obra
        }else if(estado === "FINALIZADA" && rol === "ADMIN_ROLE"){
            return <Button type="primary"  onClick={()=>{
                confirm({
            		title:"¿Seguro quieres volver a activar la obra?",
            		icon:<ExclamationCircleOutlined />,
            		content:"Al activarla denuevo los usuarios podran añadir información de nuevo a la obra y se marcara como en desarollo",
					okText:"Activar",
					cancelText:"Volver atras",
            		async onOk(){
						//Sacar formulario con usuario y contraseña
						setIsModalVisible(true);
                        setIdObra(record._id);
           			},
        		});
            }} loading={isLoadingButton}>Activar obra</Button>
	    }
    }

    const columns = [
        {
            title:<p className="titulo-descripcion">Numero track</p>,
            render:(text,record)=> (<p className="descripcion text-primary">{record.numeroTrack}</p>)
        },
        {
            title:<p className="titulo-descripcion">Titulo de obra</p>,
            render:(text,record)=> (<p className="descripcion">{record.titulo}</p>)
        },
        {
            title:<p className="titulo-descripcion">Fecha de creacion</p>,
            render:(text,record)=> (<p className="descripcion">{record.fechaCreacion}</p>)
        },
        {
            title:<p className="titulo-descripcion">Empresa</p>,
            render:(text,record)=> (<p className="descripcion">{record.empresa.nombre}</p>)
        },
        {
            title:<p className="titulo-descripcion">Sucursal</p>,
            render:(text,record)=> (<p className="descripcion">{record.sucursal.nombre}</p>)
        },
        {
            title:<p className="titulo-descripcion">Estado de obra</p>,
            render:(text,record)=> (<p className="descripcion">{record.estado}</p>)
        },
        {
            title:<p className="titulo-descripcion">Acciones</p>,
            dataIndex:"_id",
            render:(text,record) => {
                return renderizarBoton(record);                
            }
        }
    ]

    return (
        <div>
            <div className="hero">
                <video autoPlay loop muted plays-inline className="video-fondo">
                    <source src={require("./assets/backgroundVideo.mp4")} type="video/mp4"></source>
                </video>
                <div className="content">
                    <h1 className="titulo">Obras</h1>
                    <p className="descripcion">Registros <b>TOTALES</b> de obras en el sistema.</p>
                    <Input.Search className="descripcion barra-busqueda" placeholder="Busca una obra por su titulo" size="large" value={valueSearch} onChange={(e) => {setValueSearch(e.target.value)}} enterButton/>
                </div>
            </div>

            <div className="bg-body p-3" style={{minHeight:"100vh"}}>
                <div className="row mt-5" style={{width:"85%",margin:"0 auto"}}>
                    <div className="col-12 ">
                        <h1 className="titulo-descripcion" style={{fontSize:"20px"}}>FILTRAR POR</h1>
                        <Divider/>
                        <h1 className="titulo-descripcion" style={{fontSize:"13px"}}>Estado</h1>
                    </div>
                    <div className="col-12 mt-5">
                        <h1 className="titulo-descripcion" style={{fontSize:"20px"}}>OBRAS ENCONTRADAS</h1>
                        <Divider/>
                        <Table columns={columns} dataSource={registrosObras} bordered/>
                    </div>
                </div>
            </div>
        </div>
    )
};
