import { Form,Input,Select,InputNumber,Button } from "antd";

export const RegistrarSucursal = ({
    empresaInfo,
    registrarSucursal
}) => {

    const [form] = Form.useForm();
    return (
        <>
            <h1 className="titulo">Registrar sucursal</h1>
            <p className="descripcion">Registraras una sucursal y esta se asociara a la empresa {empresaInfo.nombre}.</p>
            <Form layout="vertical" onFinish={registrarSucursal} form={form}>
                <Form.Item label="Nombre" name="nombre" rules={[{required:"true",message:"El nombre de la sucursal es requerido!"}]}>
                    <Input/>
                </Form.Item>

                <Form.Item label="Calle" name="calle" rules={[{required:"true",message:"La calle de la sucursal es requerido!"}]}>
                    <Input/>
                </Form.Item>

                <Form.Item label="Colonia" name="colonia" rules={[{required:"true",message:"La colonia es requerida!"}]}>
                    <Input/>
                </Form.Item>

                <Form.Item label="C.P" name="CP" rules={[{required:"true",message:"El CP es requerido!"}]}>
                  	<InputNumber min={1} style={{width:"100%"}}/>
                </Form.Item>

                <Form.Item label="Poblacion o delegacion" name="delegacion" rules={[{required:"true",message:"La delegacion es requerida!"}]}>
                    <Input/>
                </Form.Item>

                <Form.Item label="Estado" name="estado" rules={[{required:"true",message:"El estado es requerido!"}]}>
                    <Input/>
                </Form.Item>

                <Form.Item label="Tipo de sucursal" name="tipo" rules={[{required:"true",message:"El tipo es requerido!"}]}>
                    <Select>
                        <Select.Option value="CAJERO">Cajero</Select.Option>
                        <Select.Option value="SUCURSAL">Sucursal</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Numero sucursal" name="numero" rules={[{required:"true",message:"El tipo es requerido!"}]}>
                  	<InputNumber min={1} style={{width:"100%"}}/>
                </Form.Item>

                <Button type="primary" htmlType="submit">Registrar</Button>
            </Form>
        </>
    );
}