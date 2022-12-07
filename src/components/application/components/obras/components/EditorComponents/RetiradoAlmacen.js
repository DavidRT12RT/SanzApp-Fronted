import { Button, Col, Divider, Drawer, Input, message, Row, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'
import { fetchConToken } from '../../../../../../helpers/fetch';
import { ProductoCardAlmacen } from '../../../../../almacen/components/salidas/ProductoCardAlmacen';
const { Search } = Input;

export const RetiradoAlmacen = ({obraInfo}) => {
    
    const [materiales, setMateriales] = useState([]);
    const [herramientas, setHerramientas] = useState([]);
    const [productosDevueltos, setProductosDevueltos] = useState([]);
    const [producto, setProducto] = useState(null);
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    const categoriaColor = (categoria) => {
        switch (categoria) {
            case "ferreteria":
                return <Tag color="cyan" key="ferreteria">{categoria.toUpperCase()}</Tag> 
            case "vinilos":
                return <Tag color="green" key="vinilos">{categoria.toUpperCase()}</Tag> 
            case "herramientas":
                return <Tag color="blue" key="herramientas">{categoria.toUpperCase()}</Tag> 
            case "pisosAzulejos":
                return <Tag color="orange" key="pisosAzulejos">{categoria.toUpperCase()}</Tag>
            case "fontaneria":
                return <Tag color="red" key="fontaneria">{categoria.toUpperCase()}</Tag>
            case "iluminacion":
                return <Tag color="yellow" key="iluminacion">{categoria.toUpperCase()}</Tag>
            case "materialElectrico":
                return <Tag color="gold" key="materialElectrico">{categoria.toUpperCase()}</Tag>
            default:
                return <Tag color="green" key="categoria">{categoria.toUpperCase()}</Tag> 
        }
    }

    const DescriptionItem = ({ title, content }) => (
        <div className="site-description-item-profile-wrapper">
            <p className="site-description-item-profile-p-label">{title}:</p>
            {content}
        </div>
    );

    const columns = [
        {
            title:"Nombre del producto",
            render:(text,record) => {
                return <span>{record.id.nombre}</span>
            }
        },
        {
            title:"Marca del producto",
            render:(text,record) => {
                return <span>{record.id.marcaProducto}</span>
            }
        },
        {
            title:"Costo medio por unidad",
            render:(text,record) => {
                return <span>{record.id.unidad}</span>
            }
        },
        {
            title:"Categorias del producto",
            dataIndex:"categorias",
            render:(text,record) => {
                return record.id.categorias.map(categoria => {
                    return categoriaColor(categoria);
                });
            }
        },
        {
            title:"Cantidad retirada de almacen",
            render:(text,record) => {
                return <span>{record.cantidad}</span>
            }
        },
        {
            title:"Fecha del retiro",
            render:(text,record) => {
                return <span>{record.fecha}</span>
            }
        },
        {
            title:"Detalles",
            render:(text,record) => {
                return (
                    <a href="#" onClick={(e)=>{e.preventDefault();setProducto({record,tipo:"retirado"});setIsDrawerVisible(true)}}>Ver mas detalles</a>
                )
            }
        }
    ];

    const columnsProductosDevueltos = [
        {
            title:"Nombre del producto",
            render:(text,record) => {
                return <span>{record.id.nombre}</span>
            }
        },
        {
            title:"Marca del producto",
            render:(text,record) => {
                return <span>{record.id.marcaProducto}</span>
            }
        },
        {
            title:"Costo medio por unidad",
            render:(text,record) => {
                return <span>{record.id.unidad}</span>
            }
        },
        {
            title:"Categorias del producto",
            dataIndex:"categorias",
            render:(text,record) => {
                return record.id.categorias.map(categoria => {
                    return categoriaColor(categoria);
                });
            }
        },
        {
            title:"Cantidad devuelta a almacen",
            render:(text,record) => {
                return <span>{record.cantidad}</span>
            }
        },
        {
            title:"Fecha de la devolucion",
            render:(text,record) => {
                return <span>{record.fecha}</span>
            }
        },
        {
            title:"Detalles",
            render:(text,record) => {
                return (
                    <a href="#" onClick={(e)=>{e.preventDefault();setProducto({record,tipo:"devuelto"});setIsDrawerVisible(true)}}>Ver mas detalles</a>
                )
            }
        }
    ];

    useEffect(() => {
        /*Seteando los materiales con un array vacio para que cada vez que entremos al componente o se mande a actualizar 
        no agregue en los elementos anteriores si no que borre lo que habia antes y agregue lo nuevo */
        setMateriales([]);
        setHerramientas([]);
        setProductosDevueltos([]);

        obraInfo.retiradoAlmacen.map(salida => {
            salida.listaProductos.map((producto,index) => {
                producto.id.categorias.includes("herramientas") ? setHerramientas(array => [...array,{...producto,fecha:salida.fechaCreacion,motivo:salida.motivo}]) : setMateriales(array => [...array,{...producto,fecha:salida.fechaCreacion,motivo:salida.motivo}]);
            });

            salida.productosDevueltos.map(entrada => {
                entrada.listaProductos.map((producto,index) => {
                    setProductosDevueltos(array => [...array,{...producto,fecha:entrada.fecha,motivo:salida.motivo}]);
                });
            })
        });


    }, [obraInfo]);


    const filtrarPorNombre = (valor,tipo) => {
        
        switch (tipo) {
            case "sobrante-de-obra":
                if(valor === ""){
                    //resetear valores
                    setProductosDevueltos([]);
                    obraInfo.retiradoAlmacen.map(salida => {
                        salida.productosDevueltos.map(entrada => {
                            entrada.listaProductos.map((producto,index) => {
                                setProductosDevueltos(array => [...array,{...producto,fecha:entrada.fecha,motivo:salida.motivo}]);
                            });
                        })
                    });
                    return;
                }

                const productosDevueltosFiltrados = productosDevueltos.filter(producto => (
                    producto.id.nombre.toLowerCase().includes(valor.toLowerCase())
                ));
                return setProductosDevueltos(productosDevueltosFiltrados);

            case "herramientas":
                if(valor === ""){
                    //resetear valores
                    setHerramientas([]);
                    obraInfo.retiradoAlmacen.map(salida => {
                        salida.listaProductos.map((producto,index) => {
                            producto.id.categorias.includes("herramientas") && setHerramientas(array => [...array,{...producto,fecha:salida.fechaCreacion,motivo:salida.motivo}]);
                        });
                    });
                    return;
                }

                const herramientasFiltradas = herramientas.filter(producto => (
                    producto.id.nombre.toLowerCase().includes(valor.toLowerCase())
                ));
                return setHerramientas(herramientasFiltradas);
            
            case "materiales":
                if(valor === ""){
                    //resetear valores
                    setMateriales([]);
                    obraInfo.retiradoAlmacen.map(salida => {
                        salida.listaProductos.map((producto,index) => {
                            producto.id.categorias.includes("materiales") && setMateriales(array => [...array,{...producto,fecha:salida.fechaCreacion,motivo:salida.motivo}]);
                        });
                    });
                    return;
                }
                const materialesFiltrados = materiales.filter(producto => (
                    producto.id.nombre.toLowerCase().includes(valor.toLowerCase())
                ));

                return setMateriales(materialesFiltrados);

        }
    }


    const handleDownloadEvidencia = async () => {
        try {
            const resp = await fetchConToken(`/obras/documento-pdf-productos/${obraInfo._id}`);
            const bytes = await resp.blob();
            let element = document.createElement('a');
            element.href = URL.createObjectURL(bytes);
            element.setAttribute('download',`${obraInfo._id}.pdf`);
            element.click();
        } catch (error) {
           message.error("No se pudo descargar el archivo del servidor :("); 
        }
    }

    return (
        <>
            <h1>Productos retirados del almacen</h1>
            <p className="lead">Total de productos retirados del almacen para la obra actual, podras descargar un documento PDF <br/>con la lista de productos totales que se usaron en la obra asi como los sobrantes de obra de la misma obra.</p>
            <span>Descargar PDF con la lista de productos retirados y sobrante de obra &gt; <a href="#" onClick={(e)=>{e.preventDefault();handleDownloadEvidencia()}}>Click aqui!</a></span>
            <div className="p-5 bg-body mt-3">
                <h2 className="fw-bold">Material retirado de almacen</h2>
                <p className="text-muted">Aqui se mostraran todos los materiales retirados a de almacen para la obra actual.<br/></p>
	            <Search
                    placeholder="Buscar un producto por su nombre"
                    allowClear
                    autoFocus
                    enterButton="Buscar"
                    style={{maxWidth:"500px"}}
                    onSearch={(e)=>{filtrarPorNombre(e,"materiales")}}
                /> 
                <Table columns={columns} dataSource={materiales} bordered className="mt-3"/>
            </div>

            <div className="p-5 bg-body mt-5">
                <h2 className="fw-bold">Herramientas retiradas de almacen</h2>
                <p className="text-muted">Aqui se mostraran todas las herramientas retiradas del almacen para la obra actual.</p>
	            <Search
                    placeholder="Buscar un producto por su nombre"
                    allowClear
                    autoFocus
                    enterButton="Buscar"
                    style={{maxWidth:"500px"}}
                    onSearch={(e)=>{filtrarPorNombre(e,"herramientas")}}
                /> 
                <Table columns={columns} dataSource={herramientas} bordered className="mt-3"/>
            </div>

            <div className="p-5 bg-body mt-5">
                <h2 className="fw-bold">Sobrante de obra</h2>
                <p className="text-muted">Aqui se mostraran todos los productos devueltos al almacen que anteriormente habian sido retirados para la obra actual.</p>
	            <Search
                    placeholder="Buscar un producto por su nombre"
                    allowClear
                    autoFocus
                    enterButton="Buscar"
                    style={{maxWidth:"500px"}}
                    onSearch={(e)=>{filtrarPorNombre(e,"sobrante-de-obra")}}
                /> 
                <Table columns={columnsProductosDevueltos} dataSource={productosDevueltos} bordered className="mt-3"/>
            </div>
			{producto != null && (
				<Drawer width={640} placement="right" closable={false} onClose={()=>{setIsDrawerVisible(false);}} visible={isDrawerVisible}>
                    <p className="site-description-item-profile-p" style={{marginBottom: 24,}}>Informacion detallada</p>
					<Divider/>
                    {producto.tipo === "retirado" 
                        ? 
                        (
                            <>
                                <p className="site-description-item-profile-p">Informacion sobre su salida de almacen</p>
                                <Row>
                                    <Col span={12}><DescriptionItem title="Fecha de la salida" content={producto.record.fecha}/></Col>
                                    <Col span={24}><DescriptionItem title="Motivo" content={producto.record.motivo}/></Col>
                                </Row>
                            </>
                        )
                        :
                        (
                            <>
                                <p className="site-description-item-profile-p">Informacion sobre entrada a almacen</p>
                                <Row>
                                    <Col span={24}><DescriptionItem title="Fecha de la devolucion a almacen" content={producto.record.fecha}/></Col>
                                </Row>
                            </>
                        )
                    }
					<Divider/>
                    <p className="site-description-item-profile-p">Informacion sobre el producto</p>
					<Row>
                       	<Col span={24}>
                            <ProductoCardAlmacen producto={producto.record} tipo={producto.tipo}/>
                        </Col>
					</Row>
                </Drawer>
			)}
        </>
    )
}
