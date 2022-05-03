import React from 'react';
import { InformacionProducto } from './components/InformacionProducto';
import { Registros } from './components/Registros';
import 'antd/dist/antd.css';
import { ProductoImagen } from './components/ProductoImagen';





export const ProductoScreen = () => {
    return (
        <div className='container mt-5 p-5 shadow rounded'>

            <div className="row">
               <div className="col-lg-9 col-sm-12 ">
                    <InformacionProducto/>
                </div>
                <div className="col-lg-3 col-sm-12 text-center">
                    <ProductoImagen/>
                    <span className='text-center mt-5'>Click en la imagen para hacerla mas grande</span>
                </div>
                

            </div>

          
                <div className="mt-5">
                    <Registros/>
                </div>
       

            </div>
    )
}