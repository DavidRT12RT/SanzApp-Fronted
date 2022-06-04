import { Row, Col , Typography}  from 'antd';
import React, { useState } from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import { SantanderForm } from './components/SantanderForm'; 
import { Banbanjio } from './components/BanbajioForm';
import { OtroForm } from './components/OtroForm';


export const RegistrarObra = () => {
    const { Text } = Typography;
    const tabList = [
        {
          key: 'tab1',
          tab: 'Santander',
        },
        {
          key: 'tab2',
          tab: 'Banjico',
        },
        {
          key:"tab3",
          tab:"Otro..."
        }
    ];
    const contentList = {
      tab1: <SantanderForm/>,
      tab2:<Banbanjio/>,
      tab3:<OtroForm/>,
    };

    const [activeTabKey1, setActiveTabKey1] = useState('tab1');

    const onTab1Change = key => {
      setActiveTabKey1(key);
    };
  
    return (
        <div className='container background mt-lg-5 p-5 shadow rounded'>
            <h1>Crear una nueva obra</h1>
            <span className='lead'>¿Que información tendra la obra o servicio?</span>
            <Row gutter={16} className="mt-4 mt-lg-5 ">
                <Col xs={24} lg={20} className="gutter-row">
                <Card
                    style={{ width: '100%' }}
                    title="Información de la obra / servicio"
                    extra={<Link to="/aplicacion/obras/">Regresar a la pestaña de obras</Link>}
                    tabList={tabList}
                    activeTabKey={activeTabKey1}
                    onTabChange={key => {
                        onTab1Change(key);
                    }}
                >
                    {contentList[activeTabKey1]}
                </Card>
                </Col>
                <Col xs={0} lg={4}className="gutter-row">
                    <Text type="secondary">Seleciona un formulario dependiendo de la empresa a la que se le realizara el servicio</Text>
                    <br/><br/>
                    <Text type="secondary">
                        Si tienes mas dudas habilita el tutorial de inicio donde se explcia cada campo de este componente
                    </Text>
                </Col>
            </Row>
        </div>
    )
}
