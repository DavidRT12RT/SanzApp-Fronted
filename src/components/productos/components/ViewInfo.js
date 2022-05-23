import React from 'react';
import 'antd/dist/antd.css';
import { Descriptions, Badge,Tag, Image} from 'antd';
import { List, Typography, Divider } from "antd";

export const ViewInfo = ({informacionProducto,ImageProduct}) => {

    const registrosColors = (item = "") =>{

        if(item.startsWith("[ENTRADA]") || item.startsWith("[REGISTRO]")){
                return  <List.Item><Typography.Text type="success">{item}</Typography.Text></List.Item>

        }else if(item.startsWith("[ACTUALIZADO]")){
            return  <List.Item><Typography.Text type="warning">{item}</Typography.Text></List.Item>
        }else if(item.startsWith("[ACTUALIZADO-IMAGEN]")){
            return  <List.Item><Typography.Text type="warning">{item}</Typography.Text></List.Item>
        }else if(item.startsWith("[ELIMINADO]")){
                return  <List.Item><Typography.Text type="danger">{item}</Typography.Text></List.Item>
        }else if(item.startsWith("[SALIDA-POR-OBRA]")){
                return  <List.Item><Typography.Text mark>{item}</Typography.Text></List.Item>
        }else if(item.startsWith("[SALIDA-DIRECTA]")){
                return  <List.Item><Typography.Text mark>{item}</Typography.Text></List.Item>
        }else{
            return  <List.Item><Typography.Text type="secondary">{item}</Typography.Text></List.Item>
        }
    }

    const categoriaColor = (categoria) => {
        switch (categoria) {
            case "ferreteria":
                return <Tag color="cyan" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "vinilos":
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "herramientas":
                return <Tag color="blue" key="categoria">{categoria.toUpperCase()}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" key="categoria">{categoria.toUpperCase()}</Tag>
            case "fontaneria":
                return <Tag color="red" key="categoria">{categoria.toUpperCase()}</Tag>
            case "iluminacion":
                return <Tag color="yellow" key="categoria">{categoria.toUpperCase()}</Tag>
            case "materialElectrico":
                return <Tag color="gold" key="categoria">{categoria.toUpperCase()}</Tag>
            default:
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
                break;
        }
    }



    if(informacionProducto === undefined){
        <h1>Cargando...</h1>
        console.log("Cargandoo....");
    }else{
    return (
        <div>
            <h1>Información sobre el producto en almacen</h1>
            <div className="row">
               <div className="col-lg-9 col-sm-12">
                    <Descriptions layout="vertical" bordered>
                        <Descriptions.Item label="Nombre del producto">{informacionProducto.nombre}</Descriptions.Item>
                        <Descriptions.Item label="Cantidad">{informacionProducto.cantidad}</Descriptions.Item>
                        <Descriptions.Item label="Estado">{informacionProducto.estadoProducto}</Descriptions.Item>
                        <Descriptions.Item label="Categorias">{informacionProducto?.categorias?.map(categoria => categoriaColor(categoria))}</Descriptions.Item>
                        <Descriptions.Item label="Marca del producto">{informacionProducto.marcaProducto}</Descriptions.Item>
                        <Descriptions.Item label="Costo del producto">{informacionProducto.costo}</Descriptions.Item>
                        <Descriptions.Item label="Unidad">{informacionProducto.unidad}</Descriptions.Item>
                        <Descriptions.Item label="Usuario creador">Carlos Sanchez</Descriptions.Item>
                        <Descriptions.Item label="ID del producto">{informacionProducto._id}</Descriptions.Item>
                        <Descriptions.Item label="Estatus" span={3}>
                            <Badge status={informacionProducto.estatus ? "processing" : "error"} text={informacionProducto.estatus ? "Disponible en almacen" : "NO disponible en almacen"}/>
                        </Descriptions.Item>
                        <Descriptions.Item label="Fecha de ingreso al sistema">{informacionProducto.fechaRegistro}</Descriptions.Item>
                        <Descriptions.Item label="Ultima revisión en bodega" span={2}>
                            {informacionProducto.fechaRegistro}
                        </Descriptions.Item>


                        <Descriptions.Item label="Descripción del producto">
                            {informacionProducto.descripcion}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <div className="col-lg-3 col-sm-12">
                    <Divider orientation="left">Imagen del producto</Divider>
                        <Image
                            width={300}
                            height={300}
                            style={{objectFit:"cover"}}
                            src={ImageProduct}
                        />
                </div>
                <div className="col-lg-12 col-sm-12">
                    <Divider orientation="left">Movimientos | Registros</Divider>
                    <List
                        header={<div>Información sobre las entradas y salidas de los productos en el almacen</div>}
                        bordered
                        dataSource={informacionProducto?.registros}
                        renderItem={(item) => registrosColors(item)} 
                        style={{maxHeight:"500px",overflowY:"scroll"}}
                    />
                </div>
                
            </div>

          
               
       

            </div>
        )
    }
}