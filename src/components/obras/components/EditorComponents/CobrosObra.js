import { Button, Divider, Table } from "antd"

export const CobrosObra = ({socket,obraInfo}) =>{

    const columns = [
        {
            title:<p className="titulo-descripcion">Monto de cobro</p>,
        },
        {
            title:<p className="titulo-descripcion"></p>
        }
    ];
    return(
        <div className="container p-3 p-lg-5" style={{minHeight:"100vh"}}>
            <h1 className="titulo">Cobros de la obra</h1>
            <p className="descripcion">En esta sección se presentaran los cobros que se han hecho de la obra.</p>
            <Divider/>
            <Button type="primary">Agregar cobro</Button>
            <Table columns={columns} className="mt-3"/>
        </div>
    )
}