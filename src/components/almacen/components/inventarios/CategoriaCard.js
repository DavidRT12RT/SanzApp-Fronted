import { Button } from 'antd';
import React from 'react'
import { Box2Fill,Box2HeartFill,Boxes,BracesAsterisk } from 'react-bootstrap-icons';
import { RightOutlined } from '@ant-design/icons';


export const CategoriaCard = ({categoria,setCategorias,categorias}) => {

    
    const renderizarIcono = (categoria) => {
        switch (categoria) {
            case "TODOS":
                return <BracesAsterisk/> 

            case "VARIOS-PRODUCTOS":
                return <Boxes/>

            case "UN-PRODUCTO":
                return <Box2Fill/> 

            case "POR-CATEGORIA":
                return <Box2HeartFill/>
        }
    }


    const agregarOQuitarCategoria = () => {
        if(categorias.includes(categoria)){
            //Eliminarla 
            const nuevasCategorias = categorias.filter(categoriaArray => categoriaArray != categoria)
            setCategorias(nuevasCategorias);
        }else{
            //Agregarla
            setCategorias(array => [...array,categoria]);
        }

    }

    return (
        <div className={"categoriaCard border " + (categorias.includes(categoria) ? "bg-warning" : "bg-body")}>
            <p className={categorias.includes(categoria) ? "text-white" : "text-warning"} style={{fontSize:"34px"}}>{renderizarIcono(categoria)}</p>
            <h1 className="titulo-descripcion">{categoria}</h1>
            <Button className="mt-2" shape="round" icon={<RightOutlined style={{}}/>} size="small" onClick={agregarOQuitarCategoria}/>
        </div>
    )
}
