import React, { useEffect, useState } from 'react';
import { Comment, Avatar, Form, Button, List, Input, message } from 'antd';
import moment from 'moment';
import { useSelector } from 'react-redux';
const { TextArea } = Input;

const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={(props) => <Comment {...props} />}
        className="bg-body p-5"
    />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                Añadir comentario de la obra
            </Button>
        </Form.Item>
    </>
);

export const ComentariosObra = ({obraInfo,socket}) => {
    const [comments, setComments] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState('');
    //Conseguir el uid del empleado del store de redux
    const {uid:empleadoId,name} = useSelector(store => store.auth);
    const {_id:obraId} = obraInfo;

    useEffect(() => {
        setComments([...obraInfo.comentarios]);
    }, [obraInfo]);

    useEffect(() => {
        setComments([...obraInfo.comentarios]);
    }, []);
    
    

    const handleSubmit = () => {
        if (!value) return;
        setSubmitting(true);            
        setSubmitting(false);
        setValue('');
        const nuevoComentario = {                    
            author: name,
            avatar: `http://localhost:4000/api/uploads/usuarios/${empleadoId}`,
            content: value,
            datetime: moment().locale("es").format("LLLL")
        };
        nuevoComentario.obraId = obraId;
        socket.emit("añadir-comentario-a-obra",nuevoComentario,(confirmacion)=>{
            if(confirmacion.ok){
                message.success(confirmacion.msg);
                setComments([
                    ...comments,
                    nuevoComentario
                ]);
            }else{
                message.error(confirmacion.msg);
            }

        });
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <>
            {comments.length > 0 && <CommentList comments={comments} />}
            <Comment
                avatar={<Avatar src={`http://localhost:4000/api/uploads/usuarios/${empleadoId}`} alt="Han Solo" />}
                content={
                    <Editor
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        submitting={submitting}
                        value={value}
                    />
                }
            />
            <span>(Añadir un comentario de la obra , una opinion acerca de esta , sugerencia de como hacer un proceso,etc.)</span>
        </>
    )
}
