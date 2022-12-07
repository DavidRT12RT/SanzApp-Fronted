import React,{useEffect, useState} from 'react'
import { message } from 'antd';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import { eventClearActiveEvent, startAddNew, startEventUpdated } from '../../../actions/eventsActions';
import { uiCloseModal } from '../../../actions/uiActions';
import { useForm } from '../../../hooks/useForm';

//Estilos CSS
import "./styles.css";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};


Modal.setAppElement("#root");//El id del index.html

const now =  moment().minutes(0).seconds(0).add(1,"hours");
const nowPlus1 = now.clone().add(1,"hours");

const initEvent = {
                title:"",
                notes:"",
                start:now.toDate(),
                end:nowPlus1.toDate()
};

export const CalendarModal = () => {
    
    //Sacar información del store
    const {activeEvent} = useSelector(store => store.calendar);
    const {modalOpen} = useSelector(store => store.ui);
    const dispatch = useDispatch();

    const [dateStart, setdateStart] = useState(now.toDate());
    const [dateEnd, setdateEnd] = useState(nowPlus1.toDate());
    const [titleisValid, setTitleisValid] = useState(true);
    const [ values,handleInputChange,setValues ] = useForm(initEvent);
    
    

    const {notes,title,start,end} = values;
  
    


    useEffect(() => {
        if(activeEvent){
            setValues(activeEvent);
        }else{
            setValues(initEvent);
        }
    }, [activeEvent,setValues]);
    

    const handleStartDateChange = (e) =>{
        setdateStart(e);
        setValues({
            ...values,
            start:e
        });
    }

    const handleEndDateChange = (e) =>{
        setdateEnd(e);
        setValues({
            ...values,
            end:e
        })
    }

    const handleSubmitForm = (e) =>{
        e.preventDefault();
        const momentStart = moment(start);
        const momentEnd = moment(end);
        if(momentStart.isSameOrAfter(momentEnd)) {
            return message.error("La fecha inicial no puede ser superior a la final!");
        }
        if(title.trim().length < 2){
            return setTitleisValid(false);
        }

        if(activeEvent){
            dispatch(startEventUpdated(values));

        }else{
            dispatch(startAddNew(values));
        }

        setTitleisValid(true);
        closeModal();
    }

  

    const closeModal = () =>{
        //TODO: Cerrar el modal
        dispatch(uiCloseModal());
        dispatch(eventClearActiveEvent());
        setValues(initEvent);
    }

    return (
    <Modal
        isOpen={modalOpen}
        //onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={ customStyles }
        closeTimeoutMS = {200}
        className="modal"
        overlayClassName="modal-fondo"
      >
        
        <button className="btn btn-danger position-absolute top-0 end-0 px-3" onClick={closeModal}>X</button>
        <h1 className="text-center col-12">{activeEvent ? "Editar evento" : "Nuevo evento"}</h1>
        <hr/>
        <form className="container" onSubmit={handleSubmitForm}>
            <div className="form-group">
                <label>Fecha y hora inicio</label>
                <DateTimePicker onChange={handleStartDateChange} value={dateStart} className="form-control"/>
            </div>
            <div className="form-group mt-3">
                <label>Fecha y hora fin</label>
                <DateTimePicker onChange={handleEndDateChange} value={dateEnd}  minDate={dateStart} className="form-control"/>
            </div>
            <hr />
            <div className="form-group">
                <label>Titulo y notas</label>
                <input 
                    type="text" 
                    className={`form-control ${!titleisValid && 'is-invalid'}`}
                    placeholder="Título del evento"
                    name="title"
                    value={title}
                    onChange={handleInputChange}
                    autoComplete="off"
                />
                <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
            </div>

            <div className="form-group mt-3">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={notes}
                    onChange={handleInputChange}
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
            </div>
            <button
                type="submit"
                className="btn btn-outline-warning w-100"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>
        </form> 
    </Modal>
  )
}
