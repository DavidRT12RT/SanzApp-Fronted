import './Footer.css'
import {Link} from "react-router-dom";


export const Footer = () =>{
    return (
        <section className="py-5 text-center container-fluid color-fondo marginSpecial"> 
            <div className="row py-lg-5">
                <div className="col-lg-6 col-md-8 mx-auto">
                    <img className="d-block mb-4 mx-auto" src={require('../assets/imgs/logoSanz.png')} alt="" width="100"/>
                    <h1 className="fw-light">Agenda una cita con uno de nuestros agentes</h1>
                    <p className="lead text-muted">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae ratione odit ducimus, nisi, quisquam nulla quos nihil labore magnam, vero quae minima quidem nesciunt asperiores enim aperiam autem consectetur vel!</p>
                    <p>
                    <Link to="/" className="btn btn-secondary mx-2">Ir de vuelta</Link>
                    <Link to="/" className="btn btn-warning mx-2">Agendar cita!</Link>
                    </p>
                </div>
            </div>
        </section> 
    );
}
