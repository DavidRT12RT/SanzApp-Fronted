import React, { useEffect, useState } from 'react'
import { Loading } from './Loading';
import { useObras } from "../../hooks/useObras";
import { Link, useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import "./assets/style.css";
import { useSelector } from 'react-redux';
import { Avatar, Button, Card, Divider, Dropdown, Form, Input, Menu, message, Modal, Statistic, Table, Tag } from 'antd';
import Password from 'antd/lib/input/Password';
import { fetchConToken } from '../../helpers/fetch';

const { confirm } = Modal;

export const ObrasScreen = () => {

    const { rol } = useSelector(store => store.auth);
    const [obrasInfo, setObrasInfo] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
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
                setObrasInfo(resp.obras)
            });
    }, []);

    
	const handledActivateObra = async (values) =>{
		setIsLoading(true);
		//Make http request to the server
		try {
			const resp = await fetchConToken(`/obras/activar/${IdObra}`,{correo:values.correo,password:values.password},"PUT");
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

    const menu = (
        <Menu items={[{key:"1",label:(<a target="_blank">Crear reporte de obras activas</a>)},{key:"2",label:(<a target="_blank">Crear reporte de obras finalizadas</a>)}]}/>
    )

    const handledFilter = ({key:value}) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        console.log(value);
        if(value == "Limpiar"){
            return setObrasInfo(obrasInfo);
        }

        value = parseInt(value);
        const resultadosBusqueda = obrasInfo.filter((elemento)=>{
            if(elemento.estadoReporte === value){
                return elemento;
            }
        });

        return setObrasInfo(resultadosBusqueda);
    }

    const handledSearch = (value) =>{
        //No hay nada en el termino de busqueda y solo pondremos TODOS los elementos
        if(value.length == 0){
            return setObrasInfo(obrasInfo);
        }

        const resultadosBusqueda = obrasInfo.filter((elemento)=>{
            if(elemento.titulo.toLowerCase().includes(value.toLowerCase())){
                return elemento;
            }
        });

        return setObrasInfo(resultadosBusqueda);
    }


    const menuFiltrar = (
        <Menu onClick={handledFilter}>
            <Menu.Item key={1}>Presupuesto con el cliente</Menu.Item>
            <Menu.Item key={2}>En desarollo</Menu.Item>
            <Menu.Item key={3}>Finalizada</Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="Limpiar">Limpiar filtros</Menu.Item>
        </Menu>
    );


	const renderizarBoton = (record) => {

        const { estado } = record;
        const rolesPermitidos = ["ADMIN_ROLE","INGE_ROLE"];

        //Si el usuario tiene rol podra editar y ver
		if(estado && rolesPermitidos.includes(rol)){
            return(
                <div className="d-flex gap-2">
                    <Button type="primary" ><Link to={`/aplicacion/obras/editor/${record._id}`}>Editar obra</Link></Button>
                    <Button type="primary" ><Link to={`/aplicacion/obras/${record._id}`}>Visor de obra</Link></Button>
                </div>
            )
        //Si el usuario NO tiene un rol solo le dejaremos ver el visor de obras
		}else if(estado && !rolesPermitidos.includes(rol)){
            return (
                <Button type="primary" ><Link to={`/aplicacion/obras/${record._id}`}>Visor de obra</Link></Button>
            )
        //Boton para volver a activar la obra
        }else if(estado != true && rol === "ADMIN_ROLE"){
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
            title:"Numero track",
            dataIndex:"numeroTrack",
            render:(item,record)=>{
                return <p className="text-primary">{item}</p>
            }
        },
        {
            title:"Fecha de creación",
            dataIndex:"fecha"
        },
        {
            title:"Nombre de la obra",
            dataIndex:"titulo",
        },
        {
            title:"Dirección regional",
            dataIndex:"direccionRegional"
        },
        {
            title:"Jefe de obra",
            dataIndex:"jefeObra",
            render:(text,record) => {
                return (
                    <div className="d-flex align-items-center gap-2">
                        <Avatar src={`http://localhost:4000/api/uploads/usuarios/${text.uid}`}></Avatar>
                        <span className="bold">{text.nombre}</span>
                    </div>
                )
            }
        },
        {
            title:"Estado del reporte",
            dataIndex:"estadoReporte",
            render: (text,record) => {
                switch (text) {
                    case 1:
                        return <Tag color="blue" key="estadoReporte">Presupuesto con cliente</Tag> 
                    case 2: 
                        return <Tag color="green" key="estadoReporte">En desarollo</Tag>
                    case 3:
                        return <Tag color="red" key="estadoReporte">Finalizada</Tag>
                } 
            }
        },
        {
            title:"Acciones",
            dataIndex:"_id",
            render:(text,record) => {
                return renderizarBoton(record);                
            }
        }
    ]

    return (
        <div className="container mt-lg-5 p-5 shadow rounded">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
                <h1 className="display-5">Registro total de obras en Sanz</h1>
                <div className="d-flex justify-content-center align-items-center gap-2">
                    <Dropdown overlay={menu}>
                        <Button onClick={(e)=> e.preventDefault()}>...</Button>
                    </Dropdown>
                    {(rol === "ADMIN_ROLE" || rol === "INGE_ROLE") && <Button type="primary" rounded><Link to="/aplicacion/obras/registro">Crear obra / servicio</Link></Button>}
                </div>
            </div>
            {/*Tarjetas de información*/}
            <div className="d-flex justify-content-start flex-wrap mt-3 gap-2">
                <Card style={{width:"300px"}}>
                    <Statistic
                        title="Obras activas"
                        value={obrasEstados.totalObrasActivas}
                        precision={0}
                        prefix="Total:"
                    />
                </Card>
                <Card style={{width:"300px"}}>
                    <Statistic
                        title="Obras finalizadas"
                        value={obrasEstados.totalObrasFinalizadas}
                        precision={0}
                        prefix="Total:"
                    />
                </Card>
                <Card style={{width:"300px"}}>
                    <Statistic
                        title="Empleados trabajando en obras"
                        value={200}
                        precision={0}
                        prefix="Total:"
                    />
                </Card>
            </div>
            <Divider/>
            <Input.Search 
                size="large" 
                style={{width:"100%"}}
                placeholder="Busca una obra por su titulo" 
                onSearch={handledSearch}
                enterButton
                className="search-bar-class"
            />
            <div className="d-flex justify-content-start gap-2 mt-3 mb-3" >
                <Dropdown overlay={menuFiltrar}>
                    <Button type="primary">
                        Filtrar obra por:
                        <DownOutlined />
                    </Button>
                </Dropdown>
            </div>

            <Table columns={columns} dataSource={obrasInfo} size="large"/>
                   
            <Modal title="Comprobar identidad" visible={isModalVisible} onOk={()=>setIsModalVisible(false)} onCancel={()=>setIsModalVisible(false)} footer={null}>
				<Form onFinish={handledActivateObra} layout="vertical">
					<Form.Item label="Correo" name="correo">
						<Input/>
					</Form.Item>
					<Form.Item label="Contraseña" name="password">
						<Password/>
					</Form.Item>
					<Button type="primary" htmlType="submit" loading={isLoadingButton}>Comprobar</Button>
				</Form>
			</Modal>
        </div>
    )
};
