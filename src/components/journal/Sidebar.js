import { useDispatch, useSelector } from "react-redux";
import { startLogout } from "../../actions/authActions";
import {JournalEntries} from "./JournalEntries"

export const Sidebar = () =>{
    const dispatch = useDispatch();
    const state = useSelector(state => state);
    //Funcion del boton logout
    const handleLogout = (e) =>{
        console.log("Click!!!");
        e.preventDefault();
        console.log(state);
        
    }

    return (
        <aside className="journal__sidebar">
            <div className="journal__sidebar-navbar">
                <h3 className="mt-5">
                    <i className="far fa-moon"></i>
                    <span>David</span>
                </h3>
                <button className="btn" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div className="journal__new-entry">
                <i className="far fa-calendar-plus fa-5x"></i>
                <p className="mt-5">New Entry</p>
            </div>
            <JournalEntries />
        </aside>
    )
}
