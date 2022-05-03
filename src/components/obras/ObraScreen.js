import React from 'react'
import { useParams } from 'react-router-dom'
import { fetchConToken } from '../../helpers/fetch';

import "./assets/style.css";

export const ObraScreen = () => {
  const {obraId} = useParams();
  const imagePath = "https://sanzconstructora.com/SanzInicio/PROYECTOALFA/img/image1.png";

  fetchConToken(`/obras/${obraId}`,{},"GET")
    .then(resp => {console.log(resp)});

  return (
    <div className="container mt-5">

      <section className="rounded shadow">

        <div className="container">
        <div className='py-5 text-center'>
          <img src={require('./assets/logoSanz.png')} alt="Sanz Logo" className='logoSanz mb-4 d-block mx-auto'/>
          <h2>Información sobre la obra / servicio</h2>
          </div>
        </div>

        <div className='container'>
          <small>Fecha: {new Date().getTime()}</small>
          <hr className='my-4'></hr>
            <div className='row g-3 mt-3'>

              <div className='col-sm-6'>
                <label className='form-label'>Nombre de la obra</label>
                <input type="text" className="form-control" name="titulo" placeholder='Obra de mantenimiento para Santander...' required></input>
              </div>

              <div className='col-sm-6'>
                <label className='form-label'>Tipo de reporte</label>
                <select name="tipoReporte" className='form-control' >
                  <option>Seleccionar...</option>
                  <option>Preventivo</option>
                  <option>Correctivo</option>
                </select>
              </div>

              <div className='col-sm-6'>
                <label className='form-label'>Dirección reginal</label>
                <input type="text" name="direccionRegional" className="form-control" placeholder='' required></input>
              </div>


              <div className='col-sm-6'>
                <label className='form-label'>Plaza</label>
                <input type="text" name="plaza"  className="form-control" placeholder='' required></input>
              </div>

              <div className='col-sm-6'>
                <label className='form-label'>Sucursal</label>
                <input type="text" name="sucursal" className="form-control" placeholder='' required></input>
              </div>

              <div className='col-sm-6'>
                <label className='form-label'>No. de Track</label>
                <input type="text" name="numeroTrack" className="form-control" placeholder='' required></input>
              </div>

              <div className='col-12'>
                <label className='form-label'>Descripción del reporte de servicio</label>
                <textarea type="text" name="descripcion" className="form-control input-large" placeholder='' required></textarea> 
              </div>

              <div className='col-6'>
                <label className='form-label'>Trabajos ejecutados</label>
                <textarea type="text" name="trabajosEjecutados" className="form-control input-large" placeholder='Lista de trabajos ejecutados...' required></textarea> 
              </div>

              <div className='col-6'>
                <label className='form-label'>Observaciones</label>
                <textarea type="text" name="observaciones"  className="form-control input-large" placeholder='Lista de observaciones...' required></textarea> 
              </div>
           

              <div className='col-12'>
                <label className='form-label'>Observaciones del usuario</label>
                <textarea type="text"  name="observacionUsuario" className="form-control input-large" placeholder='Observaciones del usuario' required></textarea> 
              </div>

            

              <hr className="my-4"></hr>

              <button className='btn btn-warning btn-lg btn-block mb-2'>Crear obra!</button>
              </div>
        </div>
      </section>
        </div>
      
  )
}
