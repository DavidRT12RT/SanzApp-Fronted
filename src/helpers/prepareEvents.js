import moment from "moment"
//Pasar el string start y end a una fecha con moment
export const prepareEvents = (events = []) =>{
    return events.map(e => ({
        ...e,
        end:moment(e.end).toDate(),
        start:moment(e.start).toDate(),
    }));
}