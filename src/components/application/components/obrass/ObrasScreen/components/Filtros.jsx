import { Checkbox, DatePicker } from 'antd';
import React, { useState } from 'react'
import locale from "antd/es/date-picker/locale/es_ES"
import { useEmpresas } from '../../../../../../hooks/useEmpresas';

const Filtros = ({setParametrosBusqueda}) => {
    
    const { isLoading,empresas } = useEmpresas();
    const [empresaSeleccionadas, setEmpresaSeleccionadas] = useState([]);

    const handleChangeEmpresa = (e) => {
        setEmpresaSeleccionadas([...e]);
        setParametrosBusqueda((parametrosAnteriores) => {
            delete parametrosAnteriores.pagina;
            return {
                ...parametrosAnteriores,
                empresa:e.map(empresa => empresa._id)
            }
        });
    }

    const handleChangeParametrosBusqueda = (e,tipo) => {
        setParametrosBusqueda((parametrosAnteriores) => {
            delete parametrosAnteriores.pagina;
            return {
                ...parametrosAnteriores,
                [tipo]:e
            };
        });
    }

    return (
        <>
            <div className="filtro">
                <h1 className="titulo">Empresa</h1>
                <div className="filtroBorder bg-warning"/>
                <Checkbox.Group className="d-flex flex-column" onChange={handleChangeEmpresa}>
                    {
                        empresas.map((empresa,index) => {
                            if(index === 0) return <Checkbox value={empresa} key={empresa._id} className="ms-2">{empresa.nombre}</Checkbox>
                            return <Checkbox value={empresa} key={empresa._id}>{empresa.nombre}</Checkbox>
                        })
                    }
                </Checkbox.Group>
           </div>

            <div className="filtro">
                <h1 className="titulo">Sucursales</h1>
                <div className="filtroBorder bg-warning"/>
                <Checkbox.Group className="d-flex flex-column gap-3" onChange={(e) => handleChangeParametrosBusqueda(e,"sucursal")}>
                    {
                        empresaSeleccionadas.length > 0 ? 
                        empresaSeleccionadas.map(empresa => {
                            return (
                               <>
                                    <h1 className="titulo-descripcion">{empresa.nombre}</h1>
                                    {empresa.sucursales.map((sucursal,index) => {
                                        if(index === 0) return <Checkbox className="ms-2" value={sucursal._id} key={sucursal._id}>{sucursal.nombre}</Checkbox>
                                        return <Checkbox value={sucursal._id} key={sucursal._id}>{sucursal.nombre}</Checkbox>
                                    })}
                                </> 
                            )
                        })
                        :
                        <h1 className="titulo-descripcion text-danger">Ninguna empresa seleccionada aun...</h1>
                    }
                </Checkbox.Group>
           </div>

           <div className="filtro">
                <h1 className="titulo">Fecha de creacion</h1>
                <div className="filtroBorder bg-warning"/>
                <DatePicker.RangePicker locale={locale}/>
           </div>

           <div className="filtro">
                <h1 className="titulo">Tipo de reporte</h1>
                <div className="filtroBorder bg-warning"/>
                <Checkbox.Group className="d-flex flex-column" onChange={(e) => {handleChangeParametrosBusqueda(e,"tipoReporte")}}>
                    <Checkbox value={"CORRECTIVO"} key={"CORRECTIVO"} className="ms-2">Correctivo</Checkbox>
                    <Checkbox value={"PREVENTIVO"} key={"PREVENTIVO"}>Preventivo</Checkbox>
                </Checkbox.Group>
           </div>

           <div className="filtro">
                <h1 className="titulo">Estado de la obra</h1>
                <div className="filtroBorder bg-warning"/>
                <Checkbox.Group className="d-flex flex-column" onChange={(e) => {handleChangeParametrosBusqueda(e,"estado")}}>
                    <Checkbox value={"PRESUPUESTO-CLIENTE"} key={"PRESUPUESTO-CLIENTE"} className="ms-2">Presupuesto con cliente</Checkbox>
                    <Checkbox value={"EN-PROGRESO"} key={"EN-PROGRESO"}>En progreso</Checkbox>
                    <Checkbox value={"FINALIZADA"} key={"FINALIZADA"}>Finalizada</Checkbox>
                </Checkbox.Group>

           </div>

        </>
    )
}

export default Filtros;
