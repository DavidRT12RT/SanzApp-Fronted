import { Button, DatePicker, Form, Input, message } from 'antd'
import React from 'react'
import locale from "antd/es/date-picker/locale/es_ES"

export const EditarInformacionGeneral = ({usuarioInfo,socket,setIsModalVisibleEditInfo}) => {
    
    const handleUpdateCamioneta = (values) => {
        values.usuarioId = usuarioInfo.uid;
        socket.emit("actualizar-informacion-usuario",{values},(paquete)=>{
            paquete.ok ? message.success(paquete.msg) : message.error(paquete.msg);
        });
        setIsModalVisibleEditInfo(false);
    }

    return (
        <Form layout="vertical" onFinish={handleUpdateCamioneta}>
            <Form.Item label="Nombre del empleado" name="nombre" initialValue={usuarioInfo.nombre} rules={[{required:true,message:"Se requiere este campo!"}]}>
                <Input />
            </Form.Item>
            <Form.Item label="Correo electronico" name="correo" initialValue={usuarioInfo.correo} rules={[{required:true,message:"Se requiere este campo!"}]}>
                <Input/>
            </Form.Item>
            <Form.Item label="Telefono del usuario" name="telefono"  initialValue={usuarioInfo.telefono} rules={[{required:true,message:"Se requiere este campo!"}]}>
                <Input/>
            </Form.Item>
            <Form.Item label="Numero de seguro social" name="NSS"  initialValue={usuarioInfo.NSS} rules={[{required:true,message:"Se requiere este campo!"}]}>
                <Input/>
            </Form.Item>
            <Form.Item label="RFC" name="RFC" initialValue={usuarioInfo.RFC} rules={[{required:true,message:"Se requiere este campo!"}]}>
                <Input/>
            </Form.Item>
            <Form.Item label="CURP" name="CURP" initialValue={usuarioInfo.CURP} rules={[{required:true,message:"Se requiere este campo!"}]}>
                <Input/>
            </Form.Item>
            <Form.Item label="Rol del usuario" name="rol" initialValue={usuarioInfo.rol} rules={[{required:true,message:"Se requiere este campo!"}]}>
                <Input/>
            </Form.Item>
            <div className="d-flex justify-content-start gap-2 flex-wrap">
                <Button type="primary" danger onClick={()=>{setIsModalVisibleEditInfo(false)}}>Cancelar</Button>
                <Button type="primary" htmlType="submit">Editar información</Button>
            </div>
        </Form>
    )
}
