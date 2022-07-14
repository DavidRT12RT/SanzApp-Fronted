import { Table, Tag } from 'antd'
import React from 'react'
import { SanzSpinner } from '../../../../helpers/spinner/SanzSpinner';
import { useProductos } from '../../../../hooks/useProductos';

export const Inventario = () => {
    const categoriaColor = (categoria) => {
        switch (categoria.toLowerCase()) {
            case "ferreteria":
                return <Tag color="cyan" key="categoria">{categoria}</Tag> 
            case "vinilos":
                return <Tag color="green" key="categoria">{categoria}</Tag> 
            case "herramientas":
                return <Tag color="blue" key="categoria">{categoria}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" key="categoria">{categoria}</Tag>
            case "fontaneria":
                return <Tag color="red" key="categoria">{categoria}</Tag>
            case "iluminacion":
                return <Tag color="yellow" key="categoria">{categoria}</Tag>
            case "materialElectrico":
                return <Tag color="gold" key="categoria">{categoria}</Tag>
            default:
                return <Tag color="green" key="categoria">{categoria}</Tag> 
        }
    }


   

    const { isLoading, productos } = useProductos();

    const columns = [
        {
            title:"Nombre del producto",
            dataIndex:"nombre",
            key:"nombre"
        },
        {
            title:"Categorias",
            dataIndex:"categorias",
            render:(text,record)=> {
                return record.categorias.map(categoria => {
                    return categoriaColor(categoria.nombre);
                })
            }
        },
        {
            title:"Cantidad en stock",
            dataIndex:"cantidad",
            key:"cantidad"
        },
        {
            title:"Fecha de registro",
            dataIndex:"fechaRegistro"
        },
        {
            title:"Entradas del producto",
            render:(text,record)=>{
                return <Tag color={"green"}>{(record.registrosEntradas.devolucionResguardo.length + record.registrosEntradas.normal.length + record.registrosEntradas.sobranteObra)}</Tag>
            }
        },
        {
            title:"Salidas del producto",
            render:(text,record)=>{
                return <Tag color={"red"}>{(record.registrosSalidas.merma.length + record.registrosSalidas.obra.length + record.registrosSalidas.resguardo.length)}</Tag>
            }
        }
    ];

    if(isLoading){
        return <SanzSpinner/>
    }else{
        return (
            <>
                <div className="d-flex mt-5 align-items-center flex-column gap-2" style={{height:"100vh",width:"100vw"}}>
                    <h1 className="display-5 fw-bold">Inventario del almacen</h1>
                    <span className="d-block text-center">
                        Aqui se mostraran todas las entradas y salidas de todos los productos que esten marcados como 
                        <br/> "Inventariables" y la cantidad de stock actual.
                    </span>
                    <div className="container p-5 d-flex gap-2 justify-content-center align-items-center mt-3 flex-column ">
                        <Table columns={columns} dataSource={productos}/>
                    </div>
                </div>
            </>
        )
    }
}
