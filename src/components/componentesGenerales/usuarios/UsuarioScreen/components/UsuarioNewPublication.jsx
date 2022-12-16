import { Avatar, Divider, message, Modal, Upload } from 'antd'
import React, { useState } from 'react'
import { useForm } from '../../../../../hooks/useForm';

//Iconos
import { BookmarkPlusFill, FlagFill, Images, MegaphoneFill, Newspaper } from 'react-bootstrap-icons';
import { InboxOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { fetchConTokenSinJSON } from '../../../../../helpers/fetch';

//TEST
import moment from "moment";
import 'moment/locale/es';
moment.locale('es');

//Componentes extra
const { Dragger } = Upload;
const { confirm } = Modal;



//Solucion!
const fecha = "jueves, 15 de diciembre de 2022 22:39";
console.log("Diferencia: ",moment(fecha,"LLLL").fromNow());


const UsuarioNewPublication = ({userInfo}) => {

    const initialStateModal = {
        estado:false,
        tipoPublicacion:false,
        fotos:false
    };

    //Modal de la publicacion
    const [isModalVisible, setIsModalVisible] = useState(initialStateModal);

    const initialStateForm = {
        descripcion:"",
        tipoPublicacion:"normal"
    };

    //Formulario de la publicacion
    const [values,handleInputChange,setValues] = useForm(initialStateForm);
    //Archivos de la publicacion
    const [filesList, setFilesList] = useState([]);


    /*
    Por alguna razon react realiza este codigo de forma no optima
    if(document.readyState === "complete"){
        const element = document.getElementById("form");
        const handleAddNewPublic = (e) => {
            e.preventDefault();
            const publicationOfUser = (e.target[0].value);
            console.log(publicationOfUser);
            return message.info("Trabajando en ello...");
        }
        if(element != null) element.addEventListener("submit",handleAddNewPublic)
    }
    */

    const handleAddNewPublic = () => {
	    confirm({
            title:"¿Seguro quieres publicar esto?",
            icon:<ExclamationCircleOutlined />,
            content:"Los demas usuarios podran reaccionar y ver tu publicacion",
			okText:"Publicar!",
			cancelText:"Volver atras",
            async onOk(){
                //Comprobacion que la publicacion no este vacia

                if(values.descripcion.length < 5)  return message.error("Publicacion NO tiene descripcion");

                const formData = new FormData();

                //Valores publicacion
                for(const property in values) formData.append(property,values[property]);
                //Archivos
                for(const foto of filesList) formData.append(foto.name,foto);

                const resp = await fetchConTokenSinJSON("/publicaciones",formData,"POST");
                const body = await resp.json();
                
                if(resp.status != 201) return message.error(body.msg);


                //PUBLICACION REGISTRADA CON EXITO!
                setValues(initialStateForm);//Regresando los valores a su estado original 
                setFilesList([]);//Borrando todos los archivos que se subieron
                setIsModalVisible(initialStateModal);
                return message.success(body.msg);
            }
        });
    }


    const changeStateOfModal = (tipo = "estado") => {

        if(typeof(tipo) != "string") tipo = "estado";
        setIsModalVisible((state) => (
            {
                ...state,
                estado:!state.estado,
                [tipo]:!state[tipo]
            }
        ))
    }
    

    const propsDragger = {
        multiple:true,
        onRemove:file => {
            const newFiles = filesList.filter(fileOnState => fileOnState.name != file.name);
            setFilesList(newFiles);
        },
        beforeUpload:file => {
            const extensionesDisponibles = ["image/png","image/jpeg","image/jpg"];
            if(!extensionesDisponibles.includes(file.type)) return message.error("Tipo de archivo NO permitido para esta funcion");
            setFilesList(files => [...files,file]);
            return false;
        },
        listType:"picture",
        fileList:filesList
    };

    console.log();
    return (            
        <>
            <div className="newPublicUserContainer" id="form" onSubmit={handleAddNewPublic}>
                <Avatar size={40} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${userInfo.uid}/fotos/?tipo=perfil`} />
                <input className="form-control descripcion bg-light" placeholder="¿Qué estás pensando?" onClick={changeStateOfModal}/>
                <Divider style={{margin:"0px"}}/>
                <button type="primary" className="btnPublicUser descripcion" onClick={() => {changeStateOfModal("fotos")}}><span className="me-2"><Images/></span>Foto</button>
                <button type="primary" className="btnPublicUser descripcion" onClick={() => {changeStateOfModal("tipoPublicacion")}}><span className="me-2"><FlagFill/></span>Tipo de publicacion</button>
            </div>

            <Modal visible={isModalVisible.estado} onCancel={changeStateOfModal} onOk={changeStateOfModal} footer={null}>
                <h1 className="titulo-descripcion">Crear publicación</h1>
                <Divider/>
                <div className="d-flex justify-content-start align-items-start gap-2">
                    <Avatar size={40} src={`${process.env.REACT_APP_BACKEND_URL}/api/usuarios/${userInfo.uid}/fotos/?tipo=perfil`} />
                    <div>
                        <h1 className="titulo-descripcion">{userInfo.nombre}</h1>
                        {userInfo.rol}
                    </div>
                </div>
                <textarea className="form-control descripcion w-100 mt-3" rows={8} placeholder="¿Qué estás pensando?" name="descripcion" value={values.descripcion} onChange={handleInputChange}/>
                {isModalVisible.fotos && (
                    <>
                        <h1 className="titulo-descripcion mt-4">Imagenes de la publicacion:</h1>
                        <Dragger {...propsDragger} className="mt-3">
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined className="text-warning"/>
                            </p>
                            <p className="ant-upload-text ">Click o arrastra a esta area para agregar fotos a la publicacion</p>
                        </Dragger>
                    </>
                )}
                {
                    isModalVisible.tipoPublicacion && (
                        <>
                            <h1 className="titulo-descripcion mt-4">Tipo de publicacion:</h1>
                            <div className="containerTiposPublicacion">
                                <button type="primary" className={"btnTypeOfPublic descripcion " + (values.tipoPublicacion == "normal" && "bg-warning")} onClick={() => setValues((values) => ({...values,tipoPublicacion:"normal"}))}><span className="me-2"><BookmarkPlusFill/></span>Normal</button>
                                <button type="primary" className={"btnTypeOfPublic descripcion " + (values.tipoPublicacion == "anuncio" && "bg-warning")} onClick={() => setValues((values) => ({...values,tipoPublicacion:"anuncio"}))}><span className="me-2"><MegaphoneFill/></span>Anuncio</button>
                                <button type="primary" className={"btnTypeOfPublic descripcion " + (values.tipoPublicacion == "noticias" && "bg-warning")} onClick={() => setValues((values) => ({...values,tipoPublicacion:"noticias"}))}><span className="me-2"><Newspaper/></span>Noticia</button>
                            </div>
                        </>
                    )
                }
                <div className="row">
                    <button type="primary" className="btn btn-warning mt-3" onClick={handleAddNewPublic}>Publicar</button>
                </div>
            </Modal>
        </>
    )
}

export default UsuarioNewPublication