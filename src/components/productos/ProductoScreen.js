import React, { useState } from 'react';
import { Card } from 'antd';
import { ViewInfo } from './components/ViewInfo';
import { Link } from 'react-router-dom';
import { EditInfo } from './components/EditInfo';

const tabList = [
  {
    key: 'tab1',
    tab: 'Información',
  },
  {
    key: 'tab2',
    tab: 'Editar información',
  },
];

const contentList = {
  tab1: <ViewInfo/>,
  tab2:<EditInfo/>,
};

export const ProductoScreen = () => {
  const [activeTabKey1, setActiveTabKey1] = useState('tab1');

  const onTab1Change = key => {
    setActiveTabKey1(key);
  };

  return (
    <div className="container mt-sm-2 mt-lg-4 ">
      <Card
        style={{ width: '100%' }}
        title="Información detallada del producto"
        extra={<Link to="/aplicacion/almacen/">Regresar a almacen</Link>}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={key => {
          onTab1Change(key);
        }}
      >
        {contentList[activeTabKey1]}
      </Card>
    </div>
  );
};