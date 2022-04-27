import React,{useState} from 'react'

import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from "moment";
import {useForm} from "../../hooks/useForm";
import {error} from "../../alerts/botons";
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/uiActions';
import { eventAddNew } from '../../actions/eventsActions';



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

export const CalendarModal = () => {
   
    
    const [dateStart, setdateStart] = useState(now.toDate());
    const [dateEnd, setdateEnd] = useState(nowPlus1.toDate());
    const [titleisValid, setTitleisValid] = useState(true);

    //Sacar información del store
    const {modalOpen} = useSelector(store => store.ui);
    
    //Custom Hooks for the form
    const [ values,handleInputChange,setValues ] = useForm({
        title:"Evento",
        notes:"",
        start:now.toDate(),
        end:nowPlus1.toDate()
    });

    const {notes,title,start,end} = values;


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
            return error("La fecha inicial no puede ser superior a la final!");
        }
        if(title.trim().length < 2){
            return setTitleisValid(false);
        }

        //TODO:Realizar grabación en DB
        dispatch(eventAddNew({
            ...values,
            id:new Date().getTime(),
            user:{
                _id:123,
                name:"Fernando"}
            }));

        setTitleisValid(true);
        closeModal();
    }

    const dispatch = useDispatch();

    const closeModal = () =>{
        //TODO: Cerrar el modal
        dispatch(uiCloseModal());
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
        <h1>Nuevo evento</h1>
        <hr/>
        <form className="container" onSubmit={handleSubmitForm}>
            <div className="form-group">
                <label>Fecha y hora inicio</label>
                <DateTimePicker onChange={handleStartDateChange} value={dateStart} className="form-control"/>
            </div>
            <div className="form-group mt-3">
                <label>Fecha y hora fin</label>
                <DateTimePicker onChange={handleEndDateChange} value={dateEnd} minDate={dateStart} className="form-control"/>
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
