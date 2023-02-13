import { Input } from 'antd';
import React, { useEffect, useState } from 'react'
import ObraCard from './ObraCard';

const ObrasCards = ({obras,search,informacionObras,setParametrosBusqueda}) => {

    //console.log("Info:",informacionObras.totalObrasEncontradas);
    const [pagina, setPagina] = useState(1);

    const handleChangeInputSearch = (e) => {
        if(e.length > 0) {
            setParametrosBusqueda((parametrosAnteriores) => ({
                ...parametrosAnteriores,
                titulo:e
            }));
        }else{
            setParametrosBusqueda((parametrosAnteriores) => {
                delete parametrosAnteriores.titulo
                return {...parametrosAnteriores}
            });
        }
    }

    const handleChangePagina = (e) => {
        setPagina(e);
        setParametrosBusqueda((parametrosAnteriores) => ({
            ...parametrosAnteriores,
            pagina:e
        }));
    }

    const generarBotones = () => {
        //Sacar numero de paginas
        let numPaginas = Math.round(informacionObras.totalObrasEncontradas / 5);
        if((informacionObras.totalObrasEncontradas % 5) != 0) numPaginas++;
        //console.log("Numero de paginas:",numPaginas);
        const paginas = [];
        for(let i = 1; i <= numPaginas; i++) paginas.push(<li className={"page-item "+(pagina === i && "disabled")} onClick={() => handleChangePagina(i)}><a className={"page-link "+(pagina != i ? "text-dark" : "text-warning")}>{i}</a></li>);
        return paginas;
    }
    
    
    return (
        <div className="obrasCardsContainer">
            <Input.Search size="large" className="descripcion" allowClear onSearch={handleChangeInputSearch} enterButton={<button type="primary" className="btn btn-warning">Buscar</button>} placeholder="busca una obra por su nombre..."/>

            <h1 className="titulo-descripcion" style={{alignSelf:"start"}}>Se han encontrado <span className="text-warning">{informacionObras.totalObrasEncontradas}</span> obras!</h1>
            {obras.map(obra => {
                return <ObraCard obra={obra} key={obra._id}/>
            })}

            <nav aria-label="..." className="mt-3" style={{alignSelf:"end"}}>
                <ul className="pagination pagination-lg">
                    {generarBotones()}
                </ul>
            </nav>

        </div>
    )
}

export default ObrasCards;
