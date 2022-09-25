import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import "./assets/styleObrasScreen.css";
import { useSelector } from 'react-redux';
import { Button, Checkbox, Divider, Dropdown, Form, Input, Menu, message, Modal, Statistic, Table, Tag } from 'antd';
import { fetchConToken } from '../../helpers/fetch';
import { useObras } from '../../hooks/useObras';
import { SanzSpinner } from '../../helpers/spinner/SanzSpinner';
import { useEmpresas } from '../../hooks/useEmpresas';

const { confirm } = Modal;

export const ObrasScreen = () => {

    const { rol } = useSelector(store => store.auth);
    const [registrosObras, setRegistrosObras] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [parametrosBusqueda, setParametrosBusqueda] = useState({});
	const [isLoadingButton, setIsLoading] = useState(false);
    const [IdObra, setIdObra] = useState(null);
	const navigate = useNavigate();
    const { isLoading:isLoadingObras ,obras,setObras} = useObras();
    const { isLoading:isLoadingEmpresas, empresas } = useEmpresas();
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
        const fetchData = async () => {
            const resp = await fetchConToken(`/obras/${search}`);
            /* 
                Al parecer para obtener todos los valors de la query
                podemos usar useLocation pero para obtener solo uno 
                es mejor el searchParams.get(nombreParametro)
            */
            const body = await resp.json();
            if(resp.status != 200) return message.error(body.msg);  
            //Busqueda con exito!
            setObras(body.obras);
        }
        fetchData();
    }, [search]);
    

    
    useEffect(() => {
        obras.map(obra => obra.key = obra._id);
        setRegistrosObras(obras);
    }, [obras]);

    const onSearchObraTitulo = async(valueSearch) => {
        if(valueSearch.length === 0) return setRegistrosObras(obras);

        const resultadosBusqueda = obras.filter(obra => {
            if(obra.titulo.toLowerCase().includes(valueSearch.toLowerCase())) return obra;
        })
        setRegistrosObras(resultadosBusqueda)
    }

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
            render:(text,record)=> (<Link className="descripcion" to={`/aplicacion/empresas/${record.empresa._id}`}>{record.empresa.nombre}</Link>)
        },
        {
            title:<p className="titulo-descripcion">Sucursal</p>,
            render:(text,record)=> (<Link className="descripcion" to={`/aplicacion/empresas/${record.empresa._id}/sucursales/${record.sucursal._id}`}>{record.sucursal.nombre}</Link>)
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
    ];

    

    if(isLoadingObras || isLoadingEmpresas){
        return <SanzSpinner/>
    }else{
        return (
            <div>
                <div className="hero">
                    <video autoPlay loop muted plays-inline className="video-fondo">
                        <source src={require("./assets/backgroundVideo.mp4")} type="video/mp4"></source>
                    </video>
                    <div className="content">
                        <h1 className="titulo">Obras</h1>
                        <p className="descripcion">Registros <b>TOTALES</b> de obras en el sistema.</p>
                        <Input.Search className="descripcion barra-busqueda" placeholder="Busca una obra por su titulo" size="large" onChange={(e) => {onSearchObraTitulo(e.target.value)}} enterButton/>
                    </div>
                </div>

                <div className="bg-body p-3" style={{minHeight:"100vh"}}>
                    <div className="row mt-5" style={{width:"90%",margin:"0 auto"}}>
                        <div className="col-12 col-lg-2">
                            <h1 className="titulo-descripcion" style={{fontSize:"20px"}}>FILTRAR POR</h1>
                            <Divider/>

                            <h1 className="titulo-descripcion" style={{fontSize:"13px"}}>Estado de la obra</h1>
                            <Checkbox.Group onChange={(valores)=>{
                                setParametrosBusqueda({
                                    ...parametrosBusqueda,
                                    estado:valores
                                });
                            }} className="d-flex flex-column" >
                                <Checkbox value={"PRESUPUESTO-CLIENTE"} key={"PRESUPUESTO-CLIENTE"} className="ms-2">PRESUPUESTO CLIENTE</Checkbox>
                                <Checkbox value={"EN-PROGRESO"} key={"EN-PROGRESO"}>EN PROGRESO</Checkbox>
                                <Checkbox value={"FINALIZADA"} key={"FINALIZADA"}>FINALIZADA</Checkbox>
                            </Checkbox.Group>

                            <h1 className="titulo-descripcion mt-3" style={{fontSize:"13px"}}>Tipo de reporte</h1>
                            <Checkbox.Group onChange={(valores)=>{
                                setParametrosBusqueda({
                                    ...parametrosBusqueda,
                                    tipoReporte:valores
                                });
                            }} className="d-flex flex-column" >
                                <Checkbox value={"CORRECTIVO"} key={"CORRECTIVO"} className="ms-2">CORRECTIVO</Checkbox>
                                <Checkbox value={"PREVENTIVO"} key={"PREVENTIVO"}>PREVENTIVO</Checkbox>
                            </Checkbox.Group>

                            <h1 className="titulo-descripcion mt-3" style={{fontSize:"13px"}}>Empresas</h1>
                            <Checkbox.Group onChange={(valores)=>{
                                setParametrosBusqueda({
                                    ...parametrosBusqueda,
                                    empresa:valores
                                });
                            }} className="d-flex flex-column">
                                {
                                    empresas.map((empresa,index) => {
                                        if(index === 0) return <Checkbox value={empresa._id} key={empresa._id} className="ms-2">{empresa.nombre}</Checkbox>
                                        return <Checkbox value={empresa._id} key={empresa._id}>{empresa.nombre}</Checkbox>
                                    })
                                }
                            </Checkbox.Group>


                        </div>
                        <div className="col-12 col-lg-10 mt-5 mt-lg-0">
                            <h1 className="titulo-descripcion" style={{fontSize:"20px"}}>OBRAS ENCONTRADAS</h1>
                            <Divider/>
                            <Table columns={columns} dataSource={registrosObras} bordered/>
                        </div>
                    </div>
                </div>
                <Modal title="Comprobar identidad" visible={isModalVisible} onOk={()=>setIsModalVisible(false)} onCancel={()=>setIsModalVisible(false)} footer={null}>
				    <Form onFinish={handledActivateObra} layout="vertical">
					    <Form.Item label="Correo" name="correo">
						    <Input/>
					    </Form.Item>
					    <Form.Item label="Contraseña" name="password">
						    <Input.Password/>
					    </Form.Item>
					    <Button type="primary" htmlType="submit" loading={isLoadingButton}>Comprobar</Button>
				    </Form>
			    </Modal>
            </div>
        )
    }
};
