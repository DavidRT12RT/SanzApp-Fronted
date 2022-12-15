import React from 'react';
import { SanzApp } from './SanzApp';
import { createRoot } from 'react-dom/client';

//Cargando estilos de ant design (General para todos los componentes)
import "antd/dist/antd.css";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<SanzApp/>);
//ReactDOM.render(<SanzApp />,document.getElementById('root'));


