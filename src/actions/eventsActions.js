import { error } from "../alerts/botons";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";


export const startAddNew = (event)=>{
    return async (dispatch,getState) =>{
        const {uid,name} = getState().auth;
        const resp = await fetchConToken("/events",event,"POST");
        console.log(resp);
        const body = await resp.json();
        try {
            if(resp.status == 200){
                event.id = body.id;
                event.user = {_id:uid,name:name};
                dispatch(eventAddNew(event));
            }else{
                error("error al grabar el evento en la Base de datos");
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}

const eventAddNew = (event) =>({
    type:types.eventAddNew,
    payload:event
});

export const setActive = (event) =>({
    type:types.eventSetActive,
    payload:event
});


export const eventClearActiveEvent = () =>({
    type:types.eventClearActiveEvent
});


export const startEventUpdated = (event) => {
    return async(dispatch) => {
        try {
            
            const resp = await fetchConToken(`/events/${event.id}`,event,"PUT");
            const body = await resp.json();
            if(resp.status == 200){
                dispatch(eventUpdated(event));
            }else{
                console.log(body);
                error(body.msg);
            }
        } catch (error) {
            console.log(error);
            error("Error al momento de actualizar");
        }
    }
}
const eventUpdated = (event) =>({
    type:types.eventUpdated,
    payload:event
});


export const startEventDeleted = (id) =>{
    return async(dispatch) => {
        try {
            const resp = await fetchConToken(`/events/${id}`,{},"DELETE"); 
            const body = await resp.json();
            if(resp.status == 200){
                dispatch(eventDeleted());
            }else{
                error(body.msg);
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}

const eventDeleted = () =>({
    type:types.eventDeleted
});



export const eventStartLoading =  () =>{
    return async (dispatch) =>{
        try {
            const resp = await fetchConToken("/events"); 
            const body = await resp.json();
            if(resp.status == 200){
                //Pasamos todos los eventos por la función para transformarlos sus fechas en tipo Date 
                const events = prepareEvents(body.eventos);
                dispatch(eventLoaded(events));
            }else{
                return 
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}

const eventLoaded = (events) =>({
    type:types.eventLoaded,
    payload:events
});

export const eventLogout = () =>({
    type:types.eventLogout
});