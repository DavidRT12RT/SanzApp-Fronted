import { Button, Form, Input, InputNumber, message, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
const { Option } = Select;

export const SalidaPorObra = ({informacionProducto,socket}) => {

    const [obrasActuales, setObrasActuales] = useState([]);
    const [form] = Form.useForm();
    const usuario= useSelector(store => store.auth.name);

    const onFinish = (values) =>{
        values.usuario = usuario;
        values.productoId = informacionProducto._id;
        socket.emit("producto-salida-por-obra",values,(confirmacion)=>{
            const { msg ,ok }  = confirmacion;
            ok ? message.success(msg) : message.error(msg);
        });
    }

   const onReset = () =>{
       form.resetFields();
   } 

    useEffect(() => {
        socket.emit("obtener-obras-en-desarollo",{},(obras)=>{ 
            setObrasActuales(obras);
        }); 
    }, []);

    return (
    <div className="p-3">
        <h4 className="mb-3">Salida del producto por obra</h4>
        <p className="lead">A continuación se requiere que completes los siguientes campos.</p>
        <Form form={form} layout="vertical" autoComplete="off" onFinish={onFinish}>

            <Form.Item
                label="Obra a la cual sera digiridad este producto"
                name="obraId"
                tooltip="Especifica a que obra se ira este producto del almacen"
                rules={[
                    {
                        required:true,
                        message:"Debes ingresar la obra a la cual el producto del almacen sera dirigido!"
                    }
                ]}
            >
                <Select 
                    placeholder="Selecciona una obra en proceso..."
                    allowClear
                >
                    {
                        obrasActuales.map(obra => {
                            return <Option value={obra._id}>{obra.titulo}</Option>
                        })
                    }
                </Select>
            </Form.Item>

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
