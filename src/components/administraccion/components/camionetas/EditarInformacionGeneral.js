import { Button, DatePicker, Form, Input, message } from 'antd'
import React from 'react'
import locale from "antd/es/date-picker/locale/es_ES"

export const EditarInformacionGeneral = ({camionetaInfo,socket,setIsModalVisible}) => {
    
    const handleUpdateCamioneta = (values) => {
        values.uid = camionetaInfo.uid;
        socket.emit("actualizar-informacion-camioneta-por-id",values,(confirmacion)=>{
            if(confirmacion.ok){
                message.success(confirmacion.msg);
                setIsModalVisible(false);
            }else{
                message.error(confirmacion.msg)
            }
        });
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
            {/*
            <Form.Item label="Fecha de compra" name="fechaCompra"  rules={[{required:true,message:"Se requiere este campo!"}]}>
                <DatePicker style={{width:"100%"}} locale={locale}/>
            </Form.Item>
            */}
            <div className="d-flex justify-content-start gap-2 flex-wrap">
                <Button type="primary" danger onClick={()=>{setIsModalVisible(false)}}>Cancelar</Button>
                <Button type="primary" htmlType="submit">Editar información</Button>
            </div>
        </Form>
    )
}
