import { Button, Col, Form, Image, Input, message, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react'

export const InformacionUsuario = ({usuarioInfo,socket}) => {
    const [form] = Form.useForm();
    const {uid:usuarioId} = usuarioInfo;
    const [fields, setFields] = useState([
        {
          name: ['nombre'],
          value:"",
        },
        {
            name:["rol"],
            value:""
        },
        {
            name:["telefono"],
            value:""
        },
        {
            name:["correo"],
            value:""
        },
        {
            name:["estado"],
            value:""
        }
    ]);

    useEffect(() => {
        setFields([
            {
                name: ['nombre'],
                value:usuarioInfo.nombre,
            },
            {
                name:["correo"],
                value:usuarioInfo.correo
            },
            {
                name:["estado"],
                value:(usuarioInfo.estado ? "Activo" : "No activo")
            },
            {
                name:["rol"],
                value:usuarioInfo.rol
            },
            {
                name:["telefono"],
                value:usuarioInfo.telefono
            },

        ])
    }, [usuarioInfo]);

   

    const handleEditInfoUser = (values) => {
        //Verificar que los valores NO sean los mismos
            values.usuarioId = usuarioId;
            values.estado = values.estado == "Activo" ? true : false;
            socket.emit("actualizar-informacion-usuario",{values},(confirmacion)=>{
                if (confirmacion.ok) {
                    message.success(confirmacion.msg);
                    //Setear nuevos valores!
                }else{
                    message.error(confirmacion.msg);
                }
            });
    }

    return (
          <div className='mt-3'>
              <h1>Información del usuario</h1>
              <p className="lead">Aqui se mostrar información basica sobre el usuario que puede solo ser editaba por usuarios con rol Administrativo.</p>
                <Row gutter={16}>
                    <Col xs={24} lg={12}>
                        <Image width={200} height={200} src={`http://localhost:4000/api/uploads/usuarios/${usuarioId}`} style={{objectFit:"cover"}} />
                    </Col>
                    <Col xs={24} lg={12} className="d-flex align-items-center mt-3 mt-lg-0">
                        <div>
                            <h4>{usuarioInfo.nombre}</h4>
                            <span>{usuarioInfo.rol}</span>
                        </div>
                    </Col>
                </Row>
                <Form 
                    layout='vertical' 
                    fields={fields} 
                    onFinish={handleEditInfoUser} 
                >                       
                    <Row className="mt-5" gutter={16}>
                        {/*Formulario*/}
                        <Col xs={24} lg={12}>
                            <Form.Item name="nombre" label="Nombre del usuario"><Input size='large'/></Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Correo del usuario" name="correo"><Input size='large'/></Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Telefono del usuario" name="telefono"><Input size='large'/></Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>

                            <Form.Item name="estado" label="Estado del usuario">
                                <Select size="large">
                                    <Select.Option value="Activo">Activo</Select.Option>
                                    <Select.Option value="No activo">No activo</Select.Option>
                                </Select>
                          </Form.Item>

                        </Col>

                        <Col span={24} className="d-flex justify-content-start">
                            <Button type="primary" size='large' htmlType='submit'>Editar información</Button>
                        </Col>
                    </Row>
                </Form>
        </div>
    )
}
