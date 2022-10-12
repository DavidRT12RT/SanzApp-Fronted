import { Button, Checkbox, Divider, Input, message, Table, Tag } from 'antd'
import React, { useEffect, useState } from 'react'

//CSS
import "./assets/styleSalidasAlmacen.css";
import imagenSalidas from "./assets/imgs/juicy-boy-with-open-laptop.png";
import { useSalidas } from '../../../../hooks/useSalidas';
import { SalidaCard } from './SalidaCard';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { fetchConToken } from '../../../../helpers/fetch';

export const SalidasAlmacenNew = () => {

    const { isLoading,salidas,setSalidas} = useSalidas();
    const [registrosSalidas, setRegistrosSalidas] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [parametrosBusqueda, setParametrosBusqueda] = useState({});
    const { search } = useLocation();
 

    useEffect(() => {
		salidas.map(registro => registro.key = registro._id);
        setRegistrosSalidas(salidas)
    }, [salidas]);

    useEffect(() => {
        //Hacer una peticion a el servidor de obras y pasarle el parametro de busqueda
        let query = {};
        for(const property in parametrosBusqueda){
            query = {...query,[property]:parametrosBusqueda[property]}
        }
        setSearchParams(query);

    }, [parametrosBusqueda]);

    useEffect(() => {
        const fetchData = async () => {
            const resp = await fetchConToken(`/salidas/${search}`);
            const body = await resp.json();
            if(resp.status != 200) return message.error(body.msg);  
            //Busqueda con exito!
            setSalidas(body.salidas);
        }
        fetchData();
    }, [search]);



    return (
        <div className="containerSalidas">
            <Input.Search size="large" enterButton className="descripcion barraBusquedaSalidas" placeholder="Buscar una salida por el concepto..."/>
            <div className="containerRegister row mt-3">
                <div className="col-12 col-lg-9">
                    <h1 className="titulo text-warning">Buscar crear una nueva salida?</h1>
                    <p className="descripcion">Crea una nueva salida en el almacen pulsando el siguiente boton</p>
                    <Link to={`/almacen/retirar/`}><button type="button" class="btn btn-warning">Registrar nueva salida</button></Link>
                </div>
                <div className="col-lg-3 d-none d-lg-block">
                    <img src={imagenSalidas} className="imagenRegister"/>
                </div>
            </div>

            <div className="row mt-5 containerBusquedaSalidas">
                <div className="col-12 col-lg-2">
                    <h1 className="titulo-descripcion" style={{fontSize:"20px"}}>FILTRAR POR</h1>
                    <Divider/>
                    <h1 className="titulo-descripcion" style={{fontSize:"13px"}}>Tipo de salida</h1>
                    <Checkbox.Group onChange={(valores)=>{
                        setParametrosBusqueda({
                            ...parametrosBusqueda,
                                tipo:valores
                        });
                    }} className="d-flex flex-column">
                        <Checkbox value={"obra"} key={"obra"} className="ms-2">OBRA</Checkbox>
                        <Checkbox value={"resguardo"} key={"resguardo"}>RESGUARDO</Checkbox>
                        <Checkbox value={"merma"} key={"merma"}>MERMA</Checkbox>
                    </Checkbox.Group>
                </div>
                <div className="col-12 col-lg-10 mt-3 mt-lg-0">
                    <h1 className="titulo-descripcion" style={{fontSize:"20px"}}>SALIDAS ENCONTRADAS</h1>
                    <Divider/>
                    <div className="containerSalidasCards">
                        {
                            registrosSalidas.map(salida => (
                                <SalidaCard salida={salida} key={salida.key}/>
                            ))
                        }
                    </div>
                </div>
           </div>
       </div>

    )
}
