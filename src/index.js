import React from 'react';
import { SanzApp } from './SanzApp';
import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<SanzApp/>);
//ReactDOM.render(<SanzApp />,document.getElementById('root'));


