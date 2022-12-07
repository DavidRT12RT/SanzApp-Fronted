import React, { useEffect, useState } from 'react';
import { Button, Image } from 'antd';
import "../assets/styleVistaObra.css";

const ImagenesObra = ({obraInfo}) => {
    const { _id:obraId } = obraInfo;
    const [files, setFileList] = useState([]);
    const [activeButton, setActiveButton] = useState(1);

    useEffect(() => {
        let newData = []; 
        obraInfo.fotosObra.forEach((element)=>{
        newData.push({
            name:element.imagen,
            status:"done",
            url: `http://localhost:4000/api/uploads/obras/obra/${obraId}/${element.imagen}`,
            categoria:element.categoria
        })
        }) 

        setFileList(newData);
    }, [obraInfo]);

    const renderizarImagen = (imagen) =>{
        return <Image className="images-obra-vista" src={imagen.url}/>
    }
  
    const DataFiltrada = (categoria = "Todas") =>{
        let newData = [];
        obraInfo.fotosObra.forEach((element) => {
        if(element.categoria === categoria || categoria === "Todas"){            
        newData.push(
            {
                name:element.imagen,
                status:"done",
                url: `http://localhost:4000/api/uploads/obras/obra/${obraId}/${element.imagen}`,
                categoria:element.categoria
            }
        );
        }
        });

        return newData;
    }

    useEffect(() => {
    
        switch (activeButton) {
        case 1:
            //Categoria : Todas
            setFileList(DataFiltrada());
            break;

        case 2:
            //Categorias material
       
            setFileList(DataFiltrada("Material"));
            break;

        case 3: 
            //Categoria resultados
            setFileList(DataFiltrada("Resultados"));
        break;
    
        case 4:
            //Categorias en proceso
            setFileList(DataFiltrada("En proceso"));
            break;

        default:
            setFileList(DataFiltrada());
            break;
        }
    }, [activeButton]);
  
    const asignarClase = (value) =>{
        if(value === activeButton){
        return "primary"
        }
    }
  
        return (
        <>
        <p className="lead">Imagenes de la obra</p>
        <div className="d-flex justify-content-start gap-2 mb-3">
        <Button type={asignarClase(1)} onClick={()=> setActiveButton(1)}>Todas</Button>
        <Button type={asignarClase(2)} onClick={()=> setActiveButton(2)}>Material</Button>
        <Button type={asignarClase(3)} onClick={()=> setActiveButton(3)}>En proceso</Button>
        <Button type={asignarClase(4)} onClick={()=> setActiveButton(4)}>Resultados</Button>
        </div>
        {
            files.length > 0 
            ?
            <>
            <div className="d-flex flex-row wrap justify-content-start gap-3 imageGroup">
                <Image.PreviewGroup>
                {
                    files.map(element => {
                    return renderizarImagen(element);
                    })
                }
                </Image.PreviewGroup>
                </div>
            </>
            : <p>No hay ninguna imagen registrada aun con esa categoria!</p>
        }
        </>
    );
    };

    export default ImagenesObra;