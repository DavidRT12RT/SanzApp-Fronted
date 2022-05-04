import React, { useContext, useEffect, useState } from 'react';
import { Form, Input, Select ,Row,Col,InputNumber, Space} from 'antd';
import { SocketContext } from '../../../context/SocketContext';
import { useParams, Link } from 'react-router-dom';
import { useSocketAlmacen } from '../../../hooks/useSocketAlmacen';
import { useSelector } from 'react-redux';

export const EditInfo = () =>{

  const {productoId} = useParams();
  const [informacionProducto, setInformacionProducto] = useState({});
  const {socket} = useContext(SocketContext);
  const usuarioActulizador = useSelector(store => store.auth.name);

    //Solicitando los productos cuando el componente cargue por primera vez o cargue otra vez
    useEffect(()=>{
        socket.emit("obtener-producto-por-id",{productoId},(producto)=>{
            setInformacionProducto(producto);
        });
    },[]);
    
    //TODO: Escuchar cuando el producto se actualiza 
    useEffect(() => {
      socket.on("producto-actualizado",(producto)=>{
        if(producto._id === informacionProducto._id){
          setInformacionProducto(producto);
        }
      }) 
    }, [socket,setInformacionProducto,informacionProducto]);
    

    const UpdateProduct = (values) => {
      values.estatus === "NO-disponible" ? values.estatus = false : values.estatus = true;
      values.registros = informacionProducto.registros;
      values.usuarioActualizador = usuarioActulizador;
      //Enviar señal de actualización de un producto
      socket.emit("producto-actualizado",{...values,_id:informacionProducto._id},(producto)=>{
        setInformacionProducto(producto);
      });
    }

  const onChange = (newFields) => {
    setFields(newFields);
  }


  const [fields, setFields] = useState([
     {
        name: ['nombre'],
        value:"",
      },
      {
        name:["marcaProducto"],
        value:""
      },
      {
        name:["categorias"],
        value:[]
      },    
      {
        name:["cantidad"],
        value:1
      },
      {
        name:["descripcion"],
        value:""
      },
      {
        name:["costo"],
        value:1
      },
      {
        name:["estadoProducto"],
        value:""
      },
      {
        name:["inventariable"],
        value:""
      },
      {
        name:["estatus"],
        value:""
      }
  ]);


  useEffect(()=>{
    setFields([
      {
        name:["nombre"],
        value:informacionProducto.nombre
      },
      {
        name:["marcaProducto"],
        value:informacionProducto.marcaProducto
      },
      {
        name:["categorias"],
        value:informacionProducto.categorias
      },    
      {
        name:["cantidad"],
        value:informacionProducto.cantidad
      },
      {
        name:["descripcion"],
        value:informacionProducto.descripcion
      },
      {
        name:["costo"],
        value:informacionProducto.costo
      },
      {
        name:["estadoProducto"],
        value:informacionProducto.estadoProducto
      },
      {
        name:["inventariable"],
        value:informacionProducto.inventariable
      },
      {
        name:["estatus"],
        value:(informacionProducto.estatus ? "Disponible" : "NO-disponible")
      },
    ]); 
  },[informacionProducto]);

  return (
      
    <div className="mt-3">
        <h1>Editar información sobre producto</h1>
        <span>A continuación se mostraran los campos del producto que pueden ser cambiados.</span>
        <div className="mt-3">
           <Form
              name="global_state"
              layout="vertical"
              onFinish={UpdateProduct}
              fields={fields}
              onFieldsChange={(_, allFields) => {
                onChange(allFields);
              }}
            >
              <Row gutter={16}>

                <Col span={12}>
                    <Form.Item
                      name="nombre"
                      label="Nombre producto"
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                <Col span={12}>
                    <Form.Item 
                      name="marcaProducto" 
                      label="Marca producto"
                      >
                      <Input/>
                    </Form.Item>
                  </Col>

              <Col span={12}>
                <Form.Item
                    name="categorias"
                    label="Categorias"
                >
                  <Select mode="multiple">
	                  <Select.Option value="ferreteria">Ferreteria</Select.Option>
                    <Select.Option value="vinilos">Vinilos</Select.Option>
                    <Select.Option value="herramientas">Herramientas</Select.Option>
                    <Select.Option value="pisosAzulejos">Pisos y azulejos</Select.Option>
                    <Select.Option value="Fontaneria">Fontaneria</Select.Option>
                    <Select.Option value="Iluminacion">Iluminación</Select.Option>
                    <Select.Option value="electrico">Material electrico</Select.Option>
                  </Select>
              </Form.Item>
              </Col>

              <Col span={12}>
                    <Form.Item 
                        label="Cantidad en bodega :" 
                        name="cantidad"
                        >
                        <InputNumber style={{width: "100%"}} min={1} />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item 
                        label="Descripción del producto"
                        name="descripcion"
                        >
                      <Input.TextArea allowClear showCount minLength={20} maxLength={60} style={{width:"100%"}}/>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item 
                        label="Costo del producto " 
                        name="costo"
                        >
                        <InputNumber style={{width: "100%"}} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                        name="estadoProducto"
                        label="Estado del producto"
                    >
                    <Select placeholder="¿Como se encuentra el producto?">
                      <Select.Option value="nuevo">Nuevo</Select.Option>
                      <Select.Option value="usado">Usado</Select.Option>
                    </Select>
                    </Form.Item>
                  </Col>

                <Col span={12}>
                    <Form.Item
                        name="inventariable"
                        label="Inventariable"
                    >
                    <Select>
                      <Select.Option value="inventariable">Inventariable</Select.Option>
                      <Select.Option value="no-inventariable">NO inventariable</Select.Option>
                    </Select>
                    </Form.Item>
                  </Col>

                <Col span={12}>
                    <Form.Item
                        name="estatus"
                        label="Estatus del producto"
                    >
                    <Select>
                      <Select.Option value="disponible">Disponible</Select.Option>
                      <Select.Option value="NO-disponible">NO disponible</Select.Option>
                    </Select>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                      <Link to="/aplicacion/almacen/" className='btn btn-outline-danger rounded p-md-3 mt-4'><i className="fa-solid fa-xmark"></i>   Cancelar actualización </Link>
                    </Col>

                    <Col span={12}>
                      <Space direction="horizontal" style={{width: '100%', justifyContent: 'end'}}>
                      <button className='btn btn-outline-warning rounded p-md-3 mt-4' type="submit">Actualizar información   <i className="fa-solid fa-arrow-right"></i> </button>
                      </Space>
                    </Col>
              </Row>
            </Form>
          </div>
    </div>
  );
}

