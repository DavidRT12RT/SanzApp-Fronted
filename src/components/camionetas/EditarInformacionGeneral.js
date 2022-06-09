import { Button, DatePicker, Form, Input } from 'antd'
import React from 'react'

export const EditarInformacionGeneral = ({camionetaInfo,socket}) => {
    
    const handleUpdateCamioneta = (values) => {
        console.log(values);
    }
    return (
        <Form layout="vertical" onFinish={handleUpdateCamioneta}>
            <Form.Item label="Marca de la camioneta" name="marca" initialValue={camionetaInfo.marca} rules={[{required:true,message:"Se requiere este campo!"}]}>
                <Input />
            </Form.Item>
            <Form.Item label="Modelo de la camioneta" name="modelo" initialValue={camionetaInfo.modelo} rules={[{required:true,message:"Se requiere este campo!"}]}>
                <Input/>
            </Form.Item>
            <Form.Item label="Placa de la camioneta" name="placa" initialValue={camionetaInfo.placa} rules={[{required:true,message:"Se requiere este campo!"}]}>
                <Input/>
            </Form.Item>
            <Form.Item label="Fecha de compra" name="fechaCompra" ini rules={[{required:true,message:"Se requiere este campo!"}]}>
                <DatePicker style={{width:"100%"}}/>
            </Form.Item>
            <div className="d-flex justify-content-start gap-2 flex-wrap">
                <Button type="primary" danger htmlType="submit">Cancelar</Button>
                <Button type="primary" htmlType="submit">Editar información</Button>
            </div>
        </Form>
    )
}
