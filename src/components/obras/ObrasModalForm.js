import React from 'react'
import ReactDOM  from 'react-dom';

import "./assets/style.css";



export const ObrasModalForm = ({open, children , onClose}) => {
  if(!open) return null;
  const fechaHoy = new Date().toString();
  
  return ReactDOM.createPortal(
    <>
    <div className='overlay'>
    <section className="bg-light alturaPagina estilosModal rounded shadow">

      <div className="container">
      <div className='py-5 text-center'>
        <img src={require('./assets/logoSanz.png')} alt="Sanz Logo" className='logoSanz mb-4 d-block mx-auto'/>
        <h2>Crear nueva hoja de reporte</h2>
        <p className='lead'>Crear una nueva hoja de reporte de servicio en base a los siguientes aspectos y ir al editor de Obras!</p> 
        <button className="btn btn-warning" onClick={onClose}>Cerrar</button>
        </div>
      </div>


      <div className='container'>
        <h4 className='mb-3'>Datos del servicio</h4>
        <small>Fecha: {fechaHoy}</small>
        <hr className='my-4'></hr>
        <form action="">
          <div className='row g-3 mt-3'>

            <div className='col-sm-6'>
              <label className='form-label'>Nombre de la obra / remodelación</label>
              <input type="text" className="form-control" placeholder='Obra de mantenimiento para Santander...' required></input>
            </div>


            <div className='col-6'>
              <label className='form-label'>Tipo de reporte</label>
              <select className='form-control'>
                <option value="australia">Seleccionar...</option>
                <option value="australia">Preventivo</option>
                <option value="australia">Correctivo</option>
              </select>
            </div>

            <div className='col-sm-6'>
              <label className='form-label'>Dirección reginal</label>
              <input type="text" className="form-control" placeholder='' required></input>
            </div>


            <div className='col-sm-6'>
              <label className='form-label'>Plaza</label>
              <input type="text" className="form-control" placeholder='' required></input>
            </div>

            <div className='col-sm-6'>
              <label className='form-label'>Sucursal</label>
              <input type="text" className="form-control" placeholder='' required></input>
            </div>

            <div className='col-sm-6'>
              <label className='form-label'>No. de Track</label>
              <input type="text" className="form-control" placeholder='' required></input>
            </div>

            <div className='col-12'>
              <label className='form-label'>Descripción del reporte de servicio</label>
              <textarea type="text" className="form-control input-large" placeholder='' required></textarea> 
            </div>

            <div className='col-6'>
              <label className='form-label'>Trabajos ejecutados</label>
              <textarea type="text" className="form-control input-large" placeholder='Lista de trabajos ejecutados...' required></textarea> 
            </div>

            <div className='col-6'>
              <label className='form-label'>Observaciones</label>
              <textarea type="text" className="form-control input-large" placeholder='Lista de observaciones...' required></textarea> 
            </div>
           

            <div className='col-12'>
              <label className='form-label'>Observaciones del usuario</label>
              <textarea type="text" className="form-control input-large" placeholder='Observaciones del usuario' required></textarea> 
            </div>

            

          <hr className="my-4"></hr>

          <button className='btn btn-warning btn-lg btn-block'>Crear obra!</button>
          </div>
        </form>
      </div>
    </section>
    </div>
    </>,document.getElementById('portal')
  )
}