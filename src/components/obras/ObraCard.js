import React from 'react'
import { Link } from 'react-router-dom';
import { Steps } from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';

const { Step } = Steps;


export const ObraCard = ({titulo,situacionReporte,plaza,sucursal,tipoReporte,numeroTrack,observaciones,_id,fecha,descripcion}) => {

    return (
      <>
        <div className="p-5 mb-5 rounded shadow">
          <h1 className>{titulo}</h1>
          <div className="mt-3">
            <p className="lead">{tipoReporte} {numeroTrack}</p>
            <h5 className=''>{descripcion}</h5>
          </div>
          <div className="mt-5">
            <Steps>
              <Step status="finish" title="Presupuesto con el cliente" icon={<UserOutlined />} />
              <Step status="process" title="Desarollo de la obra" icon={<LoadingOutlined />} />
              <Step status="wait" title="Finalizado" icon={<SmileOutlined />} />
            </Steps>
          </div>
            <div className="mt-5">
              <Link to={`/aplicacion/obras/${_id}`} className='btn btn-primary'>Ver detalles completos de la obra</Link>
              <Link to={`/aplicacion/obra/editor/${_id}`} className="btn btn-primary ms-2">Editar obra</Link>
            </div>
          </div>
          </>
    ) 
}
