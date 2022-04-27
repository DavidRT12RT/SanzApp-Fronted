import React from 'react'
import ReactDOM  from 'react-dom';
import { useDispatch } from 'react-redux';
import { uistartLoading, uiStopLoading } from '../../actions/uiActions';
import {useForm} from "../../hooks/useForm";
import {confirmation} from "../../alerts/botons";

import { crearObra } from '../../helpers/crearObra';

import "./assets/style.css";



export const ObrasModalForm = ({open, children , onClose}) => {

  const [formValues,handleInputChange] = useForm({
    titulo:"Nombre de la obra / servicio",
    tipoReporte:"Seleccionar",
    direccionRegional:"",
    plaza:"",
    sucursal:"",
    numeroTrack:"",
    descripcion:"",
    trabajosEjecutados:"",
    observaciones:"",
    observacionUsuario:"",
  });



  const { titulo,tipoReporte,direccionRegional,plaza,sucursal,numeroTrack,descripcion,trabajosEjecutados,observaciones,observacionUsuario } = formValues;

  
  const dispatch = useDispatch();


  const handleSubmit = async (e) =>{
    e.preventDefault();
    //Llamar form Validation
    dispatch(uistartLoading());
    try{
      await confirmation("Se creara una obra con los siguientes aspectos")
      crearObra(formValues);
      onClose();
    }catch(error){
      console.log(error);
      onClose();
    }
      

}

  if(!open) return null;
  const fechaHoy = new Date().toString();

  
  return ReactDOM.createPortal(
    <>
    <div className='overlay'>
    <section className="bg-light alturaPagina estilosModal rounded shadow">
    <button className="btn btn-warning" onClick={onClose}>Cancelar</button>

      <div className="container">
      <div className='py-5 text-center'>
        <img src={require('./assets/logoSanz.png')} alt="Sanz Logo" className='logoSanz mb-4 d-block mx-auto'/>
        <h2>Crear nueva hoja de reporte</h2>
        <p className='lead'>Crear una nueva hoja de reporte de servicio en base a los siguientes aspectos y ir al editor de Obras!</p> 
        </div>
      </div>


      <div className='container'>
        <h4 className='mb-3'>Datos del servicio</h4>
        <small>Fecha: {fechaHoy}</small>
        <hr className='my-4'></hr>
        <form action="" onSubmit={handleSubmit}>
          <div className='row g-3 mt-3'>

            <div className='col-sm-6'>
              <label className='form-label'>Nombre de la obra / remodelación</label>
              <input type="text" className="form-control" name="titulo" value={titulo} onChange={handleInputChange} placeholder='Obra de mantenimiento para Santander...' required></input>
            </div>

            <div className='col-6'>
              <label className='form-label'>Tipo de reporte</label>
              <select name="tipoReporte" className='form-control' value={tipoReporte} onChange={handleInputChange} >
                <option>Seleccionar...</option>
                <option>Preventivo</option>
                <option>Correctivo</option>
              </select>
            </div>

            <div className='col-sm-6'>
              <label className='form-label'>Dirección reginal</label>
              <input type="text" name="direccionRegional" value={direccionRegional} onChange={handleInputChange} className="form-control" placeholder='' required></input>
            </div>


            <div className='col-sm-6'>
              <label className='form-label'>Plaza</label>
              <input type="text" name="plaza" value={plaza} onChange={handleInputChange} className="form-control" placeholder='' required></input>
            </div>

            <div className='col-sm-6'>
              <label className='form-label'>Sucursal</label>
              <input type="text" name="sucursal" value={sucursal} onChange={handleInputChange} className="form-control" placeholder='' required></input>
            </div>

            <div className='col-sm-6'>
              <label className='form-label'>No. de Track</label>
              <input type="text" name="numeroTrack" value={numeroTrack} onChange={handleInputChange} className="form-control" placeholder='' required></input>
            </div>

            <div className='col-12'>
              <label className='form-label'>Descripción del reporte de servicio</label>
              <textarea type="text" name="descripcion" value={descripcion} onChange={handleInputChange} className="form-control input-large" placeholder='' required></textarea> 
            </div>

            <div className='col-6'>
              <label className='form-label'>Trabajos ejecutados</label>
              <textarea type="text" name="trabajosEjecutados" value={trabajosEjecutados} onChange={handleInputChange}className="form-control input-large" placeholder='Lista de trabajos ejecutados...' required></textarea> 
            </div>

            <div className='col-6'>
              <label className='form-label'>Observaciones</label>
              <textarea type="text" name="observaciones" value={observaciones} onChange={handleInputChange} className="form-control input-large" placeholder='Lista de observaciones...' required></textarea> 
            </div>
           

            <div className='col-12'>
              <label className='form-label'>Observaciones del usuario</label>
              <textarea type="text"  name="observacionUsuario" value={observacionUsuario} onChange={handleInputChange} className="form-control input-large" placeholder='Observaciones del usuario' required></textarea> 
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