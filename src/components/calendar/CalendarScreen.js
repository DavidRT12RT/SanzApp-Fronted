import React, { useEffect, useState } from 'react'
import {Calendar,momentLocalizer} from "react-big-calendar";//BigCalendar es un componente
import moment from "moment";
import "moment/locale/es";
import { uiOpenModal } from "../../actions/uiActions";
import { eventClearActiveEvent, eventStartLoading, setActive } from "../../actions/eventsActions";

//Estilos del calendario
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles.css";

import { messages } from "../../helpers/calendar-messages-es";

import {CalendarEvent} from "./CalendarEvent";
import { CalendarModal } from './CalendarModal';
import { AddNewFab } from "./AddNewFab";
import { DeleteEventFab } from "./DeleteEventFab";

import { useDispatch, useSelector} from 'react-redux';

moment.locale("es");

const localizer = momentLocalizer(moment);

//Lista de eventos



export const CalendarScreen = () => {

    const [lastView, setlastView] = useState( localStorage.getItem("lastView") || "month");

    const dispatch = useDispatch();
    //TODO : Leer del store los eventos

    const { events,activeEvent } = useSelector(store => store.calendar);
    const { uid } = useSelector(store => store.auth);

   

    useEffect(() => {
      dispatch(eventStartLoading());
    }, [dispatch]);
    


    const onDobleClick = (e) =>{
        //Modal
        dispatch(uiOpenModal());
    }

    const onSelect = (e) =>{
        console.log(e);
        dispatch(setActive(e));
    }

    const onViewChange = (e) =>{
        setlastView(e);
        localStorage.setItem("lastView",e);
    }

  //Funcion se lanaza por medio del componente calendar ya que pasamos la referencia de la función por los props
  const eventStyleGetter = (event,start,end,isSelected) =>{
      const style={
          backgroundColor:(uid === event.user._id) ? "#367CF7" : "#465660",
          borderRadius:"0px",
          opacity:0.8,
          display:"block",
          color:"white"
        }
      //Lo que regrese esta función es el estilo que le aplicara a ese evento en particular
      return {
          style
      }

  };

  const onSelectSlot = (e) =>{
      //Si solo hay un click en un slock limpio quito el active Event 
      dispatch(eventClearActiveEvent());
      //Si hay 2 clicks agrego un nuevo evento
      if (e.action === "doubleClick"){
        const start = moment(e.start).toDate();
        const end = moment(e.start).add(1,"hours").toDate();

        dispatch(setActive({
            title:"",
            notes:"",
            start,
            end
        }));
        dispatch(uiOpenModal());
      }
  }

  return (
    <div className='calendar-screen'>
      <Calendar
            localizer={localizer}
            events={events}
            startAccesor="start"
            endAccessor="end"
            messages={messages}
            eventPropGetter={eventStyleGetter}
            components={{event:CalendarEvent}}
            onView={onViewChange}
            view={lastView}
            onDoubleClickEvent={onDobleClick}
            onSelectEvent={onSelect}
            onSelectSlot={onSelectSlot}
            selectable={true}
        />
        <AddNewFab />
        {activeEvent && <DeleteEventFab />}
       
        <CalendarModal/>
    </div>
  )
}

