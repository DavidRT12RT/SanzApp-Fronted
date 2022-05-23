import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SocketContext } from '../../context/SocketContext';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export const EditorObra = () => {

    const {obraId} = useParams();
    const { socket } = useContext(SocketContext);
    const [obraInfo, setObraInfo] = useState({});
    const [materiales, setMateriales] = useState([]);
    const [observaciones,setObservaciones] = useState([]);

    //Solicitando obra por id
    useEffect(()=>{
        socket.emit("obtener-obra-por-id",{obraId},(obra)=>{
        setObraInfo(obra);
        setMateriales([...obra.materialUtilizado]);
        setObservaciones([...obra.observaciones]);
        });
    },[]);


    const reorder = (list, startIndex, endIndex) => {
        const result = [...list];
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const handleDragEnd = (result) =>{
        const { source,destination } = result;
        if(!destination){
            return;
        }

        if(source.index === destination.index && source.droppableId === destination.droppableId){
            return;
        }
        if(result.source.droppableId === "materiales"){

            console.log("Entre! mal");
            return setMateriales(materiales => reorder(materiales,source.index,destination.index));
        }else if(result.source.draggableId === "observaciones"){
            console.log("Entre!");
            setObservaciones(observaciones => reorder(observaciones,source.index,destination.index));
        }
        
    }

    const handleObservacion = () => {
        setObservaciones(observaciones => [...observaciones,{Titulo:"Nueva observacion",observacion:"Ojala esto funcione",trabajador:"Alguien",_id:"2323"}]);
    }
    if(obraInfo === undefined){
        return <h1>Loading...</h1>
    }else{
        return (
            <DragDropContext onDragEnd={handleDragEnd}>
                <div className='app row mt-5'>
                    <div className='col-3'>
                        <Droppable droppableId='materiales' >

                            {(droppableProvided) =>
                            <>
                            <ul 
                                {...droppableProvided.droppableProps} 
                                ref={droppableProvided.innerRef} 
                                {...droppableProvided.dragHandleProps}
                                className="task-container"
                            > 

                                <p className="lead">Materiales utilizados</p>
                                {materiales.map((material,index) => (
                                    <Draggable key={material._id} draggableId={material._id} index={index}>
                                        {(draggableProvided)=>(
                                            <>
                                            <li 
                                                {...draggableProvided.draggableProps} 
                                                ref={draggableProvided.innerRef} 
                                                {...draggableProvided.dragHandleProps} 
                                                className="task-item"
                                            >
                                                <div class="card">
                                                    <div class="card-header">
                                                        material
                                                    </div>
                                                    <div class="card-body">
                                                        <h5 class="card-title">Titulo</h5>
                                                        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                                                    </div>
                                                </div>                                               
                                            </li>
                                        </>
                                            )}
                                    </Draggable>
                                ))}

                                {droppableProvided.placeholder}
                            </ul>
                            </>
                            }
                        </Droppable>
                </div>

                    <div className='col-3'>
                        <Droppable droppableId="observaciones" >

                            {(droppableProvided) =>
                            <>
                            <ul 
                                {...droppableProvided.droppableProps} 
                                ref={droppableProvided.innerRef} 
                                {...droppableProvided.dragHandleProps}
                                className="task-container"
                            > 

                                <p className="lead">Observaciones</p>
                                {observaciones.map((observacion,index) => (
                                    <Draggable key={observacion._id} draggableId={observacion._id} index={index}>
                                        {(draggableProvided)=>(
                                            <>
                                            <li 
                                                {...draggableProvided.draggableProps} 
                                                ref={draggableProvided.innerRef} 
                                                {...draggableProvided.dragHandleProps} 
                                                className="task-item"
                                            >
                                                <div class="card">
                                                    <div class="card-header">
                                                        {observacion.trabajador}
                                                    </div>
                                                    <div class="card-body">
                                                        <h5 class="card-title">{observacion.Titulo}</h5>
                                                        <p class="card-text">{observacion.observacion}</p>
                                                    </div>
                                                </div>                                               
                                            </li>
                                        </>
                                            )}
                                    </Draggable>
                                ))}

                                {droppableProvided.placeholder}
                                <button className="btn btn-primary" onClick={handleObservacion}>Agregar</button>
                            </ul>
                            </>
                            }
                        </Droppable>
                </div>
            </div>
            </DragDropContext>
        )
    }
}



/* Notas de react beautiful dnd

    1.-droppableId = el id para identificar una sección unica,
    Si tenemos varias areas deberiamos tener varios id para cada una 
*/