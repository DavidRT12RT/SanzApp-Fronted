import { Button, Form, Input, InputNumber, message, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
const { Option } = Select;


export const SalidaDirecta = ({informacionProducto,socket}) => {
    const [form] = Form.useForm();
    const usuario= useSelector(store => store.auth.name);

    const onReset = () =>{
       form.resetFields();
    } 

    const onFinish = (values) =>{
        values.usuario = usuario;
        values.productoId = informacionProducto._id;
        socket.emit("producto-salida-por-directa",values,(confirmacion)=>{
            const {msg,ok} = confirmacion;
            ok ? message.success(msg) : message.error(msg);
        });
    }


    return (
    <div className="p-3">
        <h4 className="mb-3">Salida directa del producto</h4>
        <p className="lead">A continuación se requiere que completes los siguientes campos.</p>

        <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>


            <Form.Item 
                label="Motivo para el retiro del producto"
                name="motivo"
                tooltip="Menciona el motivo , razon por el cual el producto esta siendo retirado del almacen"
                rules={[
                  {
                    required:true,
                    message:"Debes ingresar un motivo",
                  }
                ]}
            >
              <Input.TextArea allowClear showCount minLength={20} maxLength={60} style={{width:"100%"}} />
            </Form.Item>

            <Form.Item
                label={`Cantidad a retirar (${informacionProducto.cantidad} unidades actuales en almacen)`}
                name="cantidad"
                tooltip="Aclara la cantidad que te llevaras del almacen" 
                rules={[
                    {
                        required:true,
                        message:"Debes definir la cantidad",
                    }
                ]}
            >
                <InputNumber style={{width: "100%"}} min={1} max={informacionProducto.cantidad}/>
            </Form.Item>
                <div className="d-flex justify-content-start gap-2">
                    <Button type="primary" htmlType="submit">Realizar acción!</Button>
                    <Button className="mx-2" htmlType='button' onClick={onReset}>Borrar información</Button>
                </div>
       </Form>
    </div>
    )
}
