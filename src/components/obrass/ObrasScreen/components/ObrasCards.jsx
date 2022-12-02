import { Input } from 'antd';
import React from 'react'
import ObraCard from './ObraCard';

const ObrasCards = ({obras,setParametrosBusqueda}) => {

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

    return (
        <div className="obrasCardsContainer">
            <Input.Search size="large" allowClear onSearch={handleChangeInputSearch} enterButton={<button type="primary" className="btn btn-warning">Buscar</button>} placeholder="busca una obra por su nombre..."/>

            <h1 className="titulo-descripcion" style={{alignSelf:"start"}}>Se han encontrado <span className="text-warning">{obras.length}</span> obras!</h1>
            {obras.map(obra => {
                return <ObraCard obra={obra} key={obra._id}/>
            })}

            <nav aria-label="..." className="mt-3" style={{alignSelf:"end"}}>
                <ul class="pagination pagination-lg">
                    <li class="page-item disabled"><a class="page-link" href="#" tabindex="-1">1</a></li>
                    <li class="page-item"><a class="page-link text-warning" href="#">2</a></li>
                    <li class="page-item"><a class="page-link text-warning" href="#">3</a></li>
                </ul>
            </nav>

        </div>
    )
}

export default ObrasCards;
