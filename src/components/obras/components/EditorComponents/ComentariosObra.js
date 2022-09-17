import React, { useEffect, useState } from 'react';
import { Comment, Avatar, Form, Button, List, Input, message, Divider } from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
const { TextArea } = Input;


const CommentList = ({comments,setIsComentarioRespondiendo}) => {
    return (
        <div className="d-flex justify-content-center align-items-center flex-column gap-3">
            {comments.map(comentario => (
                <div className="d-flex p-3 justify-content-center align-items-center flex-wrap row border bg-body w-100" key={comentario._id} id={comentario._id}>
                    <div className="col-12 col-lg-8">
                        <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mt-3 mt-lg-0">
                            <div className="d-flex flex-wrap align-items-center">
                                <Avatar src={`http://localhost:4000/api/uploads/usuarios/${comentario.autor.uid}`} style={{width:"60px",height:"60px"}}/>
                                <h1 className="titulo-descripcion ms-2" style={{fontSize:"20px"}}>{comentario.autor.nombre}</h1>
                            </div>
                            <h1 className="titulo-descripcion text-muted">{comentario.fecha}</h1>
                        </div>
                        <p className="descripcion mt-3">{comentario.contenido}</p>
                        <div className="d-flex justify-content-end align-items-center">
                            <Button type="primary" icon={<PlusOutlined />} onClick={()=>{setIsComentarioRespondiendo({estado:true,respondiendo:comentario});document.getElementById("editor").scrollIntoView()}}>Responder</Button>
                        </div>
                    </div>

                    {comentario.respuestas.length > 0 && (
                        <>
                            <div className="d-flex justify-content-center align-items-center flex-column gap-4">
                                <Divider/>
                                <div className="d-flex justify-content-start align-items-center flex-wrap gap-2">
                                    <ArrowRightOutlined />
                                    <h1 className="titulo text-primary" style={{fontSize:"15px"}}>Respuestas del comentario: {comentario.respuestas.length}</h1>
                                </div>
                                {comentario.respuestas.map(respuesta => (
                                    <div className="p-3 row border" style={{width:"90%"}} key={respuesta._id}>
                                        <Avatar src={`http://localhost:4000/api/uploads/usuarios/${comentario.autor.uid}`} style={{width:"60px",height:"60px"}}/>
                                        <div className="col-12 col-lg-8">
                                            <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mt-3 mt-lg-0">
                                                <h1 className="titulo-descripcion ms-2" style={{fontSize:"20px"}}>{comentario.autor.nombre}</h1>
                                                <h1 className="titulo text-success" style={{fontSize:"15px"}}>{respuesta.fecha}</h1>
                                            </div>
                                            <p className="descripcion">{respuesta.contenido}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    )
}

const Editor = ({ onChange, onSubmit, submitting, value,isComentarioRespondiendo,setIsComentarioRespondiendo}) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} id="editor"/>
        </Form.Item>
        {isComentarioRespondiendo.estado === true 
            ? 
             <div className="d-flex justify-content-start align-items-center gap-2">
                <Button loading={submitting} onClick={onSubmit} type="primary">Anadir respuesta a {isComentarioRespondiendo.respondiendo.autor.nombre}</Button>
                <Button type="primary" danger onClick={()=>{setIsComentarioRespondiendo({estado:false,respondiendo:null})}}>Dejar de responder</Button>
             </div>
            :
            <Form.Item>
                <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                    Añadir comentario de la obra
                </Button>
            </Form.Item>
        }
    </>
);

export const ComentariosObra = ({obraInfo,socket}) => {
    const [comments, setComments] = useState([]);
    const [isComentarioRespondiendo, setIsComentarioRespondiendo] = useState({estado:false,respondiendo:null});
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    //Conseguir el uid del empleado del store de redux
    const {uid:empleadoId,name} = useSelector(store => store.auth);
    const {_id:obraId} = obraInfo;

    useEffect(() => {
        obraInfo.comentarios.map(comentario => comentario.key = comentario._id);
        setComments([...obraInfo.comentarios]);
    }, [obraInfo]);


    const handleSubmit = () => {
        if (!value) return;
        setSubmitting(true);            
        const nuevoComentario = {                    
            autor: uid,
            contenido: value,
            fecha: moment().locale("es").format("LLLL"),
            obraId
        };
        if(isComentarioRespondiendo.estado) nuevoComentario.respondiendo = isComentarioRespondiendo.respondiendo._id

        socket.emit("añadir-comentario-a-obra",nuevoComentario,(confirmacion)=>{
            if(confirmacion.ok){
                message.success(confirmacion.msg);
                /*
                setComments([
                    ...comments,
                    nuevoComentario
                ]);
                */
            }else{
                message.error(confirmacion.msg);
            }

        setSubmitting(false);
        setValue('');
        });
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const { uid } = useSelector(store => store.auth);
    return (
        <div className="p-5" style={{minHeight:"100vh"}}>
            <h1 className="titulo">Observaciones ({comments.length})</h1>
            <Divider/>
            {comments.length === 0 ? <p className="descripcion text-danger text-center">Ningun comentario u observacion registrada en la obra...</p>:  <CommentList setIsComentarioRespondiendo={setIsComentarioRespondiendo} comments={comments} />}
            <Divider/>
            <Comment
                className={comments.length > 0 && "mt-3"}
                avatar={<Avatar src={`http://localhost:4000/api/uploads/usuarios/${empleadoId}`}/>}
                content={
                    <Editor
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        value={value}
                        isComentarioRespondiendo={isComentarioRespondiendo}
                        setIsComentarioRespondiendo={setIsComentarioRespondiendo}
                    />
                }
            />
        </div>
    )
}
