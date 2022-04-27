import React, { useState } from 'react'
import {Calendar,momentLocalizer} from "react-big-calendar";//BigCalendar es un componente
import moment from "moment";
import "moment/locale/es";
import { uiOpenModal } from "../../actions/uiActions";
import { setActive } from "../../actions/eventsActions";

//Estilos del calendario
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./styles.css";

import { messages } from "../../helpers/calendar-messages-es";

import {CalendarEvent} from "./CalendarEvent";
import { CalendarModal } from './CalendarModal';
import { AddNewFab } from "./AddNewFab";

import { useDispatch} from 'react-redux';

moment.locale("es");

const localizer = momentLocalizer(moment);

//Lista de eventos

const events=[{
    title:"Cumpleaños del jefe",
    start:moment().toDate(),
    end:moment().add(2,"hours").toDate(),
    bgcolor:"#fafafa",
    notes:"Compras pastel",
    user:{
        uid:"123", 
        name:"David"
    }
}];



export const CalendarScreen = () => {

    const [lastView, setlastView] = useState( localStorage.getItem("lastView") || "month");

    const dispatch = useDispatch();

    const onDobleClick = (e) =>{
        //Modal
        dispatch(uiOpenModal());
    }

    const onSelect = (e) =>{
        dispatch(setActive(e));
        dispatch(uiOpenModal());
    }

    const onViewChange = (e) =>{
        setlastView(e);
        localStorage.setItem("lastView",e);
    }

  //Funcion se lanaza por medio del componente calendar ya que pasamos la referencia de la función por los props
  const eventStyleGetter = (event,start,end,isSelected) =>{
      const style={
          backgroundColor:"#367CF7",
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

  return (
    <div className='calendar-screen mt-3'>
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
        />
        <AddNewFab />
        <CalendarModal/>
    </div>
  )
}

